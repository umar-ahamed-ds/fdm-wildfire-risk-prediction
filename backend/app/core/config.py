from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    FRONTEND_URL: str = "http://localhost:5173"
    GEOAPIFY_API_KEY: str | None = None
    MONGODB_URI: str | None = None
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
