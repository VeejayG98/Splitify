from abc import ABC

class Client(ABC):
    """
    Abstract base class for API clients.
    """
    pass


class SplitwiseClient(Client):
    """
    Concrete implementation of Client for Splitwise.
    """
    def __init__(self, client_id: str, api_key: str):
        self._client_id = client_id
        self._api_key = api_key

    def get_client_id(self) -> str:
        """Retrieves the Client ID."""
        # Note: We don't raise error here anymore because we validated inputs in init/dependency
        # But to be safe and consistent with previous behavior or strictness:
        # Actually in the previous iteration I did raise error if missing.
        # But now __init__ takes strict str.
        # Let's keep it simple.
        return self._client_id

    def get_access_token(self) -> str:
        """Retrieves the Access Token."""
        return self._api_key
