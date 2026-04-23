# Cloud Run

Build from the repository root:

```bash
docker build -f infra/cloudrun/Dockerfile -t ed-simulation-service .
```

Deploy the resulting image to Cloud Run and expose port `8080`.
