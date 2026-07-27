from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.listing import ListingResponse


class FavouriteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    listing_id: str
    created_at: datetime


class FavouriteToggleResponse(BaseModel):
    favourited: bool
    message: str
    favourite: Optional[FavouriteResponse] = None
