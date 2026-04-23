from __future__ import annotations

import csv
import io
import random
from typing import Any

import simpy

from .defaults import (
    DEFAULT_MEAN_INTERARRIVAL_MINUTES,
    EVENT_DISCHARGE,
    EVENT_END_CT,
    EVENT_END_DOCTOR,
    EVENT_END_LAB,
    EVENT_END_NURSE,
    EVENT_END_RETURN,
    EVENT_END_XRAY,
    EVENT_QUEUE_DOCTOR,
    EVENT_QUEUE_EXAM,
    EVENT_QUEUE_NURSE,
    EVENT_QUEUE_RETURN,
    EVENT_START_CT,
    EVENT_START_DOCTOR,
    EVENT_START_LAB,
    EVENT_START_NURSE,
    EVENT_START_RETURN,
    EVENT_START_XRAY,
)
from .hospital_env import Hospital
from .models import (
    PatientRecord,
    SimulationParameters,
    SimulationResult,
    SimulationSummary,
    enrich_event_log,
    extract_all_logs,
    extract_patient_summaries,
    mean_or_zero,
    percentile,
)
from .scheduler import calculate_priority


def patient_flow(
    env: simpy.Environment,
    patient: PatientRecord,
    hospital: Hospital,
    parameters: SimulationParameters,
    rng: random.Random,
) -> Any:
    patient.record_event(env.now, EVENT_QUEUE_NURSE)

    with hospital.nurses.request() as req:
        yield req
        patient.record_event(env.now, EVENT_START_NURSE, "Nurse")
        duration = rng.uniform(2, 6)
        yield env.timeout(duration)
        hospital.record_busy_time("nurses", duration)
        patient.record_event(env.now, EVENT_END_NURSE, "Nurse")

    patient.record_event(env.now, EVENT_QUEUE_DOCTOR)
    doctor_priority = calculate_priority(patient, env.now, parameters)

    with hospital.doctors.request(priority=doctor_priority) as req:
        yield req
        patient.record_event(env.now, EVENT_START_DOCTOR, "Doctor")
        duration = rng.uniform(5, 15)
        yield env.timeout(duration)
        hospital.record_busy_time("doctors", duration)
        patient.record_event(env.now, EVENT_END_DOCTOR, "Doctor")

    if rng.random() < parameters.exam_probability:
        patient.record_event(env.now, EVENT_QUEUE_EXAM)
        exam_choices: list[tuple[str, float]] = []

        if parameters.num_ct > 0:
            exam_choices.append(("ct", 0.4))
        if parameters.num_xray > 0:
            exam_choices.append(("xray", 0.35))
        if parameters.num_lab > 0:
            exam_choices.append(("lab", 0.25))

        if exam_choices:
            exam_type = rng.choices(
                [name for name, _weight in exam_choices],
                weights=[weight for _name, weight in exam_choices],
                k=1,
            )[0]

            if exam_type == "ct":
                with hospital.ct_scanner.request() as req:
                    yield req
                    patient.record_event(env.now, EVENT_START_CT, "CT_Scanner")
                    duration = rng.uniform(15, 30)
                    yield env.timeout(duration)
                    hospital.record_busy_time("ct", duration)
                    patient.record_event(env.now, EVENT_END_CT, "CT_Scanner")
            elif exam_type == "xray":
                with hospital.xray.request() as req:
                    yield req
                    patient.record_event(env.now, EVENT_START_XRAY, "Xray")
                    duration = rng.uniform(8, 20)
                    yield env.timeout(duration)
                    hospital.record_busy_time("xray", duration)
                    patient.record_event(env.now, EVENT_END_XRAY, "Xray")
            else:
                with hospital.lab.request() as req:
                    yield req
                    patient.record_event(env.now, EVENT_START_LAB, "Lab")
                    duration = rng.uniform(10, 25)
                    yield env.timeout(duration)
                    hospital.record_busy_time("lab", duration)
                    patient.record_event(env.now, EVENT_END_LAB, "Lab")

        patient.triage_level = "Return"
        patient.record_event(env.now, EVENT_QUEUE_RETURN)
        return_priority = calculate_priority(patient, env.now, parameters)

        with hospital.doctors.request(priority=return_priority) as req:
            yield req
            patient.record_event(env.now, EVENT_START_RETURN, "Doctor")
            duration = rng.uniform(3, 10)
            yield env.timeout(duration)
            hospital.record_busy_time("doctors", duration)
            patient.record_event(env.now, EVENT_END_RETURN, "Doctor")

    patient.record_event(env.now, EVENT_DISCHARGE)


def patient_arrival(
    env: simpy.Environment,
    hospital: Hospital,
    parameters: SimulationParameters,
    patient_list: list[PatientRecord],
    rng: random.Random,
) -> Any:
    patient_id = 1
    while True:
        yield env.timeout(rng.expovariate(1.0 / DEFAULT_MEAN_INTERARRIVAL_MINUTES))
        triage_level = rng.choices(["Level III", "Level IV"], weights=[0.7, 0.3], k=1)[0]

        patient = PatientRecord(
            patient_id=f"P{patient_id:04d}",
            triage_level=triage_level,
            arrival_time=env.now,
        )
        patient_list.append(patient)

        env.process(patient_flow(env, patient, hospital, parameters, rng))
        patient_id += 1


def build_summary(
    parameters: SimulationParameters,
    hospital: Hospital,
    event_log: list[dict[str, Any]],
    patient_summary: list[dict[str, Any]],
) -> SimulationSummary:
    waiting_times = [float(item["waiting_time"]) for item in patient_summary]
    time_in_system_values = [float(item["time_in_system"]) for item in patient_summary]
    service_times = [float(item["service_time"]) for item in patient_summary]

    utilization_capacity = {
        "doctors": max(parameters.num_doctors, 1),
        "nurses": max(parameters.num_nurses, 1),
        "ct": max(parameters.num_ct, 1),
        "xray": max(parameters.num_xray, 1),
        "lab": max(parameters.num_lab, 1),
    }

    resource_utilization = {}
    for resource_name, busy_minutes in hospital.busy_time.items():
        denominator = utilization_capacity[resource_name] * parameters.simulation_time
        utilization = 0.0 if denominator <= 0 else round(busy_minutes / denominator, 4)
        resource_utilization[resource_name] = utilization

    return SimulationSummary(
        total_patients=len(patient_summary),
        total_events=len(event_log),
        average_waiting_time=mean_or_zero(waiting_times),
        p95_waiting_time=percentile(waiting_times, 95),
        average_time_in_system=mean_or_zero(time_in_system_values),
        average_service_time=mean_or_zero(service_times),
        resource_utilization=resource_utilization,
    )


def run_simulation(parameters: SimulationParameters | None = None) -> SimulationResult:
    params = parameters or SimulationParameters()
    rng = random.Random(params.random_seed)

    env = simpy.Environment()
    hospital = Hospital(env, params)
    all_patients: list[PatientRecord] = []

    env.process(patient_arrival(env, hospital, params, all_patients, rng))
    env.run(until=params.simulation_time)

    raw_logs = extract_all_logs(all_patients)
    patient_summary = extract_patient_summaries(all_patients)
    enriched_event_log = enrich_event_log(raw_logs, patient_summary)
    summary = build_summary(params, hospital, enriched_event_log, patient_summary)

    return SimulationResult(
        parameters=params,
        summary=summary,
        event_log=enriched_event_log,
        patient_summary=patient_summary,
    )


def _records_to_csv_bytes(records: list[dict[str, Any]]) -> bytes:
    if not records:
        return b""

    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=list(records[0].keys()))
    writer.writeheader()
    writer.writerows(records)
    return buffer.getvalue().encode("utf-8-sig")


def export_result(result: SimulationResult, artifact_name: str) -> bytes | dict[str, Any]:
    if artifact_name == "result.json":
        return result.to_dict()
    if artifact_name == "event_log.json":
        return {"event_log": result.event_log}
    if artifact_name == "patient_summary.json":
        return {"patient_summary": result.patient_summary}
    if artifact_name == "event_log.csv":
        return _records_to_csv_bytes(result.event_log)
    if artifact_name == "patient_summary.csv":
        return _records_to_csv_bytes(result.patient_summary)
    raise ValueError(f"Unsupported artifact type: {artifact_name}")
