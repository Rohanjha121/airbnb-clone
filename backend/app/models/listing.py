import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    location_city: Mapped[str] = mapped_column(String(100), nullable=False)
    location_country: Mapped[str] = mapped_column(String(100), nullable=False)
    price_per_night: Mapped[float] = mapped_column(Float, nullable=False)
    max_guests: Mapped[int] = mapped_column(Integer, nullable=False)
    bedrooms: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    bathrooms: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    # Comma-separated amenity strings stored as plain text
    amenities: Mapped[str] = mapped_column(Text, default="", nullable=False)
    # Primary image URL
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    # Additional image URLs (newline-separated)
    extra_images: Mapped[str] = mapped_column(Text, default="", nullable=False)
    host_id: Mapped[str] = mapped_column(
        String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
