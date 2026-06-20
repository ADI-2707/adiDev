from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    content: str

class MessageResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DownloadResponse(BaseModel):
    id: int
    downloaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
