from asyncio.subprocess import Process
from contextlib import asynccontextmanager
import psutil


@asynccontextmanager
async def ensure_killed(process: Process):
    """Ensures every child processes of a given process are killed"""
    try:
        yield process
    finally:
        if process.pid is None or process.returncode is not None:
            return
        try:
            parent = psutil.Process(process.pid)
            for child in parent.children(recursive=True):
                print(f"killing child process {child.name()=} {child.pid=}")
                child.kill()
            print(f"killing parent process {parent.name()=} {parent.pid=}")
            parent.kill()
        except psutil.NoSuchProcess:
            pass
