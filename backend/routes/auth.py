import os
from fastapi import APIRouter, Depends, HTTPException
from backend.services.client import SplitwiseClient
from backend.exceptions import SplitwiseClientError
from backend.dependencies import get_splitwise_client

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

@router.get("/getAccessToken")
def get_access_token(client: SplitwiseClient = Depends(get_splitwise_client)):
    """
    Returns the Access Token.
    """
    try:
        return {"access_token": client.get_access_token()}
    except SplitwiseClientError as e:
         raise HTTPException(status_code=500, detail=str(e))
