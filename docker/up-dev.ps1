$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

try {
    $env:DOCKER_BUILDKIT = "0"

    docker build -t ed-simulation-backend -f docker/backend.Dockerfile .
    docker build -t ed-simulation-frontend-dev -f docker/frontend.dev.Dockerfile .
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --no-build
}
finally {
    Pop-Location
}
