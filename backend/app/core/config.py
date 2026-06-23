from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Portfolio Backend"
    DATABASE_URL: str
    ADMIN_PASSCODE: str = ""
    
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TLS: bool = True
    SMTP_FROM: str = ""
    SMTP_TO: str = ""
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
