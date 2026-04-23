from __future__ import annotations

import sys
from pathlib import Path

SERVICE_ROOT = Path(__file__).resolve().parent / "simulation-service"
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from simulation_core.defaults import (  # noqa: E402
    DEFAULT_EXAM_PROBABILITY,
    DEFAULT_K_LEVEL3,
    DEFAULT_K_LEVEL4,
    DEFAULT_NUM_CT,
    DEFAULT_NUM_DOCTORS,
    DEFAULT_NUM_LAB,
    DEFAULT_NUM_NURSES,
    DEFAULT_NUM_XRAY,
    DEFAULT_SCENARIOS,
    DEFAULT_SIMULATION_TIME,
    DEFAULT_TARGET_TIME_LEVEL3,
    DEFAULT_TARGET_TIME_LEVEL4,
)
from simulation_core.models import SimulationParameters  # noqa: E402

NUM_DOCTORS = DEFAULT_NUM_DOCTORS
NUM_NURSES = DEFAULT_NUM_NURSES
NUM_CT = DEFAULT_NUM_CT
NUM_XRAY = DEFAULT_NUM_XRAY
NUM_LAB = DEFAULT_NUM_LAB
EXAM_PROBABILITY = DEFAULT_EXAM_PROBABILITY
TARGET_TIME_LEVEL3 = DEFAULT_TARGET_TIME_LEVEL3
TARGET_TIME_LEVEL4 = DEFAULT_TARGET_TIME_LEVEL4
K_LEVEL3 = DEFAULT_K_LEVEL3
K_LEVEL4 = DEFAULT_K_LEVEL4
SIMULATION_TIME = DEFAULT_SIMULATION_TIME


def to_parameters() -> SimulationParameters:
    return SimulationParameters(
        num_doctors=NUM_DOCTORS,
        num_nurses=NUM_NURSES,
        num_ct=NUM_CT,
        num_xray=NUM_XRAY,
        num_lab=NUM_LAB,
        simulation_time=SIMULATION_TIME,
        exam_probability=EXAM_PROBABILITY,
        target_time_level3=TARGET_TIME_LEVEL3,
        target_time_level4=TARGET_TIME_LEVEL4,
        k_level3=K_LEVEL3,
        k_level4=K_LEVEL4,
    )
