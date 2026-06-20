from app.db.session import engine
from app.models.models import Base
from app.core.config import settings

print(f"Creating tables for {settings.PROJECT_NAME}...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
