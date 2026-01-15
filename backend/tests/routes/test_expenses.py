import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from backend.main import app
from backend.dependencies import get_splitwise_client
from backend.services.client import SplitwiseClient
from backend.dtos.expense import Expense, CreateExpense
from backend.dtos.comment import Comment, CreateComment

# Mock data
MOCK_EXPENSE_DATA = {
    "cost": "10.00",
    "description": "Lunch",
    "currency_code": "USD",
    "split_equally": True
}

MOCK_COMMENT_DATA = {
    "expense_id": 123,
    "content": "Nice lunch!"
}

MOCK_EXPENSE_RESPONSE = {
    "id": 1,
    "cost": "10.00",
    "description": "Lunch",
    "currency_code": "USD",
    "date": "2023-10-27T10:00:00Z",
    "created_at": "2023-10-27T10:00:00Z",
    "users": [],
    "payment": False
}

MOCK_COMMENT_RESPONSE = {
    "id": 456,
    "content": "Nice lunch!",
    "created_at": "2023-10-27T10:05:00Z"
}

@pytest.fixture
def mock_splitwise_client():
    mock_client = MagicMock(spec=SplitwiseClient)
    mock_client.create_expense = AsyncMock()
    mock_client.create_comment = AsyncMock()
    return mock_client

@pytest.fixture
def client(mock_splitwise_client):
    app.dependency_overrides[get_splitwise_client] = lambda: mock_splitwise_client
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_add_expense_success(client, mock_splitwise_client):
    # Setup mock return value
    mock_expense = Expense(**MOCK_EXPENSE_RESPONSE)
    mock_splitwise_client.create_expense.return_value = [mock_expense]

    response = client.post(
        "/expenses/add",
        json=MOCK_EXPENSE_DATA,
        headers={"Authorization": "Bearer mock_token"}
    )

    assert response.status_code == 201
    data = response.json()
    assert len(data) == 1
    assert data[0]["description"] == "Lunch"
    mock_splitwise_client.create_expense.assert_called_once()

def test_add_expense_validation_error(client):
    # Missing required field 'cost'
    invalid_data = {
        "description": "Lunch",
        "currency_code": "USD"
    }

    response = client.post(
        "/expenses/add",
        json=invalid_data,
        headers={"Authorization": "Bearer mock_token"}
    )

    assert response.status_code == 422

def test_add_comment_success(client, mock_splitwise_client):
    # Setup mock return value
    mock_comment = Comment(**MOCK_COMMENT_RESPONSE)
    mock_splitwise_client.create_comment.return_value = mock_comment

    response = client.post(
        "/expenses/comments/add",
        json=MOCK_COMMENT_DATA,
        headers={"Authorization": "Bearer mock_token"}
    )

    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "Nice lunch!"
    mock_splitwise_client.create_comment.assert_called_once()

def test_add_comment_validation_error(client):
    # Empty content
    invalid_data = {
        "expense_id": 123,
        "content": ""  # Should fail validation
    }

    response = client.post(
        "/expenses/comments/add",
        json=invalid_data,
        headers={"Authorization": "Bearer mock_token"}
    )

    # Depending on how the validator is set up, it might be 422.
    # The validator raises ValueError("must not be whitespace"), which Pydantic catches and returns as 422.
    assert response.status_code == 422
