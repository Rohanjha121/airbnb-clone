import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.favourite import Favourite
from app.models.listing import Listing
from app.schemas.favourite import FavouriteResponse, FavouriteToggleResponse
from app.schemas.listing import ListingResponse

router = APIRouter(prefix="/favourites", tags=["favourites"])


def get_current_user_id(x_user_id: Optional[str] = Header(None, alias="X-User-Id")) -> str:
    return x_user_id or "guest-user-002"


@router.get("", response_model=list[ListingResponse])
async def get_favourites(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Fetch all listings favourited by current user, sorted by most recently saved."""
    stmt = (
        select(Listing)
        .join(Favourite, Listing.id == Favourite.listing_id)
        .where(Favourite.user_id == user_id)
        .order_by(Favourite.created_at.desc())
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/ids", response_model=list[str])
async def get_favourite_ids(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Fetch list of listing IDs favourited by current user for fast lookup."""
    stmt = select(Favourite.listing_id).where(Favourite.user_id == user_id)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post("/{listing_id}", response_model=FavouriteToggleResponse, status_code=status.HTTP_200_OK)
async def toggle_favourite(
    listing_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Toggle favourite status for a listing.
    
    If listing is already favourited by user, removes it.
    If listing is not favourited, adds it.
    """
    # 1. Validate listing existence
    listing_stmt = select(Listing).where(Listing.id == listing_id)
    listing_res = await db.execute(listing_stmt)
    listing = listing_res.scalar_one_or_none()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # 2. Check if favourite already exists
    fav_stmt = select(Favourite).where(
        Favourite.user_id == user_id,
        Favourite.listing_id == listing_id,
    )
    fav_res = await db.execute(fav_stmt)
    existing_fav = fav_res.scalar_one_or_none()

    # 3. If exists, remove it (toggle off)
    if existing_fav:
        await db.delete(existing_fav)
        await db.commit()
        return FavouriteToggleResponse(
            favourited=False,
            message="Listing removed from favourites",
            favourite=None,
        )

    # 4. If does not exist, add it (toggle on)
    new_fav = Favourite(
        id=str(uuid.uuid4()),
        user_id=user_id,
        listing_id=listing_id,
    )
    db.add(new_fav)
    await db.commit()
    await db.refresh(new_fav)

    return FavouriteToggleResponse(
        favourited=True,
        message="Listing added to favourites",
        favourite=FavouriteResponse.model_validate(new_fav),
    )
