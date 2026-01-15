from __future__ import annotations
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel, Field, HttpUrl

class Picture(BaseModel):
    small: Optional[HttpUrl] = None
    medium: Optional[HttpUrl] = None
    large: Optional[HttpUrl] = None

class Balance(BaseModel):
    currency_code: str = Field(..., min_length=3, max_length=3)
    amount: Decimal

class FriendGroup(BaseModel):
    group_id: int = Field(..., ge=0)
    balance: List[Balance]
