import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.client import Client, SplitwiseClient
from backend.routes.auth import get_splitwise_client

# Mock Client Implementation
class MockSplitwiseClient(Client):
    def __init__(self, client_id="test_id", api_key="test_token"):
        self.client_id = client_id
        self.api_key = api_key

    def get_client_id(self) -> str:
        return self.client_id

    def get_access_token(self) -> str:
        return self.api_key

@pytest.fixture
def client():
    # Dependency Override
    def override_get_splitwise_client():
        return MockSplitwiseClient()

    app.dependency_overrides[get_splitwise_client] = override_get_splitwise_client

    with TestClient(app) as c:
        yield c

    # Cleanup
    app.dependency_overrides.clear()

def test_get_client_id(client):
    response = client.get("/get_client_id")
    assert response.status_code == 200
    assert response.json() == {"client_id": "test_id"}

def test_get_access_token(client):
    response = client.get("/getAccessToken")
    assert response.status_code == 200
    assert response.json() == {"access_token": "test_token"}
