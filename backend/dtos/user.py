from __future__ import annotations
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import Field, field_validator, EmailStr

from backend.dtos.base import ReadDto
from backend.dtos.common import Picture, Balance, FriendGroup

class User(ReadDto):
    id: int = Field(..., ge=0)
    first_name: str = Field(..., min_length=1)
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
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
