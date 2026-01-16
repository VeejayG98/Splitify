from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, List, Union
import httpx

from backend.dependencies import get_splitwise_client
from backend.services.client import SplitwiseClient
from backend.dtos.expense import CreateExpense, Expense
from backend.dtos.comment import CreateComment, CreateItemizedComment, Comment
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(prefix="/expenses", tags=["Expenses"])
security = HTTPBearer()

def get_current_user_token(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]) -> str:
    """
    Extracts the Bearer token from the Authorization header.
    """
    return credentials.credentials

@router.post("/add", response_model=List[Expense], status_code=status.HTTP_201_CREATED)
async def add_expense(
    expense_data: CreateExpense,
    client: Annotated[SplitwiseClient, Depends(get_splitwise_client)],
    token: Annotated[str, Depends(get_current_user_token)]
):
    try:
        return await client.create_expense(token, expense_data)
    except httpx.HTTPStatusError as e:
         # Pass upstream error status code if possible
        raise HTTPException(status_code=e.response.status_code, detail="External API error")
    except Exception as e:
        # Avoid leaking internal exception details
        print(f"Error creating expense: {e}") # Logging
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create expense")

@router.post("/comments/add", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def add_itemized_comment(
    payload: Union[CreateItemizedComment, CreateComment],
    client: Annotated[SplitwiseClient, Depends(get_splitwise_client)],
    token: Annotated[str, Depends(get_current_user_token)]
):
    try:
        if isinstance(payload, CreateItemizedComment):
            return await client.create_itemized_comment(token, payload)
        else:
            return await client.create_comment(token, payload)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="External API error")
    except Exception as e:
        print(f"Error creating comment: {e}") # Logging
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to add comment")
