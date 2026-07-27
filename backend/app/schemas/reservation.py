from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator
from app.schemas.listing import ListingResponse


class ReservationCreate(BaseModel):
    listing_id: str
    check_in: date
    check_out: date
    guests: int = Field(default=1, gt=0)

    @model_validator(mode="after")
    def validate_dates(self) -> "ReservationCreate":
        if self.check_out <= self.check_in:
            raise ValueError("check_out date must be strictly after check_in date")
        return self


class ReservationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    listing_id: str
    guest_id: str
    check_in: date
    check_out: date
    guests: int
    total_price: float
    created_at: datetime
    listing: Optional[ListingResponse] = None
