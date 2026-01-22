import asyncio
from asyncio.subprocess import DEVNULL
import asyncio.threads
import asyncio.subprocess
from multiprocessing import Process, Queue
from pathlib import Path
import subprocess
import sys
from typing import TypedDict
import webview

from .lib.http import wait_until_reachable
from .lib.subprocess import ensure_killed


class SessionInput(TypedDict):
    id: str
    server_address: str
    server_password: str
    game_name: str
    player_name: str


class Session:
    def __init__(self, input: SessionInput) -> None:
        self.id = input["id"]
        self.input = input

        self.stop_queue: Queue[None] = Queue()

        self.connection_thread = Process(
            target=thread_main,
            args=(input, self.stop_queue),
            daemon=True,
        )
        self.connection_thread.start()

    def stop(self):
        self.stop_queue.put(None)


def thread_main(*args):
    async def main(input: SessionInput, stop_queue: Queue):
        from CommonClient import CommonContext

        ctx = CommonContext(
            f"wss://{input["server_address"]}", input["server_password"]
        )
        ctx.auth = input["player_name"]
        ctx.game = input["game_name"]

        print("connecting...")

        await ctx.connect()

        print("connection open")

        try:
            await asyncio.threads.to_thread(stop_queue.get)
        except:
            print("stop signal received")

        await ctx.shutdown()

        print("connection ended")

    asyncio.run(main(*args))


class JsApi:
    def __init__(self) -> None:
        self._sessions: dict[str, Session] = {}

    def add_session(self, args: SessionInput):
        self._sessions[args["id"]] = Session(args)

    def remove_session(self, id: str):
        session = self._sessions[id]
        session.stop()
        del self._sessions[id]


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

        webview.create_window(title="Saika", url=server_url, js_api=JsApi())
        webview.start(ssl=True, debug=True)
