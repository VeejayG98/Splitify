from __future__ import annotations
from datetime import datetime
from decimal import Decimal
from typing import List, Optional, Literal, Dict, Any

from pydantic import BaseModel, Field, field_validator, EmailStr, HttpUrl, ConfigDict

# Helper Models

class Picture(BaseModel):
    small: Optional[HttpUrl] = None
    medium: Optional[HttpUrl] = None
    large: Optional[HttpUrl] = None

class Balance(BaseModel):
    currency_code: str = Field(..., min_length=3, max_length=3)
    amount: Decimal

class Debt(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    from_user: int = Field(..., alias="from", ge=0)
    to_user: int = Field(..., alias="to", ge=0)
    amount: Decimal
    currency_code: str = Field(..., min_length=3, max_length=3)

class Avatar(BaseModel):
    original: Optional[HttpUrl] = None
    xxlarge: Optional[HttpUrl] = None
    xlarge: Optional[HttpUrl] = None
    large: Optional[HttpUrl] = None
    medium: Optional[HttpUrl] = None
    small: Optional[HttpUrl] = None

class CoverPhoto(BaseModel):
    xxlarge: Optional[HttpUrl] = None
    xlarge: Optional[HttpUrl] = None

class Category(BaseModel):
    id: int = Field(..., gt=0)
    name: str = Field(..., min_length=1)
    icon: Optional[HttpUrl] = None
    subcategories: Optional[List[Category]] = None

class Receipt(BaseModel):
    large: Optional[HttpUrl] = None
    original: Optional[HttpUrl] = None

class FriendGroup(BaseModel):
    group_id: int = Field(..., ge=0)
    balance: List[Balance]

# Main Models

class User(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int = Field(..., ge=0)
    first_name: str = Field(..., min_length=1)
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None # Some examples show email, others might not require it if it's a friend added by name? Docs say "The user's email or ID must be provided" for adding. But for GET, it seems present.
    registration_status: Optional[str] = None
    picture: Optional[Picture] = None
    custom_picture: Optional[bool] = None
    notifications_read: Optional[datetime] = None
    notifications_count: Optional[int] = None
    notifications: Optional[Dict[str, Any]] = None
    default_currency: Optional[str] = None
    locale: Optional[str] = None

    # Fields that appear in Friend context or Group Member context
    balance: Optional[List[Balance]] = None
    groups: Optional[List[FriendGroup]] = None
    updated_at: Optional[datetime] = None

    @field_validator('first_name')
    @classmethod
    def name_must_not_be_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('must not be whitespace')
        return v

class Friend(User):
    # Explicit Friend class if needed, but User covers it.
    pass

class Group(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int = Field(..., ge=0)
    name: str = Field(..., min_length=1)
    group_type: Optional[str] = None # e.g. "home", "trip"
    updated_at: Optional[datetime] = None
    simplify_by_default: Optional[bool] = None
    members: List[User]
    original_debts: Optional[List[Debt]] = None
    simplified_debts: Optional[List[Debt]] = None
    avatar: Optional[Avatar] = None
    custom_avatar: Optional[bool] = None
    cover_photo: Optional[CoverPhoto] = None
    invite_link: Optional[str] = None # Examples show a URL string but invite_link might not always be a valid HttpUrl format or might be just a token in some internal representations. Sample shows full URL. Using str to be safe or HttpUrl? Sample: "https://www.splitwise.com/join/..." - HttpUrl is fine.

    @field_validator('name')
    @classmethod
    def name_must_not_be_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('must not be whitespace')
        return v

class UserShare(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    user_id: int = Field(..., ge=0)
    user: Optional[User] = None
    paid_share: Decimal
    owed_share: Decimal
    net_balance: Decimal

class Comment(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: int = Field(..., ge=0)
    content: str = Field(..., min_length=1)
    comment_type: Optional[str] = None
    relation_type: Optional[str] = None
    relation_id: Optional[int] = None
    created_at: datetime
    deleted_at: Optional[datetime] = None
    user: Optional[User] = None

    @field_validator('content')
    @classmethod
    def content_must_not_be_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('must not be whitespace')
        return v

class Expense(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

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
