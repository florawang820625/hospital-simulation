# Deployment

## Frontend on Cloudflare Pages

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_BASE_URL=https://<your-fastapi-host>`

## Backend on Cloud Run

- Build from the repository root with `docker/backend.Dockerfile` or `infra/cloudrun/Dockerfile`
- Container entrypoint: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Recommended runtime env:
  - `PORT=8080`
  - `SIMULATION_ARTIFACT_ROOT=/tmp/artifacts`
  - `CORS_ORIGINS=https://<your-pages-domain>`

## Backend on Render

- Deploy the backend image from `docker/backend.Dockerfile`, or keep using the Python runtime in `simulation-service/`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Recommended runtime env:
  - `SIMULATION_ARTIFACT_ROOT=/tmp/artifacts`
  - `CORS_ORIGINS=https://<your-frontend-domain>`

## Backend on Railway

- Use the same backend image from `docker/backend.Dockerfile`
- Set:
  - `PORT` from Railway's injected port
  - `SIMULATION_ARTIFACT_ROOT=/tmp/artifacts`
  - `CORS_ORIGINS=https://<your-frontend-domain>`

## Local Development

1. Use `docker compose up --build` for a production-like local stack
2. Use `docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build` for Vite hot reload
3. See `docs/docker.md` for smoke tests and artifact locations
