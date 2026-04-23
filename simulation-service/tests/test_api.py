from __future__ import annotations

import sys
from pathlib import Path

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("httpx")

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient

from app.main import create_app


def test_healthcheck(tmp_path: Path):
    client = TestClient(create_app(artifact_root=tmp_path))

    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_simulation_returns_result(tmp_path: Path):
    client = TestClient(create_app(artifact_root=tmp_path))

    response = client.post(
        "/api/v1/simulations",
        json={
            "num_doctors": 1,
            "num_nurses": 2,
            "num_ct": 1,
            "num_xray": 1,
            "num_lab": 1,
            "simulation_time": 180,
            "exam_probability": 0.6,
            "random_seed": 7,
        },
    )

    payload = response.json()

    assert response.status_code == 200
    assert payload["status"] == "completed"
    assert payload["summary"]["total_patients"] > 0
    assert payload["event_log"]


def test_create_app_reads_artifact_root_from_env(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    monkeypatch.setenv("SIMULATION_ARTIFACT_ROOT", str(tmp_path))

    app = create_app()

    assert app.state.artifact_store.base_path == tmp_path
