import asyncio
from asyncio.subprocess import DEVNULL
import asyncio.subprocess
from dataclasses import dataclass
import dataclasses
import json
from pathlib import Path
import subprocess
import sys
from typing import Final, Literal
from uuid import uuid4
import webview

from .storage import Storage
from .lib.http import wait_until_reachable
from .lib.subprocess import ensure_killed


async def main():
    server_host = "localhost"
    server_port = 5173
    server_url = f"http://{server_host}:{server_port}"

    process_config = {
        "cwd": Path(__file__).parent / "web",
        "stdin": DEVNULL,
    }

    if sys.platform == "win32":
        process_config["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP

    server = await asyncio.subprocess.create_subprocess_exec(
        *("bun", "dev"),
        *("--host", server_host),
        *("--port", str(server_port)),
        **process_config,
    )

    async with ensure_killed(server):
        await wait_until_reachable(server_url, timeout_seconds=10)
        app = App(server_url)
        app._start()


@dataclass
class AppState:
    servers: dict[str, "ServerState"] = dataclasses.field(default_factory=dict)


@dataclass
class ServerState:
    name: str
    address: str
    password: str
    games: list["ServerGameListData"] = dataclasses.field(default_factory=list)
    sessions: dict[str, "SessionState"] = dataclasses.field(default_factory=dict)


@dataclass
class ServerGameListData:
    id: str
    display_name: str


@dataclass
class SessionState:
    game_name: str
    player_name: str
    connection_status: Literal["offline", "connecting", "online"] = "offline"


class App:
    def __init__(self, window_url: str) -> None:
        self._state: Final = AppState()
        self._storage: Final = Storage("common")

        self._load_state()

        if not (
            win := webview.create_window(title="Saika", url=window_url, js_api=self)
        ):
            raise RuntimeError("Failed to create window")

        self._win = win
        self._win_ready = False

    def _start(self):
        webview.start(ssl=True, debug=True)

    def _load_state(self) -> None:
        servers_data = self._storage.get("servers") or {}

        for server_id, server_dict in servers_data.items():
            server_state = ServerState(
                name=server_dict["name"],
                address=server_dict["address"],
                password=server_dict["password"],
            )

            sessions_data = server_dict.get("sessions", {})
            for session_id, session_dict in sessions_data.items():
                session_state = SessionState(
                    game_name=session_dict["game_name"],
                    player_name=session_dict["player_name"],
                )
                server_state.sessions[session_id] = session_state

            self._state.servers[server_id] = server_state

    def _save_state(self):
        servers_data = {
            server_id: {
                "name": server_state.name,
                "address": server_state.address,
                "password": server_state.password,
                "sessions": {
                    session_id: {
                        "game_name": session_state.game_name,
                        "player_name": session_state.player_name,
                    }
                    for session_id, session_state in server_state.sessions.items()
                },
            }
            for server_id, server_state in self._state.servers.items()
        }

        self._storage.set("servers", servers_data)

    def _send_state_update(self):
        if not self._win_ready:
            return

        servers_data = {
            server_id: dataclasses.asdict(server_state)
            for server_id, server_state in self._state.servers.items()
        }

        state_json = json.dumps({"servers": servers_data})
        self._win.evaluate_js(f"window.updateAppState({state_json})")

    def _commit_state(self):
        self._save_state()
        self._send_state_update()

    def notify_ready(self):
        self._win_ready = True
        self._send_state_update()

    def add_server(self, name: str, address: str, password: str):
        id = str(uuid4())
        self._state.servers[id] = ServerState(name, address, password)
        self._commit_state()
        return id

    def remove_server(self, id: str):
        del self._state.servers[id]
        self._commit_state()

    def add_session(self, server_id: str, game_name: str, player_name: str):
        if not (server := self._state.servers.get(server_id, None)):
            print(f"warning: server with id {server_id} does not exist")
            return

        id = str(uuid4())
        server.sessions[id] = SessionState(game_name, player_name)

    def remove_session(self, server_id: str, session_id: str):
        if not (server := self._state.servers.get(server_id, None)):
            print(f"warning: server with id {server_id} does not exist")
            return

        if session_id not in server.sessions:
            print(f"warning: session with id {session_id} does not exist")
            return

        del server.sessions[session_id]
        self._commit_state()
