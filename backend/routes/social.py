from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import List
import httpx
from backend.services.client import SplitwiseClient
from backend.dtos.user import User
from backend.dtos.group import Group
from backend.dtos.social import AvatarResponse, CommonGroup, CommonGroupsResponse, FriendsResponse
from backend.dependencies import get_splitwise_client

router = APIRouter()

@router.get("/get_user_avatar", response_model=AvatarResponse)
async def get_user_avatar(
    token: str,
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Retrieves the current user's large avatar URL.
    Fallback: large -> medium -> small -> empty string.
    """
    try:
        user = await client.get_current_user(token)
        avatar_url = ""

        if user.picture:
            if user.picture.large:
                avatar_url = str(user.picture.large)
            elif user.picture.medium:
                avatar_url = str(user.picture.medium)
            elif user.picture.small:
                avatar_url = str(user.picture.small)

        return AvatarResponse(avatar=avatar_url)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get_participants", response_model=FriendsResponse)
async def get_participants(
    token: str,
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Retrieves the user's friends and the user themselves.
    The frontend expects the current user to be included in the list of participants.
    """
    try:
        friends = await client.get_friends(token)
        current_user = await client.get_current_user(token)

        all_participants = friends + [current_user]

        return FriendsResponse(friends=all_participants)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/find_common_groups", response_model=CommonGroupsResponse)
async def find_common_groups(
    token: str,
    participants: List[int] = Query(...),
    client: SplitwiseClient = Depends(get_splitwise_client)
):
    """
    Finds groups common to all provided participants.
    """
    try:
        groups = await client.get_groups(token)

        common_groups = []
        for group in groups:
            # Check if all participants are in the group members
            member_ids = {member.id for member in group.members}

            is_common = True
            for pid in participants:
                if pid not in member_ids:
                    is_common = False
                    break

            if is_common:
                common_groups.append(CommonGroup(id=group.id, name=group.name))

        return CommonGroupsResponse(common_groups=common_groups)

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
