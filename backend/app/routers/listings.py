import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.listing import Listing
from app.schemas.listing import ListingCreate, ListingResponse, ListingUpdate

router = APIRouter(prefix="/listings", tags=["listings"])


def get_current_user_id(x_user_id: Optional[str] = Header(None, alias="X-User-Id")) -> str:
    return x_user_id or "host-user-001"


@router.get("", response_model=list[ListingResponse])
async def get_listings(
    category: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    guests: Optional[int] = Query(None, ge=1),
    host_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> list[Listing]:
    stmt = select(Listing)

    if category:
        stmt = stmt.where(Listing.category == category)
    if location:
        location_lower = location.lower()
        stmt = stmt.where(
            Listing.location_city.ilike(f"%{location_lower}%")
            | Listing.location_country.ilike(f"%{location_lower}%")
        )
    if min_price is not None:
        stmt = stmt.where(Listing.price_per_night >= min_price)
    if max_price is not None:
        stmt = stmt.where(Listing.price_per_night <= max_price)
    if guests is not None:
        stmt = stmt.where(Listing.max_guests >= guests)
    if host_id:
        stmt = stmt.where(Listing.host_id == host_id)

    stmt = stmt.order_by(Listing.created_at.desc())
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
) -> Listing:
    stmt = select(Listing).where(Listing.id == listing_id)
    result = await db.execute(stmt)
    listing = result.scalar_one_or_none()
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
async def create_listing(
    listing_in: ListingCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> Listing:
    new_listing = Listing(
        id=str(uuid.uuid4()),
        host_id=user_id,
        **listing_in.model_dump(),
    )
    db.add(new_listing)
    await db.commit()
    await db.refresh(new_listing)
    return new_listing


@router.patch("/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: str,
    listing_in: ListingUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> Listing:
    stmt = select(Listing).where(Listing.id == listing_id)
    result = await db.execute(stmt)
    listing = result.scalar_one_or_none()

    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.host_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to edit this listing",
        )

    update_data = listing_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(listing, field, value)

    await db.commit()
    await db.refresh(listing)
    return listing


@router.delete("/{listing_id}")
async def delete_listing(
    listing_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Listing).where(Listing.id == listing_id)
    result = await db.execute(stmt)
    listing = result.scalar_one_or_none()

    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.host_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this listing",
        )

    await db.delete(listing)
    await db.commit()
    return {"message": "Listing deleted successfully"}

