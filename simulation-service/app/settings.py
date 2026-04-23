from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

DEFAULT_ARTIFACT_ROOT = Path(__file__).resolve().parents[1] / ".runtime" / "artifacts"
DEFAULT_PORT = 8000


def _parse_cors_origins(raw_value: str | None) -> list[str]:
    if raw_value is None or not raw_value.strip():
        return ["*"]

    origins = [origin.strip() for origin in raw_value.split(",") if origin.strip()]
    return origins or ["*"]


@dataclass(frozen=True)
class AppSettings:
    artifact_root: Path
    cors_origins: list[str]
    port: int


def load_settings() -> AppSettings:
    raw_port = os.getenv("PORT", str(DEFAULT_PORT))
    try:
        port = int(raw_port)
    except ValueError:
        port = DEFAULT_PORT

    artifact_root = Path(os.getenv("SIMULATION_ARTIFACT_ROOT", str(DEFAULT_ARTIFACT_ROOT)))
    cors_origins = _parse_cors_origins(os.getenv("CORS_ORIGINS"))
    return AppSettings(artifact_root=artifact_root, cors_origins=cors_origins, port=port)
