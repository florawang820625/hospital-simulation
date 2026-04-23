from __future__ import annotations

import simpy

from .models import SimulationParameters


class Hospital:
    def __init__(self, env: simpy.Environment, parameters: SimulationParameters):
        self.env = env
        self.parameters = parameters

        self.doctors = simpy.PriorityResource(env, capacity=parameters.num_doctors)
        self.nurses = simpy.Resource(env, capacity=parameters.num_nurses)
        self.ct_scanner = simpy.Resource(env, capacity=parameters.num_ct)
        self.xray = simpy.Resource(env, capacity=parameters.num_xray)
        self.lab = simpy.Resource(env, capacity=parameters.num_lab)

        self.busy_time: dict[str, float] = {
            "doctors": 0.0,
            "nurses": 0.0,
            "ct": 0.0,
            "xray": 0.0,
            "lab": 0.0,
        }

    def record_busy_time(self, resource_name: str, minutes: float) -> None:
        self.busy_time[resource_name] = round(self.busy_time.get(resource_name, 0.0) + minutes, 4)
