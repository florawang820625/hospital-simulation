from __future__ import annotations

import sys
from pathlib import Path

SERVICE_ROOT = Path(__file__).resolve().parent / "simulation-service"
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from scripts.run_cli import main  # noqa: E402


if __name__ == "__main__":
    raise SystemExit(main())
