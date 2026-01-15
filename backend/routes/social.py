from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import List
from backend.services.client import SplitwiseClient
from backend.dtos.user import User
from backend.dtos.group import Group
from pydantic import BaseModel
import os

# We can probably move this dependency to a common place if reused
def get_splitwise_client() -> SplitwiseClient:
    # Assuming env vars are loaded. If not, we should load them.
    # For now, we instantiate with env vars.
    client_id = os.getenv("SPLITWISE_CLIENT_ID", "")
    api_key = os.getenv("SPLITWISE_CLIENT_SECRET", "") # Using SECRET as api_key based on legacy behavior context
    return SplitwiseClient(client_id, api_key)

router = APIRouter()

class AvatarResponse(BaseModel):
    avatar: str

class CommonGroup(BaseModel):
    id: int
    name: str

class CommonGroupsResponse(BaseModel):
    common_groups: List[CommonGroup]

class FriendsResponse(BaseModel):
    friends: List[User]

@router.get("/get_user_avatar", response_model=AvatarResponse)
async def get_user_avatar(
    token: str,
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Retrieves the current user's large avatar URL.
    """
    try:
        user = await client.get_current_user(token)
        # Access nested picture.large if available.
        # User DTO has `picture: Optional[Picture]`. `Picture` has `large`.
        avatar_url = ""
        if user.picture and user.picture.large:
             avatar_url = str(user.picture.large)

        return AvatarResponse(avatar=avatar_url)
    except Exception as e:
        # Basic error handling
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/get_participants", response_model=FriendsResponse)
async def get_participants(
    token: str,
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Retrieves the user's friends and the user themselves.
    Legacy behavior: Returns friends list + current user appended.
    """
    try:
        friends = await client.get_friends(token)
        current_user = await client.get_current_user(token)

        # Combine friends and current user
        # Legacy: friends_list.append(current_user)
        # We return a list of User objects.
        all_participants = friends + [current_user]

        return FriendsResponse(friends=all_participants)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/find_common_groups", response_model=CommonGroupsResponse)
async def find_common_groups(
    token: str,
    participants: str, # Keeping as string to match legacy comma-separated behavior?
                       # Or should I use List[int] = Query(...) ?
                       # Legacy `base.py` uses `participants.split(",")`.
                       # I'll accept string to be safe with existing frontend calls.
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Finds groups common to all provided participants.
    """
    try:
        # Parse participants
        try:
            participant_ids = [int(p) for p in participants.split(",")]
        except ValueError:
             raise HTTPException(status_code=400, detail="Invalid participants format. Must be comma-separated integers.")

        groups = await client.get_groups(token)

        common_groups = []
        for group in groups:
            # Check if all participants are in the group members
            # Group DTO has `members: List[User]`
            member_ids = {member.id for member in group.members}

            is_common = True
            for pid in participant_ids:
                if pid not in member_ids:
                    is_common = False
                    break

            if is_common:
                common_groups.append(CommonGroup(id=group.id, name=group.name))

        return CommonGroupsResponse(common_groups=common_groups)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
