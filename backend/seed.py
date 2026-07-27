"""
Seed script — run from the backend/ directory:
    python seed.py
"""
import asyncio
import uuid

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Must import models before calling metadata.create_all
import app.models  # noqa: F401
from app.database import Base
from app.models.user import User
from app.models.listing import Listing

DATABASE_URL = "sqlite+aiosqlite:///./airbnb.db"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

HOST_ID = "host-user-001"
GUEST_ID = "guest-user-002"

USERS = [
    User(
        id=HOST_ID,
        name="Sarah Mitchell",
        email="sarah@airbnb-demo.com",
        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        is_host=True,
    ),
    User(
        id=GUEST_ID,
        name="James Carter",
        email="james@airbnb-demo.com",
        avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
        is_host=False,
    ),
]

LISTINGS = [
    Listing(
        id=str(uuid.uuid4()),
        title="Beachfront Villa with Private Pool",
        description="Wake up to the sound of waves in this stunning beachfront villa. Features a private infinity pool, direct beach access, and breathtaking ocean views from every room. Perfect for a dream vacation.",
        category="Beach",
        location_city="Malibu",
        location_country="United States",
        price_per_night=450.0,
        max_guests=8,
        bedrooms=4,
        bathrooms=3,
        amenities="WiFi,Pool,Beach Access,BBQ,Parking,Air Conditioning,Kitchen,Washer",
        image_url="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80\nhttps://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Rustic Mountain Cabin in the Rockies",
        description="Escape to the mountains in this cozy log cabin surrounded by pine trees. Enjoy stunning rocky mountain views, a wood-burning fireplace, and a hot tub under the stars. Ideal for hikers and nature lovers.",
        category="Mountains",
        location_city="Aspen",
        location_country="United States",
        price_per_night=220.0,
        max_guests=6,
        bedrooms=3,
        bathrooms=2,
        amenities="WiFi,Hot Tub,Fireplace,Parking,Kitchen,Heating,BBQ",
        image_url="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80\nhttps://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Stunning Overwater Bungalow",
        description="Experience paradise in this iconic overwater bungalow above the crystal-clear lagoon. Glass floor panels reveal the vibrant marine life below. Includes a private deck and direct ladder access to the ocean.",
        category="Islands",
        location_city="Bora Bora",
        location_country="French Polynesia",
        price_per_night=650.0,
        max_guests=2,
        bedrooms=1,
        bathrooms=1,
        amenities="WiFi,Ocean Access,Private Deck,Air Conditioning,Breakfast Included,Kayaks",
        image_url="https://images.unsplash.com/photo-1439130490301-25e322d88054?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80\nhttps://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Medieval Castle with Panoramic Views",
        description="Live like royalty in this restored 14th-century castle. Original stonework meets modern luxury with heated floors, a gourmet kitchen, and sweeping views of the Loire Valley vineyards. A truly unforgettable stay.",
        category="Castles",
        location_city="Amboise",
        location_country="France",
        price_per_night=380.0,
        max_guests=10,
        bedrooms=5,
        bathrooms=4,
        amenities="WiFi,Parking,Kitchen,Wine Cellar,Garden,Fireplace,Heating",
        image_url="https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80\nhttps://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Luxury Infinity Pool Penthouse",
        description="Sky-high living with an infinity pool that merges with the city skyline. This penthouse features floor-to-ceiling windows, a gourmet kitchen, private rooftop terrace, and concierge service.",
        category="Pools",
        location_city="Bangkok",
        location_country="Thailand",
        price_per_night=310.0,
        max_guests=4,
        bedrooms=2,
        bathrooms=2,
        amenities="WiFi,Infinity Pool,Concierge,Gym,Air Conditioning,Kitchen,City Views",
        image_url="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80\nhttps://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Charming Lakeside Cottage",
        description="A picture-perfect cottage right on the water's edge. Spend lazy days kayaking on the lake, fishing from the private dock, or simply soaking in the tranquility from your own hammock. Autumn foliage is spectacular.",
        category="Lake",
        location_city="Lake District",
        location_country="United Kingdom",
        price_per_night=175.0,
        max_guests=4,
        bedrooms=2,
        bathrooms=1,
        amenities="WiFi,Kayaks,Private Dock,Fireplace,Kitchen,Parking,BBQ",
        image_url="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&q=80\nhttps://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Ski-In Ski-Out Alpine Chalet",
        description="Step directly onto the slopes from this premium alpine chalet. Features a luxurious sauna, a stone fireplace, ski storage, and a south-facing sun terrace to soak up the mountain sun after a day on the pistes.",
        category="Skiing",
        location_city="Zermatt",
        location_country="Switzerland",
        price_per_night=520.0,
        max_guests=8,
        bedrooms=4,
        bathrooms=3,
        amenities="WiFi,Sauna,Ski Storage,Fireplace,Parking,Kitchen,Heating,Balcony",
        image_url="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=900&q=80\nhttps://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Underground Cave House — Cappadocia",
        description="A once-in-a-lifetime experience carved directly into ancient volcanic rock. This cave suite features a thermal spa, domed ceilings with traditional frescoes, and a private terrace for watching the morning hot air balloons drift by.",
        category="Caves",
        location_city="Göreme",
        location_country="Turkey",
        price_per_night=195.0,
        max_guests=2,
        bedrooms=1,
        bathrooms=1,
        amenities="WiFi,Thermal Spa,Air Conditioning,Breakfast Included,Terrace",
        image_url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=900&q=80\nhttps://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Glamping Dome in the Countryside",
        description="Luxury camping reimagined. This geodesic dome sits in rolling green countryside with panoramic views of the hills. Features a king bed, wood-fired pizza oven, and dedicated stargazing deck — roughing it has never looked so good.",
        category="Camping",
        location_city="Tuscany",
        location_country="Italy",
        price_per_night=145.0,
        max_guests=2,
        bedrooms=1,
        bathrooms=1,
        amenities="WiFi,Wood-Fired Oven,BBQ,Heating,Stargazing Deck,Breakfast Included",
        image_url="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=900&q=80\nhttps://images.unsplash.com/photo-1510312305653-8ed496efae75?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Arctic Glass Igloo — Northern Lights",
        description="Sleep under the aurora borealis in your own private heated glass igloo. The transparent dome gives you a 360° view of the Arctic sky. Wake up to snow-covered spruce forests and reindeer grazing outside your window.",
        category="Arctic",
        location_city="Saariselkä",
        location_country="Finland",
        price_per_night=480.0,
        max_guests=2,
        bedrooms=1,
        bathrooms=1,
        amenities="WiFi,Heated Glass Roof,Private Sauna,Breakfast Included,Snowshoes Provided",
        image_url="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=900&q=80\nhttps://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Sahara Desert Luxury Camp",
        description="A sophisticated desert camp at the foot of towering sand dunes. Each private tent is furnished with Berber rugs, a four-poster bed, and an en-suite with hot water. Camel trek and sunset cocktails included.",
        category="Desert",
        location_city="Merzouga",
        location_country="Morocco",
        price_per_night=260.0,
        max_guests=2,
        bedrooms=1,
        bathrooms=1,
        amenities="WiFi,Camel Trek,Sunset Cocktails,Air Cooling,Breakfast Included,Stargazing",
        image_url="https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=900&q=80\nhttps://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Converted Victorian Countryside Barn",
        description="A sensitively converted Victorian-era stone barn in the heart of the English countryside. Cathedral ceilings, exposed timbers, and a log burner create a dramatic yet cozy space. Rolling hills and sheep outside your door.",
        category="Barns",
        location_city="Cotswolds",
        location_country="United Kingdom",
        price_per_night=210.0,
        max_guests=6,
        bedrooms=3,
        bathrooms=2,
        amenities="WiFi,Fireplace,Parking,Kitchen,Garden,Heating,Washer,Pet Friendly",
        image_url="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80\nhttps://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Ultra-Luxury Cliffside Villa — Amalfi",
        description="An extraordinary ultra-luxury villa perched on the Amalfi cliffs. Floor-to-ceiling glass walls frame the Mediterranean. Features a personal chef on request, private plunge pool, and a helipad. Pure indulgence.",
        category="Lux",
        location_city="Positano",
        location_country="Italy",
        price_per_night=1200.0,
        max_guests=6,
        bedrooms=3,
        bathrooms=3,
        amenities="WiFi,Plunge Pool,Chef on Request,Helipad,Concierge,Sea Views,Air Conditioning",
        image_url="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80\nhttps://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Tropical Treehouse Retreat",
        description="Perched high in the jungle canopy, this treehouse is a true escape. Reach it via a rope bridge, then settle in to a bamboo deck with a hammock overlooking a waterfall. Monkeys and toucans are your neighbours.",
        category="Countryside",
        location_city="Manuel Antonio",
        location_country="Costa Rica",
        price_per_night=165.0,
        max_guests=2,
        bedrooms=1,
        bathrooms=1,
        amenities="WiFi,Hammock,Jungle Views,Breakfast Included,Waterfall Access,Eco-Friendly",
        image_url="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80\nhttps://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Santorini Cliffside Suite",
        description="The iconic blue domed suite you've always dreamed of. Perched on the Caldera cliff in Oia, with a private plunge pool and uninterrupted views of the Aegean at sunset. Cave architecture with every modern luxury.",
        category="Islands",
        location_city="Oia, Santorini",
        location_country="Greece",
        price_per_night=395.0,
        max_guests=2,
        bedrooms=1,
        bathrooms=1,
        amenities="WiFi,Plunge Pool,Caldera Views,Air Conditioning,Breakfast Included,Concierge",
        image_url="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900&q=80\nhttps://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Modern Surf Shack — Bali",
        description="A chic surf-inspired villa 200 metres from Echo Beach. Open-plan living with rattan furniture, a private plunge pool, and an outdoor jungle bathroom. Your surf instructor and board rental can be arranged.",
        category="Beach",
        location_city="Canggu, Bali",
        location_country="Indonesia",
        price_per_night=135.0,
        max_guests=4,
        bedrooms=2,
        bathrooms=2,
        amenities="WiFi,Plunge Pool,Surfboard Rental,Kitchen,Air Conditioning,Parking",
        image_url="https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80\nhttps://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Canadian Lakeside Log Cabin",
        description="Classic Canadian wilderness living. This hand-hewn log cabin sits on a private lake in Ontario's cottage country. Paddle a canoe, spot bald eagles, and roast marshmallows around the fire pit after dark.",
        category="Lake",
        location_city="Muskoka",
        location_country="Canada",
        price_per_night=195.0,
        max_guests=6,
        bedrooms=3,
        bathrooms=2,
        amenities="WiFi,Canoe,Fire Pit,Private Lake Access,Kitchen,Parking,Heating,Pet Friendly",
        image_url="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&q=80\nhttps://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Dolomites Panorama Chalet",
        description="A luxury chalet with postcard views of the Dolomites' dramatic peaks. Features an outdoor jacuzzi, a wine cellar stocked with local Alto Adige wines, and a private ski room. Hiking trails start from the front door.",
        category="Mountains",
        location_city="Cortina d'Ampezzo",
        location_country="Italy",
        price_per_night=340.0,
        max_guests=8,
        bedrooms=4,
        bathrooms=3,
        amenities="WiFi,Outdoor Jacuzzi,Wine Cellar,Ski Room,Parking,Kitchen,Heating,Balcony",
        image_url="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80\nhttps://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="New York City Loft — Manhattan",
        description="Live like a New Yorker in this sprawling SoHo loft. Exposed brick, 14-foot ceilings, and city light views. Walk to the best galleries, restaurants, and shopping Manhattan has to offer. Top-floor, elevator building.",
        category="Lux",
        location_city="New York City",
        location_country="United States",
        price_per_night=290.0,
        max_guests=4,
        bedrooms=2,
        bathrooms=2,
        amenities="WiFi,Gym Access,Doorman,City Views,Air Conditioning,Kitchen,Washer",
        image_url="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80\nhttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
        host_id=HOST_ID,
    ),
    Listing(
        id=str(uuid.uuid4()),
        title="Provençal Stone Farmhouse",
        description="A sun-drenched 18th-century stone farmhouse surrounded by lavender fields and olive groves. The private pool glimmers against the golden Provence light. A perfect base for exploring the Luberon villages.",
        category="Countryside",
        location_city="Gordes",
        location_country="France",
        price_per_night=280.0,
        max_guests=8,
        bedrooms=4,
        bathrooms=3,
        amenities="WiFi,Private Pool,Parking,Kitchen,Garden,Fireplace,Heating,BBQ,Pet Friendly",
        image_url="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=80",
        extra_images="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&q=80\nhttps://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80",
        host_id=HOST_ID,
    ),
]


async def seed() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        from sqlalchemy import select
        result = await session.execute(select(User).limit(1))
        if result.scalar_one_or_none():
            print("Database already seeded. Updating image URLs for existing records.")
            # Clear existing listings and re-seed to ensure clean image URLs
            from app.models.reservation import Reservation
            from app.models.favourite import Favourite
            await session.execute(Reservation.__table__.delete())
            await session.execute(Favourite.__table__.delete())
            await session.execute(Listing.__table__.delete())
            await session.execute(User.__table__.delete())
            await session.commit()

        session.add_all(USERS)
        await session.flush()  # Ensure users exist before listings reference them

        session.add_all(LISTINGS)
        await session.commit()

    print(f"SUCCESS: Seeded {len(USERS)} users and {len(LISTINGS)} listings.")


if __name__ == "__main__":
    asyncio.run(seed())
