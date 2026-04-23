from __future__ import annotations

from .models import PatientRecord, SimulationParameters


def calculate_priority(
    patient: PatientRecord,
    current_time: float,
    parameters: SimulationParameters,
) -> int:
    wait_time = current_time - patient.arrival_time

    if patient.triage_level == "Level III":
        threshold = parameters.target_time_level3 - parameters.k_level3
        return 0 if wait_time >= threshold else 2

    if patient.triage_level == "Level IV":
        threshold = parameters.target_time_level4 - parameters.k_level4
        return 0 if wait_time >= threshold else 3

    if patient.triage_level == "Return":
        return 1

    return 99
