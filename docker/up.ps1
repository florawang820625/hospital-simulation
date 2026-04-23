$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

try {
    $env:DOCKER_BUILDKIT = "0"

    docker build -t ed-simulation-backend -f docker/backend.Dockerfile .
    docker build -t ed-simulation-frontend -f docker/frontend.Dockerfile .
    docker compose up -d --no-build
}
finally {
    Pop-Location
}
