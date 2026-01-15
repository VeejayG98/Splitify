from abc import ABC
from typing import List, Dict, Any, Optional
import httpx
from backend.dtos.user import User
from backend.dtos.group import Group
from backend.dtos.expense import Expense, ExpenseCreate
from backend.dtos.comment import Comment, CommentCreate

class Client(ABC):
    """
    Abstract base class for API clients.
    """
    pass


class SplitwiseClient(Client):
    """
    Concrete implementation of Client for Splitwise.
    """
    BASE_URL = "https://secure.splitwise.com/api/v3.0"

    def __init__(self, client_id: str, api_key: str):
        self._client_id = client_id
        self._api_key = api_key

    def get_client_id(self) -> str:
        """Retrieves the Client ID."""
        return self._client_id

    def get_access_token(self) -> str:
        """Retrieves the Access Token."""
        return self._api_key

    async def get_current_user(self, token: str) -> User:
        """
        Fetches the current user's information.
        """
        url = f"{self.BASE_URL}/get_current_user"
        headers = {"Authorization": f"Bearer {token}"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return User.model_validate(data["user"])

    async def get_friends(self, token: str) -> List[User]:
        """
        Fetches the current user's friends.
        """
        url = f"{self.BASE_URL}/get_friends"
        headers = {"Authorization": f"Bearer {token}"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return [User.model_validate(friend) for friend in data["friends"]]

    async def get_groups(self, token: str) -> List[Group]:
        """
        Fetches the groups the user is part of.
        """
        url = f"{self.BASE_URL}/get_groups"
        headers = {"Authorization": f"Bearer {token}"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return [Group.model_validate(group) for group in data["groups"]]

    async def create_expense(self, token: str, expense_data: ExpenseCreate) -> List[Expense]:
        """
        Creates a new expense.
        """
        url = f"{self.BASE_URL}/create_expense"
        headers = {"Authorization": f"Bearer {token}"}

        # Convert model to dict, exclude None to avoid sending nulls where not expected,
        # but check if API expects specific format.
        # The API docs say "split_equally" is required boolean.
        # Pydantic model dump with mode='json' handles decimals.
        payload = expense_data.model_dump(mode='json', exclude_none=True)

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            # API returns { "expenses": [ ... ] } even for creation?
            # The docs say:
            # { "expenses": [ ... ] }
            return [Expense.model_validate(exp) for exp in data["expenses"]]

    async def create_comment(self, token: str, comment_data: CommentCreate) -> Comment:
        """
        Creates a new comment on an expense.
        """
        url = f"{self.BASE_URL}/create_comment"
        headers = {"Authorization": f"Bearer {token}"}

        payload = comment_data.model_dump(mode='json')

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            # API returns { "comment": { ... } }
            return Comment.model_validate(data["comment"])
