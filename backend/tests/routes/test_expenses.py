import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from backend.main import app
from backend.dependencies import get_splitwise_client
from backend.dtos.expense import Expense, ExpenseCreate
from backend.dtos.comment import Comment, CommentCreate
from decimal import Decimal
from datetime import datetime
import httpx

client = TestClient(app)

@pytest.fixture
def mock_splitwise_client():
    mock = MagicMock()
    return mock

@pytest.fixture
def override_get_splitwise_client(mock_splitwise_client):
    app.dependency_overrides[get_splitwise_client] = lambda: mock_splitwise_client
    yield
    app.dependency_overrides.clear()

def test_add_expense_success(override_get_splitwise_client, mock_splitwise_client):
    mock_splitwise_client.create_expense = AsyncMock(return_value=[
        Expense(
            id=101,
            cost=Decimal("25.00"),
            description="Lunch",
            currency_code="USD",
            date=datetime.now(),
            created_at=datetime.now(),
            users=[],
            payment=False
        )
    ])

    payload = {
        "cost": "25.00",
        "description": "Lunch",
        "currency_code": "USD",
        "group_id": 0,
        "split_equally": True
    }

    headers = {"Authorization": "Bearer dummy_token"}
    response = client.post("/expenses", json=payload, headers=headers)

    assert response.status_code == 201
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == 101

    mock_splitwise_client.create_expense.assert_awaited_once()

def test_add_expense_validation_error(override_get_splitwise_client):
    payload = {
        "cost": "25.00",
        "currency_code": "USD"
    }
    headers = {"Authorization": "Bearer dummy_token"}

    response = client.post("/expenses", json=payload, headers=headers)

    assert response.status_code == 422

def test_add_comment_success(override_get_splitwise_client, mock_splitwise_client):
    mock_splitwise_client.create_comment = AsyncMock(return_value=Comment(
        id=505,
        content="This is a comment",
        created_at=datetime.now(),
        expense_id=101
    ))

    payload = {
        "expense_id": 101,
        "content": "This is a comment"
    }

    headers = {"Authorization": "Bearer dummy_token"}
    response = client.post("/expenses/101/comments", json=payload, headers=headers)

    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 505

    mock_splitwise_client.create_comment.assert_awaited_once()

def test_add_comment_id_mismatch(override_get_splitwise_client):
    payload = {
        "expense_id": 999,
        "content": "Mismatch"
    }
    headers = {"Authorization": "Bearer dummy_token"}

    response = client.post("/expenses/101/comments", json=payload, headers=headers)

    assert response.status_code == 400

def test_missing_auth_header(override_get_splitwise_client):
    payload = {
        "cost": "25.00",
        "description": "Lunch"
    }
    response = client.post("/expenses", json=payload)
    assert response.status_code == 422 # Missing header
