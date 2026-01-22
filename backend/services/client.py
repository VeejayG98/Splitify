from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import httpx
from backend.dtos.user import User
from backend.dtos.group import Group
from backend.dtos.expense import Expense, CreateExpense
from backend.dtos.comment import Comment, CreateComment, CreateItemizedComment, CommentItem, CommentParticipant
from backend.exceptions import InvalidCommentDataError, SplitwiseClientError

class Client(ABC):
    """
    Abstract base class for API clients.
    """
    @abstractmethod
    def get_client_id(self) -> str:
        """Retrieves the Client ID."""
        pass

    @abstractmethod
    async def get_access_token(self, code: str, state: str, redirect_uri: str) -> Dict[str, Any]:
        """Exchanges the authorization code for an access token."""
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

    async def get_access_token(self, code: str, state: str, redirect_uri: str) -> Dict[str, Any]:
        """
        Exchanges the authorization code for an access token.
        """
        if state != "SPLITIFY_APP":
             raise SplitwiseClientError("State doesn't match")

        url = "https://secure.splitwise.com/oauth/token"
        params = {
            "client_id": self._client_id,
            "client_secret": self._api_key,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=params, headers=headers)
            response.raise_for_status()
            return response.json()

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

    def _prepare_payload(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Flattens nested dictionaries/lists for Splitwise API form-urlencoded format.
        e.g. users=[{'user_id': 1}] -> users__0__user_id=1
        """
        flat_data = {}
        for key, value in data.items():
            if isinstance(value, list):
                for i, item in enumerate(value):
                    if isinstance(item, dict):
                        for sub_key, sub_value in item.items():
                             flat_data[f"{key}__{i}__{sub_key}"] = sub_value
                    else:
                        # Fallback for simple lists if any
                         flat_data[f"{key}__{i}"] = value
            elif isinstance(value, dict):
                 # Not expected for current DTOs but good to have
                 for sub_key, sub_value in value.items():
                      flat_data[f"{key}__{sub_key}"] = sub_value
            else:
                flat_data[key] = value
        return flat_data

    def _generate_csv_comment(self, items: List[CommentItem], participants: List[CommentParticipant]) -> str:
        """
        Generates a CSV formatted string summarizing the bill breakdown.
        Mirrors the legacy behavior for simpler visualization on Splitwise.
        """
        # Header: Item, Participant Names..., Item Cost
        header = ["Item"]
        for p in participants:
            name = f"{p.first_name} {p.last_name}" if p.last_name else p.first_name
            header.append(name)
        header.append("Item Cost")

        rows = [",".join(header)]

        for item in items:
            row = [item.name]
            for p in participants:
                # Get split amount for this participant, default to 0
                amount = item.splits.get(p.id, 0)
                row.append(str(amount))
            row.append(str(item.cost))
            rows.append(",".join(row))

        return "\n".join(rows)

    async def create_expense(self, token: str, expense_data: CreateExpense) -> List[Expense]:
        """
        Creates a new expense.
        """
        url = f"{self.BASE_URL}/create_expense"
        headers = {"Authorization": f"Bearer {token}"}

        # Splitwise expects form-encoded data with flattened parameters
        raw_data = expense_data.model_dump(exclude_none=True, mode='json')
        payload = self._prepare_payload(raw_data)

        async with httpx.AsyncClient() as client:
            # Using data=payload sends application/x-www-form-urlencoded
            response = await client.post(url, headers=headers, data=payload)
            response.raise_for_status()
            data = response.json()
            return [Expense.model_validate(exp) for exp in data["expenses"]]

    async def create_comment(self, token: str, comment_data: CreateComment) -> Comment:
        """
        Adds a comment to an expense using simple content.
        """
        url = f"{self.BASE_URL}/create_comment"
        headers = {"Authorization": f"Bearer {token}"}

        # Simple payload with flattened content
        payload = comment_data.model_dump(exclude_none=True, mode='json')

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, data=payload)
            response.raise_for_status()
            data = response.json()
            return Comment.model_validate(data["comment"])

    async def create_itemized_comment(self, token: str, comment_data: CreateItemizedComment) -> Comment:
        """
        Adds a comment to an expense by generating a CSV breakdown from itemized data.
        Transforms CreateItemizedComment -> CreateComment and delegates.
        """
        # Although DTO validation should catch this, adding explicit check as requested
        if not comment_data.items or not comment_data.participants:
            raise InvalidCommentDataError("Items and participants must not be empty.")

        content = self._generate_csv_comment(comment_data.items, comment_data.participants)

        simple_comment = CreateComment(
            expense_id=comment_data.expense_id,
            content=content
        )

        return await self.create_comment(token, simple_comment)
