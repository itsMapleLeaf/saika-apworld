import json
import os
from pathlib import Path
from typing import Any
from Utils import user_path


class Storage:

    def __init__(self, store_name: str) -> None:
        self._data: dict[str, Any] = {}
        self._file_path = Path(user_path("saika_data", f"{store_name}.json"))

        if self._file_path.exists():
            with open(self._file_path, "r", encoding="utf-8") as f:
                self._data = json.load(f)

    def _save(self) -> None:
        os.makedirs(self._file_path.parent, exist_ok=True)
        with open(self._file_path, "w", encoding="utf-8") as f:
            json.dump(self._data, f, indent=4)

    def get(self, key: str) -> Any | None:
        return self._data.get(key, None)

    def set(self, key: str, value: Any) -> None:
        self._data[key] = value
        self._save()
