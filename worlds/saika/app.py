import asyncio
from asyncio.subprocess import DEVNULL
import asyncio.subprocess
from pathlib import Path
import subprocess
import sys
import webview

from .storage import Storage
from .session import Session, SessionInput
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
        App(server_url).start()


class App:
    def __init__(self, window_url: str) -> None:
        self.win = webview.create_window(
            title="Saika", url=window_url, js_api=JsApi(self)
        )

    def start(self):
        webview.start(ssl=True, debug=True)

    def update_view_state(self):
        pass  # todo: run global callback on frontend to update react state


class JsApi:
    def __init__(self, app: App) -> None:
        self._app = app
        self._sessions: dict[str, Session] = {}
        self.storage_common = Storage("common")

    def add_session(self, args: SessionInput):
        self._sessions[args["id"]] = Session(args)

    def remove_session(self, id: str):
        session = self._sessions[id]
        session.stop()
        del self._sessions[id]
