from abc import ABC, abstractmethod
from typing import Optional
from backend.exceptions import SplitwiseClientError

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
    def __init__(self, client_id: str, api_key: str):
        self._client_id = client_id
        self._api_key = api_key

    def get_client_id(self) -> str:
        if not self._client_id:
            raise SplitwiseClientError("Client ID is not set.")
        return self._client_id

    def get_access_token(self) -> str:
        if not self._api_key:
            raise SplitwiseClientError("API Key is not set.")
        return self._api_key
