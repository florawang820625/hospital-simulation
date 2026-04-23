from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from .defaults import (
    DEFAULT_EXAM_PROBABILITY,
    DEFAULT_K_LEVEL3,
    DEFAULT_K_LEVEL4,
    DEFAULT_NUM_CT,
    DEFAULT_NUM_DOCTORS,
    DEFAULT_NUM_LAB,
    DEFAULT_NUM_NURSES,
    DEFAULT_NUM_XRAY,
    DEFAULT_RANDOM_SEED,
    DEFAULT_SIMULATION_TIME,
    DEFAULT_TARGET_TIME_LEVEL3,
    DEFAULT_TARGET_TIME_LEVEL4,
    EVENT_ARRIVAL,
    EVENT_START_DOCTOR,
    EVENT_DISCHARGE,
)


@dataclass(slots=True)
class SimulationParameters:
    num_doctors: int = DEFAULT_NUM_DOCTORS
    num_nurses: int = DEFAULT_NUM_NURSES
    num_ct: int = DEFAULT_NUM_CT
    num_xray: int = DEFAULT_NUM_XRAY
    num_lab: int = DEFAULT_NUM_LAB
    simulation_time: int = DEFAULT_SIMULATION_TIME
    exam_probability: float = DEFAULT_EXAM_PROBABILITY
    target_time_level3: float = DEFAULT_TARGET_TIME_LEVEL3
    target_time_level4: float = DEFAULT_TARGET_TIME_LEVEL4
    k_level3: float = DEFAULT_K_LEVEL3
    k_level4: float = DEFAULT_K_LEVEL4
    random_seed: int | None = DEFAULT_RANDOM_SEED

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class SimulationSummary:
    total_patients: int
    total_events: int
    average_waiting_time: float
    p95_waiting_time: float
    average_time_in_system: float
    average_service_time: float
    resource_utilization: dict[str, float]

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class SimulationResult:
    parameters: SimulationParameters
    summary: SimulationSummary
    event_log: list[dict[str, Any]]
    patient_summary: list[dict[str, Any]]
    artifacts: dict[str, str] = field(default_factory=dict)

    def to_dict(
        self,
        *,
        include_event_log: bool = True,
        include_patient_summary: bool = True,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "parameters": self.parameters.to_dict(),
            "summary": self.summary.to_dict(),
            "artifacts": dict(self.artifacts),
        }
        if include_event_log:
            payload["event_log"] = self.event_log
        if include_patient_summary:
            payload["patient_summary"] = self.patient_summary
        return payload


@dataclass
class PatientRecord:
    patient_id: str
    triage_level: str
    arrival_time: float
    event_log: list[dict[str, Any]] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.record_event(self.arrival_time, EVENT_ARRIVAL, resource="Triage")

    def record_event(self, current_time: float, event_name: str, resource: str = "") -> None:
        resource_label = resource if resource else "-"
        record = {
            "patient_id": self.patient_id,
            "patient": self.patient_id,
            "triage_level": self.triage_level,
            "arrival_clock": round(self.arrival_time, 2),
            "timestamp": round(current_time, 2),
            "event": event_name,
            "event_type": event_name,
            "resource_used": resource,
            "resource": resource_label,
            "desc": (
                f"{self.patient_id} ({self.triage_level}) - {event_name}"
                if resource_label == "-"
                else f"{self.patient_id} ({self.triage_level}) - {event_name} [{resource_label}]"
            ),
        }
        self.event_log.append(record)

    def build_patient_summary(self) -> dict[str, Any]:
        arrival_clock = round(self.arrival_time, 2)
        enter_facility_clock: float | None = None
        departure_clock: float | None = None

        for log in self.event_log:
            event_name = log.get("event", "")
            event_time = float(log.get("timestamp", self.arrival_time))

            if event_name == EVENT_START_DOCTOR and enter_facility_clock is None:
                enter_facility_clock = event_time

            if event_name == EVENT_DISCHARGE:
                departure_clock = event_time

        if enter_facility_clock is None:
            enter_facility_clock = float(arrival_clock)

        if departure_clock is None:
            departure_clock = max(float(log.get("timestamp", 0)) for log in self.event_log)

        waiting_time = max(0.0, enter_facility_clock - float(arrival_clock))
        service_time = max(0.0, departure_clock - enter_facility_clock)
        time_in_system = max(0.0, departure_clock - float(arrival_clock))

        return {
            "patient_id": self.patient_id,
            "arrival_clock": round(float(arrival_clock), 2),
            "enter_facility_clock": round(enter_facility_clock, 2),
            "waiting_time": round(waiting_time, 2),
            "service_time": round(service_time, 2),
            "departure_clock": round(departure_clock, 2),
            "time_in_system": round(time_in_system, 2),
        }


def extract_all_logs(patients: list[PatientRecord]) -> list[dict[str, Any]]:
    all_logs: list[dict[str, Any]] = []
    for patient in patients:
        all_logs.extend(patient.event_log)
    return all_logs


def extract_patient_summaries(patients: list[PatientRecord]) -> list[dict[str, Any]]:
    return [patient.build_patient_summary() for patient in patients]


def enrich_event_log(
    event_log: list[dict[str, Any]],
    patient_summaries: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    summary_by_patient = {
        item["patient_id"]: item
        for item in patient_summaries
    }

    enriched: list[dict[str, Any]] = []
    for item in event_log:
        patient_summary = summary_by_patient.get(item["patient_id"], {})
        merged = dict(item)
        merged.update(
            {
                "enter_facility_clock": patient_summary.get("enter_facility_clock"),
                "waiting_time": patient_summary.get("waiting_time"),
                "service_time": patient_summary.get("service_time"),
                "departure_clock": patient_summary.get("departure_clock"),
                "time_in_system": patient_summary.get("time_in_system"),
            }
        )
        enriched.append(merged)
    return enriched


def mean_or_zero(values: list[float]) -> float:
    if not values:
        return 0.0
    return round(sum(values) / len(values), 2)


def percentile(values: list[float], value: float) -> float:
    if not values:
        return 0.0

    ordered = sorted(values)
    if len(ordered) == 1:
        return round(ordered[0], 2)

    rank = (value / 100) * (len(ordered) - 1)
    lower_index = int(rank)
    upper_index = min(lower_index + 1, len(ordered) - 1)
    weight = rank - lower_index
    blended = ordered[lower_index] + (ordered[upper_index] - ordered[lower_index]) * weight
    return round(blended, 2)
