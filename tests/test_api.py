from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime

client = TestClient(app)

def test_get_all_costs():
    response = client.get("/api/costs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_get_costs_by_service():
    response = client.get("/costs?service=AmazonEC2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert all(item["service"] == "AmazonEC2" for item in data)

def test_get_costs_by_account():
    response = client.get("/costs?account_id=855392091379")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert all(item["account_id"] == "855392091379" for item in data)

def test_get_costs_date_range():
    start_date = "2024-01-01"
    end_date = "2024-01-31"
    response = client.get(f"/costs?start_date={start_date}&end_date={end_date}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    for item in data:
        d = datetime.fromisoformat(item["date"]).date()
        assert datetime.fromisoformat(start_date).date() <= d <= datetime.fromisoformat(end_date).date()

def test_get_costs_combined_filters():
    response = client.get("/costs?service=AmazonS3&account_id=855392091379&start_date=2024-01-01&end_date=2024-12-31")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for item in data:
        assert item["service"] == "AmazonS3"
        assert item["account_id"] == "855392091379"


