from __future__ import annotations
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from pydantic import Field, field_validator, HttpUrl

from backend.dtos.base import ReadDto
from backend.dtos.user import User

class Debt(ReadDto):
    from_user: int = Field(..., alias="from", ge=0)
    to_user: int = Field(..., alias="to", ge=0)
    amount: Decimal
    currency_code: str = Field(..., min_length=3, max_length=3)

class Avatar(ReadDto):
    original: Optional[HttpUrl] = None
    xxlarge: Optional[HttpUrl] = None
    xlarge: Optional[HttpUrl] = None
    large: Optional[HttpUrl] = None
    medium: Optional[HttpUrl] = None
    small: Optional[HttpUrl] = None

class CoverPhoto(ReadDto):
    xxlarge: Optional[HttpUrl] = None
    xlarge: Optional[HttpUrl] = None

class Group(ReadDto):
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
    invite_link: Optional[str] = None

    @field_validator('name')
    @classmethod
    def name_must_not_be_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('must not be whitespace')
        return v
