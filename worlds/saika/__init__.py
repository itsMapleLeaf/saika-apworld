import asyncio
from . import app
from worlds.LauncherComponents import components, Component

components.append(
    Component(
        "Saika Client",
        func=lambda: asyncio.run(app.main()),
    )
)
