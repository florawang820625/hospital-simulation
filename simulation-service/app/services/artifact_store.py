from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class LocalArtifactStore:
    def __init__(self, base_path: Path):
        self.base_path = base_path

    def save(self, simulation_id: str, artifact_name: str, payload: bytes | dict[str, Any]) -> Path:
        target_dir = self.base_path / simulation_id
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / artifact_name

        if isinstance(payload, bytes):
            target_path.write_bytes(payload)
        else:
            target_path.write_text(
                json.dumps(payload, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        return target_path

    def resolve(self, simulation_id: str, artifact_name: str) -> Path:
        return self.base_path / simulation_id / artifact_name
