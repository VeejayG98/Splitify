from __future__ import annotations
from typing import List, TYPE_CHECKING
from pydantic import BaseModel, Field

from backend.dtos.user import User

class Friend(User):
    # Explicit Friend class if needed, but User covers it.
    pass
