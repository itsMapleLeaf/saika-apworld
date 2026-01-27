import dataclasses
from dataclasses import dataclass
from typing import Literal


@dataclass
class AppState:
    servers: dict[str, "ServerState"] = dataclasses.field(default_factory=dict)

    @property
    def saved(self):
        return {
            "servers": {
                server_id: server.saved for server_id, server in self.servers.items()
            },
        }

    @staticmethod
    def from_saved(data: dict) -> "AppState":
        return AppState(
            servers={
                server_id: ServerState.from_saved(server_dict)
                for server_id, server_dict in data.get("servers", {}).items()
            }
        )


@dataclass
class ServerState:
    name: str
    address: str
    password: str
    games: list["Game"] = dataclasses.field(default_factory=list)
    sessions: dict[str, "SessionState"] = dataclasses.field(default_factory=dict)

    @property
    def saved(self):
        return {
            "name": self.name,
            "address": self.address,
            "password": self.password,
            "sessions": {
                session_id: session.saved
                for session_id, session in self.sessions.items()
            },
        }

    @staticmethod
    def from_saved(data: dict) -> "ServerState":
        return ServerState(
            name=data["name"],
            address=data["address"],
            password=data["password"],
            sessions={
                session_id: SessionState.from_saved(session_dict)
                for session_id, session_dict in data.get("sessions", {}).items()
            },
        )

    @dataclass
    class Game:
        id: str
        display_name: str


@dataclass
class SessionState:
    game_name: str
    player_name: str
    connection_status: Literal["offline", "connecting", "online"] = "offline"

    @property
    def saved(self):
        return {
            "game_name": self.game_name,
            "player_name": self.player_name,
        }

    @staticmethod
    def from_saved(data: dict) -> "SessionState":
        return SessionState(
            game_name=data["game_name"],
            player_name=data["player_name"],
        )
