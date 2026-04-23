from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from simulation_core import SimulationParameters, export_result, run_simulation


def test_run_simulation_returns_records():
    result = run_simulation(SimulationParameters(simulation_time=180, random_seed=7))

    assert result.summary.total_patients > 0
    assert result.summary.total_events >= len(result.event_log)
    assert result.event_log[0]["event_type"] == "抵達急診"
    assert "waiting_time" in result.patient_summary[0]


def test_export_result_supports_json_and_csv():
    result = run_simulation(SimulationParameters(simulation_time=180, random_seed=7))

    json_payload = export_result(result, "result.json")
    csv_payload = export_result(result, "event_log.csv")

    assert isinstance(json_payload, dict)
    assert "summary" in json_payload
    assert isinstance(csv_payload, bytes)
    assert csv_payload.startswith(b"\xef\xbb\xbf")
