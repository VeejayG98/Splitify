from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List, Annotated
import httpx
from backend.services.client import SplitwiseClient
from backend.dtos.expense import Expense, ExpenseCreate
from backend.dtos.comment import Comment, CommentCreate
from backend.dependencies import get_splitwise_client

router = APIRouter()

@router.post("/expenses", response_model=List[Expense], status_code=status.HTTP_201_CREATED)
async def add_expense(
    expense_data: ExpenseCreate,
    authorization: Annotated[str, Header(description="Bearer token")],
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Creates a new expense on Splitwise.
    """
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    try:
        return await client.create_expense(token, expense_data)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/expenses/{expense_id}/comments", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def add_comment(
    expense_id: int,
    comment_data: CommentCreate,
    authorization: Annotated[str, Header(description="Bearer token")],
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Adds a comment to an existing expense.
    """
    if comment_data.expense_id != expense_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expense ID in path does not match body"
        )

    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization

    try:
        return await client.create_comment(token, comment_data)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
