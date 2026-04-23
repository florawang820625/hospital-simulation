# ED Simulation Frontend

React + Vite frontend for the emergency department simulation system.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Environment

Create a `.env.local` file if you want the frontend to call a deployed API:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If `VITE_API_BASE_URL` is not set, the app falls back to the sample results bundled in `public/data`.
