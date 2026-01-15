from __future__ import annotations
from typing import Optional, List
from decimal import Decimal
from pydantic import Field, HttpUrl
from backend.dtos.base import ReadDto

class Picture(ReadDto):
    small: Optional[HttpUrl] = None
    medium: Optional[HttpUrl] = None
    large: Optional[HttpUrl] = None

class Balance(ReadDto):
    currency_code: str = Field(..., min_length=3, max_length=3)
    amount: Decimal

class FriendGroup(ReadDto):
    group_id: int = Field(..., ge=0)
    balance: List[Balance]
