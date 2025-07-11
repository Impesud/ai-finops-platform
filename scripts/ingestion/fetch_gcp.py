from datetime import date

from app.services.ingestion.gcp_ingest import GcpIngest
from app.services.ingestion.loader import save
from app.services.ingestion.normalizer import normalize


def main():
    start = date(2025, 1, 1)
    end = date(2025, 6, 30)

    project_id = "impesud-1336"
    dataset = "google_costs"
    table = "gcp_billing_export_resource_v1_011AA8_61998B_989F55"

    ingester = GcpIngest(
        project_id=project_id,
        dataset=dataset,
        table=table,
    )

    raw_gcp = ingester.fetch(start, end)
    print(f"Fetched {len(raw_gcp)} raw GCP records")

    unified = normalize([], [], raw_gcp)
    print(f"Unified into {len(unified)} records")

    save(unified, filename="gcp_2025.csv")
    print("Saved to data/gcp_2025.csv")


if __name__ == "__main__":
    main()
