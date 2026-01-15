import os
from fastapi import APIRouter, Depends, HTTPException
from backend.services.client import SplitwiseClient, Client
from backend.exceptions import SplitwiseClientError

router = APIRouter()

def get_splitwise_client() -> Client:
    """
    Dependency to provide the SplitwiseClient.
    Fetches credentials from environment variables.
    """
    client_id = os.environ.get("SPLITWISE_CLIENT_ID")
    api_key = os.environ.get("SPLITWISE_API_KEY")

    # We could raise here if env vars are missing, or let the client handle it if passed None
    # But since I made them str in type hint, let's assume we want them non-empty.
    # Passing them even if None to let the Client decide if it's an error is one way,
    # but the previous code raised error if missing.

    if not client_id or not api_key:
         raise HTTPException(status_code=500, detail="Server configuration error: Missing Splitwise credentials.")

    return SplitwiseClient(client_id=client_id, api_key=api_key)

@router.get("/get_client_id")
def get_client_id(client: Client = Depends(get_splitwise_client)):
    """
    Returns the configured Client ID.
    """
    try:
        return {"client_id": client.get_client_id()}
    except SplitwiseClientError as e:
         raise HTTPException(status_code=500, detail=str(e))

@router.get("/getAccessToken")
def get_access_token(client: Client = Depends(get_splitwise_client)):
    """
    Returns the Access Token.
    """
    try:
        return {"access_token": client.get_access_token()}
    except SplitwiseClientError as e:
         raise HTTPException(status_code=500, detail=str(e))
