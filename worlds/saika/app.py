import asyncio
from asyncio.subprocess import DEVNULL
import asyncio.subprocess
import dataclasses
import json
from pathlib import Path
import subprocess
import sys
from typing import Final
from uuid import uuid4
import webview
from Utils import local_path

from .app_state import ServerState, SessionState, AppState
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


class App:
    _state_file_path: Final = Path(local_path("saika_data", "app_state.json"))

    def __init__(self, window_url: str) -> None:
        self._state: Final = self._load_state()

        if not (
            win := webview.create_window(title="Saika", url=window_url, js_api=self)
        ):
            raise RuntimeError("Failed to create window")

        self._win = win
        self._win_ready = False

    def _start(self):
        webview.start(ssl=True, debug=True)

    @classmethod
    def _load_state(cls) -> AppState:
        if not cls._state_file_path.exists():
            return AppState()

        with open(cls._state_file_path, "r", encoding="utf-8") as state_file:
            return AppState.from_saved(json.load(state_file))

    def _save_state(self):
        with open(self._state_file_path, "w", encoding="utf-8") as state_file:
            json.dump(self._state.saved, state_file, indent=4)

    def _send_state_update(self):
        if not self._win_ready:
            return

        state_json = json.dumps(dataclasses.asdict(self._state))
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
