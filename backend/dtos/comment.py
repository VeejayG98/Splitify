from __future__ import annotations
from typing import Optional
from datetime import datetime
from pydantic import Field, field_validator, BaseModel

from backend.dtos.base import ReadDto
from backend.dtos.user import User

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

class CommentCreate(BaseModel):
    expense_id: int = Field(..., ge=0)
    content: str = Field(..., min_length=1)

    @field_validator('content')
    @classmethod
    def content_must_not_be_whitespace(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('must not be whitespace')
        return v
