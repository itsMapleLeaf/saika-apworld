import asyncio
import requests


async def wait_until_reachable(url: str, timeout_seconds: float):
    async with asyncio.timeout(timeout_seconds):
        while True:
            try:
                response = await asyncio.to_thread(requests.options, url)
                if response.ok:
                    break
                else:
                    print(f"{response.status_code=}")
            except (requests.HTTPError, requests.ConnectionError):
                print(f"failed to connect")

            print(f"retrying...")
            await asyncio.sleep(0.1)
