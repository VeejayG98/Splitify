from __future__ import annotations
from typing import Optional, List, Literal
from datetime import datetime
from decimal import Decimal
from pydantic import Field, field_validator, HttpUrl

from backend.dtos.base import ReadDto
from backend.dtos.user import User
from backend.dtos.comment import Comment
from backend.dtos.group import Debt

class Category(ReadDto):
    id: int = Field(..., gt=0)
    name: str = Field(..., min_length=1)
    icon: Optional[HttpUrl] = None
    subcategories: Optional[List[Category]] = None

class Receipt(ReadDto):
    large: Optional[HttpUrl] = None
    original: Optional[HttpUrl] = None

class UserShare(ReadDto):
    user_id: int = Field(..., ge=0)
    user: Optional[User] = None
    paid_share: Decimal
    owed_share: Decimal
    net_balance: Decimal

class Expense(ReadDto):
    id: int = Field(..., ge=0)
    group_id: Optional[int] = Field(None, ge=0)
    friendship_id: Optional[int] = None
    expense_bundle_id: Optional[int] = None
    description: str = Field(..., min_length=1)
    details: Optional[str] = None
    cost: Decimal
    currency_code: str = Field(..., min_length=3, max_length=3)
    date: datetime
    created_at: datetime
    created_by: Optional[User] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[User] = None
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[User] = None
    category_id: Optional[int] = None
    category: Optional[Category] = None
    receipt: Optional[Receipt] = None
    users: List[UserShare]
    comments: Optional[List[Comment]] = None
    comments_count: Optional[int] = None
    payment: bool
    transaction_confirmed: Optional[bool] = None
    repayments: Optional[List[Debt]] = None
    repeat_interval: Optional[Literal["never", "weekly", "fortnightly", "monthly", "yearly"]] = None
    repeats: Optional[bool] = None
    next_repeat: Optional[str] = None
    email_reminder: Optional[bool] = None
    email_reminder_in_advance: Optional[int] = None

    @field_validator('description')
    @classmethod
    def description_must_not_be_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('must not be whitespace')
        return v
