#!/usr/bin/env python3
# scripts/ingestion/fetch_aws.py

from datetime import date
from pathlib import Path

from app.services.ingestion.aws_ingest import AwsIngest
from app.services.ingestion.normalizer import normalize
from app.services.ingestion.loader import save, DATA_DIR

def main():
    start = date(2025, 1, 1)
    end   = date(2025, 6, 30)

    # Determine the actual CSV path in app/data and delete it if present
    output_file = DATA_DIR / 'aws_2025.csv'
    if output_file.exists():
        print(f"Overwriting existing file: {output_file}")
        output_file.unlink()

    ingester = AwsIngest(profile_name=None, region_name=None)
    raw_aws = ingester.fetch(start, end)
    print(f"Fetched {len(raw_aws)} raw AWS records")

    unified = normalize(raw_aws, [], [])
    print(f"Unified into {len(unified)} records")

    save(unified, filename="aws_2025.csv")
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    main()


