import asyncio
from asyncio.subprocess import DEVNULL
from pathlib import Path
import subprocess
import sys
import webview

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

        class Api:
            def log(self, *values):
                print(*values)

        webview.create_window(title="Saika", url=server_url, js_api=Api())
        webview.start(ssl=True, debug=True)
