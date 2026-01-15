from fastapi import APIRouter, Depends, HTTPException
from backend.services.client import SplitwiseClient, Client

router = APIRouter()

def get_splitwise_client() -> Client:
    """
    Dependency to provide the SplitwiseClient.
    """
    try:
        return SplitwiseClient()
    except ValueError as e:
        # In case env vars are missing, we might want to handle it or let it crash depending on startup.
        # But here we instantiate per request (lightweight) or use lru_cache.
        # For simplicity, we just instantiate.
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get_client_id")
def get_client_id(client: Client = Depends(get_splitwise_client)):
    """
    Returns the configured Client ID.
    """
    try:
        return {"client_id": client.get_client_id()}
    except ValueError as e:
         raise HTTPException(status_code=500, detail=str(e))

@router.get("/getAccessToken")
def get_access_token(client: Client = Depends(get_splitwise_client)):
    """
    Returns the Access Token.
    """
    try:
        return {"access_token": client.get_access_token()}
    except ValueError as e:
         raise HTTPException(status_code=500, detail=str(e))
