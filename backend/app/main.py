from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import init_db
from app.routers import listings as listings_router
from app.routers import reservations as reservations_router
from app.routers import favourites as favourites_router
# Import models so they are registered with Base.metadata before init_db runs
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create DB tables and auto-seed if empty on startup."""
    await init_db()
    # Auto-seed if the database is empty
    try:
        from sqlalchemy import select, text
        from app.database import AsyncSessionLocal
        from app.models.user import User
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User).limit(1))
            if result.scalar_one_or_none() is None:
                import sys
                import os
                # Add backend dir to path so seed.py can be imported
                backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                sys.path.insert(0, backend_dir)
                from seed import seed
                await seed()
    except Exception as e:
        print(f"Auto-seed warning: {e}")
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(listings_router.router)
app.include_router(reservations_router.router)
app.include_router(favourites_router.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
