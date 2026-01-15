import pytest
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.client import SplitwiseClient
from backend.dependencies import get_splitwise_client
from backend.dtos.user import User
from backend.dtos.group import Group
from backend.dtos.common import Picture
import httpx

client = TestClient(app)

# Mock data
mock_picture = Picture(large="http://example.com/avatar.jpg", small="http://example.com/small.jpg", medium="http://example.com/medium.jpg")
mock_user = User(
    id=1,
    first_name="John",
    last_name="Doe",
    email="john@example.com",
    picture=mock_picture
)
mock_friend = User(
    id=2,
    first_name="Jane",
    last_name="Doe",
    picture=mock_picture
)

mock_group = Group(
    id=101,
    name="Trip",
    members=[mock_user, mock_friend]
)

@pytest.fixture
def mock_splitwise_client():
    mock_client = AsyncMock(spec=SplitwiseClient)
    # Override the dependency
    app.dependency_overrides[get_splitwise_client] = lambda: mock_client
    yield mock_client
    # Clean up
    app.dependency_overrides = {}

def test_get_user_avatar(mock_splitwise_client):
    mock_splitwise_client.get_current_user.return_value = mock_user

    response = client.get("/get_user_avatar?token=test_token")

    assert response.status_code == 200, response.text
    assert response.json() == {"avatar": "http://example.com/avatar.jpg"}
    mock_splitwise_client.get_current_user.assert_called_once_with("test_token")

def test_get_user_avatar_fallback(mock_splitwise_client):
    # User with only small picture
    user_small = User(
        id=1,
        first_name="Small",
        picture=Picture(small="http://example.com/small.jpg")
    )
    mock_splitwise_client.get_current_user.return_value = user_small

    response = client.get("/get_user_avatar?token=test_token")

    assert response.status_code == 200, response.text
    assert response.json() == {"avatar": "http://example.com/small.jpg"}


def test_get_participants(mock_splitwise_client):
    mock_splitwise_client.get_friends.return_value = [mock_friend]
    mock_splitwise_client.get_current_user.return_value = mock_user

    response = client.get("/get_participants?token=test_token")

    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data["friends"]) == 2
    assert data["friends"][0]["id"] == 2
    assert data["friends"][1]["id"] == 1

    mock_splitwise_client.get_friends.assert_called_once_with("test_token")
    mock_splitwise_client.get_current_user.assert_called_once_with("test_token")

def test_find_common_groups(mock_splitwise_client):
    mock_splitwise_client.get_groups.return_value = [mock_group]

    # User 1 and 2 are in the group. Asking for common groups for 1 and 2.
    # Note: query param list format: participants=1&participants=2
    response = client.get("/find_common_groups?token=test_token&participants=1&participants=2")

    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data["common_groups"]) == 1
    assert data["common_groups"][0]["id"] == 101

def test_find_common_groups_no_match(mock_splitwise_client):
    mock_splitwise_client.get_groups.return_value = [mock_group]

    # User 3 is not in the group.
    response = client.get("/find_common_groups?token=test_token&participants=1&participants=3")

    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data["common_groups"]) == 0

def test_find_common_groups_invalid_param(mock_splitwise_client):
    response = client.get("/find_common_groups?token=test_token&participants=invalid")
    assert response.status_code == 422 # FastAPI validation error for int list

def test_error_handling(mock_splitwise_client):
    # Simulate an HTTP error from the client
    mock_splitwise_client.get_current_user.side_effect = httpx.HTTPStatusError(
        "Unauthorized", request=None, response=httpx.Response(401)
    )

    response = client.get("/get_user_avatar?token=bad_token")
    assert response.status_code == 401
