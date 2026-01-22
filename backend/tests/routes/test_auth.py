import pytest
from unittest.mock import MagicMock, AsyncMock
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.client import Client, SplitwiseClient
from backend.routes.auth import get_splitwise_client, get_redirect_uri

@pytest.fixture
def client():
    # Dependency Override
    mock_service = MagicMock(spec=SplitwiseClient)
    mock_service.get_client_id.return_value = "test_id"
    mock_service.get_access_token = AsyncMock(return_value={"access_token": "test_token"})

    def override_get_splitwise_client():
        return mock_service

    def override_get_redirect_uri():
        return "http://localhost/callback"

    app.dependency_overrides[get_splitwise_client] = override_get_splitwise_client
    app.dependency_overrides[get_redirect_uri] = override_get_redirect_uri

    with TestClient(app) as c:
        yield c

    # Cleanup
    app.dependency_overrides.clear()

def test_get_client_id(client):
    response = client.get("/get_client_id")
    assert response.status_code == 200
    assert response.json() == {"client_id": "test_id"}

def test_get_access_token(client):
    response = client.get("/get_access_token?code=123&state=SPLITIFY_APP")
    assert response.status_code == 200
    assert response.json() == {"access_token": "test_token"}
