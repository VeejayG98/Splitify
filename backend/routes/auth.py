import os
from fastapi import APIRouter, Depends, HTTPException
from backend.services.client import SplitwiseClient
from backend.exceptions import SplitwiseClientError

router = APIRouter()

def get_splitwise_client() -> SplitwiseClient:
    """
    Dependency to provide the SplitwiseClient.
    Fetches credentials from environment variables.
    """
    client_id = os.environ.get("SPLITWISE_CLIENT_ID")
    api_key = os.environ.get("SPLITWISE_API_KEY")

    if not client_id or not api_key:
         raise HTTPException(status_code=500, detail="Server configuration error: Missing Splitwise credentials.")

    return SplitwiseClient(client_id=client_id, api_key=api_key)

@router.get("/get_client_id")
def get_client_id(client: SplitwiseClient = Depends(get_splitwise_client)):
    """
    Returns the configured Client ID.
    """
    try:
        return {"client_id": client.get_client_id()}
    except SplitwiseClientError as e:
         raise HTTPException(status_code=500, detail=str(e))

@router.get("/getAccessToken")
def get_access_token(client: SplitwiseClient = Depends(get_splitwise_client)):
    """
    Returns the Access Token.
    """
    try:
        return {"access_token": client.get_access_token()}
    except SplitwiseClientError as e:
         raise HTTPException(status_code=500, detail=str(e))
