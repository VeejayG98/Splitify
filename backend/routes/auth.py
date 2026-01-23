import os
from fastapi import APIRouter, Depends, HTTPException
from backend.services.client import SplitwiseClient
from backend.exceptions import SplitwiseClientError
from backend.dependencies import get_splitwise_client, get_redirect_uri

router = APIRouter()

@router.get("/get_client_id")
def get_client_id(client: SplitwiseClient = Depends(get_splitwise_client)):
    """
    Returns the configured Client ID.
    """
    try:
        return {"client_id": client.get_client_id()}
    except SplitwiseClientError as e:
         raise HTTPException(status_code=500, detail=str(e))

@router.get("/get_access_token")
async def get_access_token(
    code: str,
    state: str,
    client: SplitwiseClient = Depends(get_splitwise_client),
    redirect_uri: str = Depends(get_redirect_uri)
):
    """
    Exchanges authorization code for an Access Token.
    """
    try:
        return await client.get_access_token(code=code, state=state, redirect_uri=redirect_uri)
    except SplitwiseClientError as e:
         raise HTTPException(status_code=500, detail=str(e))
