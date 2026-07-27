import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.listing import Listing
from app.models.reservation import Reservation
from app.schemas.reservation import ReservationCreate, ReservationResponse

router = APIRouter(prefix="/reservations", tags=["reservations"])


def get_current_user_id(x_user_id: Optional[str] = Header(None, alias="X-User-Id")) -> str:
    return x_user_id or "guest-user-002"


@router.post("", response_model=ReservationResponse, status_code=status.HTTP_201_CREATED)
async def create_reservation(
    res_in: ReservationCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    # 1. Fetch listing
    stmt = select(Listing).where(Listing.id == res_in.listing_id)
    result = await db.execute(stmt)
    listing = result.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    # 2. Validate guest count
    if res_in.guests > listing.max_guests:
        raise HTTPException(
            status_code=400,
            detail=f"Guests count cannot exceed listing maximum of {listing.max_guests}",
        )

    # 3. Check overlapping reservations
    overlap_stmt = select(Reservation).where(
        Reservation.listing_id == res_in.listing_id,
        Reservation.check_in < res_in.check_out,
        Reservation.check_out > res_in.check_in,
    )
    overlap_result = await db.execute(overlap_stmt)
    if overlap_result.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail="The selected dates overlap with an existing reservation for this property.",
        )

    # 4. Calculate total price
    nights = (res_in.check_out - res_in.check_in).days
    total_price = round(nights * listing.price_per_night, 2)

    # 5. Create reservation
    new_reservation = Reservation(
        id=str(uuid.uuid4()),
        listing_id=res_in.listing_id,
        guest_id=user_id,
        check_in=res_in.check_in,
        check_out=res_in.check_out,
        guests=res_in.guests,
        total_price=total_price,
    )
    db.add(new_reservation)
    await db.commit()
    await db.refresh(new_reservation)

    # Attach listing object for response
    new_reservation.listing = listing
    return new_reservation


@router.get("", response_model=list[ReservationResponse])
async def get_reservations(
    listing_id: Optional[str] = Query(None),
    guest_id: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Reservation)

    if listing_id:
        stmt = stmt.where(Reservation.listing_id == listing_id)
    elif guest_id:
        stmt = stmt.where(Reservation.guest_id == guest_id)
    else:
        # Default to current user's reservations
        stmt = stmt.where(Reservation.guest_id == user_id)

    stmt = stmt.order_by(Reservation.check_in.asc())
    result = await db.execute(stmt)
    reservations = list(result.scalars().all())

    # Fetch corresponding listings
    for res in reservations:
        listing_stmt = select(Listing).where(Listing.id == res.listing_id)
        listing_res = await db.execute(listing_stmt)
        res.listing = listing_res.scalar_one_or_none()

    return reservations


@router.delete("/{reservation_id}")
async def cancel_reservation(
    reservation_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Reservation).where(Reservation.id == reservation_id)
    result = await db.execute(stmt)
    reservation = result.scalar_one_or_none()

    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    if reservation.guest_id != user_id:
        # Check if user is the host of the listing
        listing_stmt = select(Listing).where(Listing.id == reservation.listing_id)
        listing_res = await db.execute(listing_stmt)
        listing = listing_res.scalar_one_or_none()
        if not listing or listing.host_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to cancel this reservation",
            )

    await db.delete(reservation)
    await db.commit()
    return {"message": "Reservation cancelled successfully"}
