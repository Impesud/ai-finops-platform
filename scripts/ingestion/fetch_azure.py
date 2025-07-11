from datetime import date

from app.services.ingestion.azure_ingest import AzureIngest
from app.services.ingestion.loader import save
from app.services.ingestion.normalizer import normalize


def main():
    start = date(2025, 1, 1)
    end = date(2025, 6, 30)

    subscription_id = "081f38d7-7b6f-4bf5-9f7b-46b99d534b8a"

    ingester = AzureIngest(subscription_id=subscription_id)

    raw_azure = ingester.fetch(start, end)
    print(f"Fetched {len(raw_azure)} raw Azure records")

    unified = normalize(raw_azure, [], [])
    print(f"Unified into {len(unified)} records")

    save(unified, filename="azure_2025.csv")
    print("Saved to data/azure_2025.csv")


if __name__ == "__main__":
    main()
