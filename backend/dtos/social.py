from typing import List
from pydantic import BaseModel
from backend.dtos.user import User

class AvatarResponse(BaseModel):
    avatar: str

class CommonGroup(BaseModel):
    id: int
    name: str

class CommonGroupsResponse(BaseModel):
    common_groups: List[CommonGroup]

class FriendsResponse(BaseModel):
    friends: List[User]
