# Architecture

## Overview

- `frontend/` contains the React + Vite SPA that can run in two modes:
  - live mode, calling the FastAPI backend through `VITE_API_BASE_URL`
  - sample mode, reading scenario JSON files from `frontend/public/data`
- `simulation-service/` contains the FastAPI application plus the reusable SimPy simulation core.
- `data/samples/` stores generated sample scenarios exported by the CLI.
- `shared/contracts/` stores the API contract snapshot shared between frontend and backend.
- `infra/` stores deployment assets for Cloud Run, Render, and Cloudflare Pages.

## Runtime Flow

1. The React frontend loads scenario metadata from `/api/v1/scenarios` or falls back to `public/data/scenarios.json`.
2. The user edits resource parameters and submits them from the simulation form.
3. The FastAPI endpoint validates the request and converts it into `SimulationParameters`.
4. `simulation_core.run_simulation()` executes the SimPy model without touching HTTP or project-root files.
5. The API stores downloadable artifacts under `simulation-service/.runtime/artifacts/<simulation_id>/`.
6. The frontend renders the summary immediately and can link to the stored CSV or JSON artifacts.

## Core Design Decisions

- The simulation core no longer mutates `config.py`.
- The simulation core no longer depends on pandas for export or merge logic.
- File export is separated from the simulation engine through `export_result()` and `LocalArtifactStore`.
- Legacy root files (`main.py`, `simulation.py`, and friends) are now compatibility wrappers that forward to the new service package.
