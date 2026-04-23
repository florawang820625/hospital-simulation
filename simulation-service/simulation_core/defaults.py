from __future__ import annotations

DEFAULT_NUM_DOCTORS = 1
DEFAULT_NUM_NURSES = 2
DEFAULT_NUM_CT = 1
DEFAULT_NUM_XRAY = 1
DEFAULT_NUM_LAB = 1

DEFAULT_EXAM_PROBABILITY = 0.60

DEFAULT_TARGET_TIME_LEVEL3 = 60.0
DEFAULT_TARGET_TIME_LEVEL4 = 120.0
DEFAULT_K_LEVEL3 = 13.1
DEFAULT_K_LEVEL4 = 2.1

DEFAULT_SIMULATION_TIME = 60 * 24 * 7
DEFAULT_RANDOM_SEED = 7
DEFAULT_MEAN_INTERARRIVAL_MINUTES = 10.0

EVENT_ARRIVAL = "抵達急診"
EVENT_QUEUE_NURSE = "進入護理評估佇列"
EVENT_START_NURSE = "開始護理評估"
EVENT_END_NURSE = "結束護理評估"
EVENT_QUEUE_DOCTOR = "進入醫師診察佇列"
EVENT_START_DOCTOR = "開始醫師診察"
EVENT_END_DOCTOR = "結束醫師診察"
EVENT_QUEUE_EXAM = "進入檢查佇列"
EVENT_START_CT = "開始 CT 檢查"
EVENT_END_CT = "結束 CT 檢查"
EVENT_START_XRAY = "開始 Xray 檢查"
EVENT_END_XRAY = "結束 Xray 檢查"
EVENT_START_LAB = "開始 Lab 檢驗"
EVENT_END_LAB = "結束 Lab 檢驗"
EVENT_QUEUE_RETURN = "進入回診佇列"
EVENT_START_RETURN = "開始回診診察"
EVENT_END_RETURN = "結束回診診察"
EVENT_DISCHARGE = "離開急診"

DEFAULT_SCENARIOS = [
    {
        "slug": "baseline",
        "title": "Baseline",
        "description": "預設的人力與檢查資源配置，適合展示系統基準情境。",
        "sample_result_slug": "baseline",
        "parameters": {
            "num_doctors": DEFAULT_NUM_DOCTORS,
            "num_nurses": DEFAULT_NUM_NURSES,
            "num_ct": DEFAULT_NUM_CT,
            "num_xray": DEFAULT_NUM_XRAY,
            "num_lab": DEFAULT_NUM_LAB,
            "simulation_time": 60 * 12,
            "exam_probability": DEFAULT_EXAM_PROBABILITY,
            "random_seed": DEFAULT_RANDOM_SEED,
        },
    },
    {
        "slug": "surge",
        "title": "Surge Load",
        "description": "提高檢查需求與模擬時長，用來觀察壅塞與等待時間。",
        "sample_result_slug": "surge",
        "parameters": {
            "num_doctors": 1,
            "num_nurses": 2,
            "num_ct": 1,
            "num_xray": 1,
            "num_lab": 1,
            "simulation_time": 60 * 24,
            "exam_probability": 0.72,
            "random_seed": 11,
        },
    },
    {
        "slug": "expanded-staffing",
        "title": "Expanded Staffing",
        "description": "增加醫護與檢查資源，用來比較改善後的等待時間。",
        "sample_result_slug": "expanded-staffing",
        "parameters": {
            "num_doctors": 2,
            "num_nurses": 3,
            "num_ct": 1,
            "num_xray": 2,
            "num_lab": 2,
            "simulation_time": 60 * 12,
            "exam_probability": DEFAULT_EXAM_PROBABILITY,
            "random_seed": 13,
        },
    },
]
