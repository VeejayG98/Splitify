from __future__ import annotations
from typing import Optional, List, Dict
from datetime import datetime
from decimal import Decimal
from pydantic import Field, field_validator, BaseModel, model_validator
from typing_extensions import Self

from backend.dtos.base import ReadDto
from backend.dtos.user import User

class CommentItem(BaseModel):
    name: str = Field(..., min_length=1)
    cost: Decimal
    splits: Dict[int, Decimal]

class CommentParticipant(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = None

class CreateComment(BaseModel):
    expense_id: int = Field(..., gt=0)
    content: Optional[str] = None
    items: Optional[List[CommentItem]] = None
    participants: Optional[List[CommentParticipant]] = None

    @model_validator(mode='after')
    def check_content_or_items(self) -> Self:
        if not self.content and not (self.items and self.participants):
            raise ValueError("Either 'content' or both 'items' and 'participants' must be provided.")
        return self

    @field_validator('content')
    @classmethod
    def content_must_not_be_whitespace(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError('must not be whitespace')
        return v

class Comment(ReadDto):
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
