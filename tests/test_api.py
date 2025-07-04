# tests/test_api.py

from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime

client = TestClient(app)


def test_get_all_costs():
    response = client.get("/api/v1/costs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # each record must include the provider field
    assert all("provider" in item for item in data)


def test_get_costs_by_service():
    response = client.get("/api/v1/costs?service=Amazon+Elastic+Compute+Cloud+-+Compute")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert all(item["service"] == "Amazon Elastic Compute Cloud - Compute" for item in data)


def test_get_costs_date_range():
    start_date = "2025-01-01"
    end_date = "2025-01-31"
    response = client.get(f"/api/v1/costs?start_date={start_date}&end_date={end_date}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    for item in data:
        d = datetime.fromisoformat(item["date"]).date()
        assert datetime.fromisoformat(start_date).date() <= d <= datetime.fromisoformat(end_date).date()




