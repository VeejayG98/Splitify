import pytest
import httpx
from unittest.mock import AsyncMock, patch, MagicMock
from backend.services.client import SplitwiseClient
from backend.exceptions import SplitwiseClientError

@pytest.mark.asyncio
async def test_get_access_token_success():
    client = SplitwiseClient(client_id="id", api_key="secret")

    mock_response = MagicMock(spec=httpx.Response)
    mock_response.json.return_value = {"access_token": "token123"}
    mock_response.raise_for_status = MagicMock()

    with patch("httpx.AsyncClient.post", AsyncMock(return_value=mock_response)) as mock_post:
        result = await client.get_access_token(code="code123", state="SPLITIFY_APP", redirect_uri="http://callback")

        assert result == {"access_token": "token123"}
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        assert kwargs["data"]["code"] == "code123"
        assert kwargs["data"]["client_secret"] == "secret"
        assert "state" not in kwargs["data"]

@pytest.mark.asyncio
async def test_get_access_token_invalid_state():
    client = SplitwiseClient(client_id="id", api_key="secret")

    with pytest.raises(SplitwiseClientError, match="State doesn't match"):
        await client.get_access_token(code="code123", state="WRONG_STATE", redirect_uri="http://callback")
