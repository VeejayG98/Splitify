from abc import ABC, abstractmethod
import os
from typing import Optional

class Client(ABC):
    """
    Abstract base class for API clients.
    Enforces implementation of credential retrieval methods.
    """

    @abstractmethod
    def get_client_id(self) -> str:
        """Retrieves the Client ID."""
        pass

    @abstractmethod
    def get_access_token(self) -> str:
        """Retrieves the Access Token."""
        pass


class SplitwiseClient(Client):
    """
    Concrete implementation of Client for Splitwise.
    """
    def __init__(self, client_id: Optional[str] = None, api_key: Optional[str] = None):
        # Allow injection for testing, otherwise fallback to env vars
        self._client_id = client_id or os.environ.get("SPLITWISE_CLIENT_ID")
        self._api_key = api_key or os.environ.get("SPLITWISE_API_KEY")

    def get_client_id(self) -> str:
        if not self._client_id:
            raise ValueError("SPLITWISE_CLIENT_ID is not set in environment variables.")
        return self._client_id

    def get_access_token(self) -> str:
        if not self._api_key:
            raise ValueError("SPLITWISE_API_KEY is not set in environment variables.")
        return self._api_key
