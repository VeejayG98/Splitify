from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import httpx
from backend.services.client import SplitwiseClient
from backend.dtos.expense import Expense, ExpenseCreate
from backend.dtos.comment import Comment, CommentCreate
from backend.dependencies import get_splitwise_client

router = APIRouter()

@router.post("/expenses", response_model=List[Expense], status_code=status.HTTP_201_CREATED)
async def add_expense(
    expense_data: ExpenseCreate,
    token: str,
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Creates a new expense on Splitwise.
    """
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
    token: str,
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

    try:
        return await client.create_comment(token, comment_data)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
