import csv
from pathlib import Path
from typing import Dict, List

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


def save(records: List[Dict], filename: str = "ingested_costs.csv") -> None:
    """
    Persist unified records to CSV in the data directory.
    """
    path = DATA_DIR / filename
    if not records:
        return
    # write header if file not exists
    write_header = not path.exists()
    with open(path, mode="a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(records[0].keys()))
        if write_header:
            writer.writeheader()
        writer.writerows(records)
