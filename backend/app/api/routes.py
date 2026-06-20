from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Message, Download, Testimonial
from app.schemas.schemas import MessageCreate, MessageResponse, DownloadResponse, TestimonialCreate, TestimonialResponse
from typing import List
import os

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI server is running!"}

@router.post("/messages", response_model=MessageResponse)
def create_message(message_in: MessageCreate, db: Session = Depends(get_db)):
    db_message = Message(
        name=message_in.name,
        email=message_in.email,
        content=message_in.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/resume/download")
def download_resume(request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else None
    
    # Log the download
    db_download = Download(ip_address=client_ip)
    db.add(db_download)
    db.commit()

    # The actual PDF file should be stored in the root or a static folder
    # For now, we will look for resume.pdf in the frontend public directory
    pdf_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../public/resume.pdf"))
    
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Resume not found on server.")
        
    return FileResponse(
        path=pdf_path,
        filename="Aditya_Singh_Resume.pdf",
        media_type="application/pdf"
    )

@router.get("/testimonials", response_model=List[TestimonialResponse])
def get_testimonials(db: Session = Depends(get_db)):
    # Get the latest 5 testimonials
    testimonials = db.query(Testimonial).order_by(Testimonial.created_at.desc()).limit(5).all()
    return testimonials

@router.post("/testimonials", response_model=TestimonialResponse)
def create_testimonial(testimonial_in: TestimonialCreate, db: Session = Depends(get_db)):
    db_testimonial = Testimonial(
        author=testimonial_in.author,
        role=testimonial_in.role,
        content=testimonial_in.content
    )
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial
