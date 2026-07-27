from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Airbnb Clone API"
    database_url: str = "sqlite+aiosqlite:///./airbnb.db"
    cors_origins: list[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://airbnb-clone-six-nu.vercel.app",
    ]

    class Config:
        env_file = ".env"


settings = Settings()

