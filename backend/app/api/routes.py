from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks, Header
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Message, Download, Testimonial
from app.schemas.schemas import MessageCreate, MessageResponse, DownloadResponse, TestimonialCreate, TestimonialResponse
from app.core.email import send_contact_email
from app.core.rate_limit import contact_rate_limiter, testimonial_rate_limiter
from app.core.config import settings
from typing import List, Optional
import os
import html
import getpass

router = APIRouter()

# Admin validation dependency
def verify_admin(x_admin_passcode: Optional[str] = Header(None)):
    if not x_admin_passcode or not settings.ADMIN_PASSCODE or x_admin_passcode != settings.ADMIN_PASSCODE:
        raise HTTPException(
            status_code=401,
            detail="Access Denied: Invalid security clearance passcode."
        )
    return x_admin_passcode

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI server is running!"}

@router.post("/messages", response_model=MessageResponse, dependencies=[Depends(contact_rate_limiter)])
def create_message(message_in: MessageCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Sanitize inputs to prevent XSS
    clean_name = html.escape(message_in.name)
    clean_email = html.escape(message_in.email)
    clean_content = html.escape(message_in.content)

    db_message = Message(
        name=clean_name,
        email=clean_email,
        content=clean_content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Securely queue email dispatch asynchronously
    background_tasks.add_task(
        send_contact_email,
        name=clean_name,
        email=clean_email,
        content=clean_content
    )
    
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
    # Get the latest 5 approved testimonials
    testimonials = db.query(Testimonial).filter(Testimonial.is_approved == True).order_by(Testimonial.created_at.desc()).limit(5).all()
    return testimonials

@router.post("/testimonials", response_model=TestimonialResponse, dependencies=[Depends(testimonial_rate_limiter)])
def create_testimonial(testimonial_in: TestimonialCreate, db: Session = Depends(get_db)):
    # Sanitize inputs to prevent XSS
    clean_author = html.escape(testimonial_in.author)
    clean_role = html.escape(testimonial_in.role)
    clean_content = html.escape(testimonial_in.content)

    db_testimonial = Testimonial(
        author=clean_author,
        role=clean_role,
        content=clean_content,
        is_approved=False  # Must be approved by admin
    )
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

# --- Admin Operations Endpoints ---

@router.get("/admin/messages", response_model=List[MessageResponse])
def get_admin_messages(x_admin_passcode: str = Depends(verify_admin), db: Session = Depends(get_db)):
    return db.query(Message).order_by(Message.created_at.desc()).all()

@router.get("/admin/testimonials", response_model=List[TestimonialResponse])
def get_admin_testimonials(x_admin_passcode: str = Depends(verify_admin), db: Session = Depends(get_db)):
    return db.query(Testimonial).order_by(Testimonial.created_at.desc()).all()

@router.put("/testimonials/{id}/approve", response_model=TestimonialResponse)
def approve_testimonial(id: int, x_admin_passcode: str = Depends(verify_admin), db: Session = Depends(get_db)):
    testimonial = db.query(Testimonial).filter(Testimonial.id == id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial record not found")
    testimonial.is_approved = True  # type: ignore
    db.commit()
    db.refresh(testimonial)
    return testimonial

@router.delete("/testimonials/{id}")
def delete_testimonial(id: int, x_admin_passcode: str = Depends(verify_admin), db: Session = Depends(get_db)):
    testimonial = db.query(Testimonial).filter(Testimonial.id == id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial record not found")
    db.delete(testimonial)
    db.commit()
    return {"status": "success", "message": f"Testimonial {id} successfully purged from database."}

@router.get("/admin/detect-host")
def detect_host():
    try:
        return {"username": getpass.getuser()}
    except Exception:
        # Fallback if running headless or inside docker
        return {"username": os.environ.get("USERNAME") or os.environ.get("USER") or "OPERATIVE_GUEST"}
