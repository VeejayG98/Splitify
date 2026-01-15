import os
from fastapi import HTTPException
from backend.services.client import SplitwiseClient

def get_splitwise_client() -> SplitwiseClient:
    """
    Dependency to provide the SplitwiseClient.
    Fetches credentials from environment variables.
    Falls back to SPLITWISE_CLIENT_SECRET if SPLITWISE_API_KEY is not set.
    """
    client_id = os.environ.get("SPLITWISE_CLIENT_ID")
    api_key = os.environ.get("SPLITWISE_API_KEY") or os.environ.get("SPLITWISE_CLIENT_SECRET")

    if not client_id or not api_key:
         raise HTTPException(status_code=500, detail="Server configuration error: Missing Splitwise credentials.")

    return SplitwiseClient(client_id=client_id, api_key=api_key)
