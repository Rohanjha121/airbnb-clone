from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ListingCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=50)
    location_city: str = Field(..., min_length=1, max_length=100)
    location_country: str = Field(..., min_length=1, max_length=100)
    price_per_night: float = Field(..., gt=0)
    max_guests: int = Field(..., gt=0)
    bedrooms: int = Field(default=1, ge=1)
    bathrooms: int = Field(default=1, ge=1)
    amenities: str = Field(default="")
    image_url: str = Field(..., min_length=1)
    extra_images: str = Field(default="")


class ListingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    location_city: Optional[str] = Field(None, min_length=1, max_length=100)
    location_country: Optional[str] = Field(None, min_length=1, max_length=100)
    price_per_night: Optional[float] = Field(None, gt=0)
    max_guests: Optional[int] = Field(None, gt=0)
    bedrooms: Optional[int] = Field(None, ge=1)
    bathrooms: Optional[int] = Field(None, ge=1)
    amenities: Optional[str] = None
    image_url: Optional[str] = Field(None, min_length=1)
    extra_images: Optional[str] = None


class ListingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str
    category: str
    location_city: str
    location_country: str
    price_per_night: float
    max_guests: int
    bedrooms: int
    bathrooms: int
    amenities: str  # comma-separated, parsed by frontend
    image_url: str
    extra_images: str  # newline-separated, parsed by frontend
    host_id: str
    created_at: datetime

