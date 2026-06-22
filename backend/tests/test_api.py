import pytest  # type: ignore # pyrefly: ignore[missing-import]
import os
import sys
from fastapi.testclient import TestClient  # type: ignore # pyrefly: ignore[missing-import]
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the backend directory to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.db.session import Base, get_db
from app.models.models import Testimonial, Message
from app.core.config import settings

# Setup clean SQLite testing database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override database session dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Configure settings for test
settings.ADMIN_PASSCODE = "secret_ops_passcode"

@pytest.fixture(autouse=True)
def run_around_tests():
    # Setup: create tables
    Base.metadata.create_all(bind=engine)
    
    # Import rate limiters to reset them between tests
    from app.core.rate_limit import contact_rate_limiter, testimonial_rate_limiter
    contact_rate_limiter.requests.clear()
    testimonial_rate_limiter.requests.clear()
    
    yield
    
    # Teardown: drop tables
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

# 1. Test Health Check
def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "FastAPI server is running!"}

# 2. Test Message Creation & Rate Limiting (Limit = 3)
def test_create_message_and_rate_limit():
    payload = {
        "name": "Agent Carter",
        "email": "carter@srb.gov",
        "content": "Intel report updated."
    }
    
    # First 3 requests should succeed
    for _ in range(3):
        response = client.post("/api/v1/messages", json=payload)
        assert response.status_code == 200
        assert response.json()["name"] == "Agent Carter"
        
    # 4th request must fail with 429 Too Many Requests
    response = client.post("/api/v1/messages", json=payload)
    assert response.status_code == 429
    assert "Rate limit exceeded" in response.json()["detail"]

# 3. Test HTML Sanitization (XSS Escape)
def test_xss_sanitization():
    xss_payload = {
        "name": "<script>alert('xss_name')</script>",
        "email": "hacker@shield.org",
        "content": "<img src=x onerror=alert('xss_content')>"
    }
    response = client.post("/api/v1/messages", json=xss_payload)
    assert response.status_code == 200
    data = response.json()
    
    # Angle brackets should be escaped into HTML entities
    assert "&lt;script&gt;" in data["name"]
    assert "&lt;img" in data["content"]

# 4. Test Testimonial Submission & Moderation Lock
def test_testimonial_flow():
    post_payload = {
        "author": "Tony Stark",
        "role": "Chief Tech Officer",
        "content": "Aditya builds robust hardware layers."
    }
    
    # Submit testimonial
    response = client.post("/api/v1/testimonials", json=post_payload)
    assert response.status_code == 200
    t_id = response.json()["id"]
    assert response.json()["is_approved"] is False  # Defaults to False
    
    # Public feed should be empty (since it's not approved yet)
    feed_response = client.get("/api/v1/testimonials")
    assert len(feed_response.json()) == 0
    
    # Moderate without passcode -> 401
    approve_response = client.put(f"/api/v1/testimonials/{t_id}/approve")
    assert approve_response.status_code == 401
    
    # Moderate with incorrect passcode -> 401
    approve_response = client.put(
        f"/api/v1/testimonials/{t_id}/approve",
        headers={"X-Admin-Passcode": "wrong_code"}
    )
    assert approve_response.status_code == 401
    
    # Approve with correct passcode -> 200
    approve_response = client.put(
        f"/api/v1/testimonials/{t_id}/approve",
        headers={"X-Admin-Passcode": "secret_ops_passcode"}
    )
    assert approve_response.status_code == 200
    assert approve_response.json()["is_approved"] is True
    
    # Public feed should now display it
    feed_response = client.get("/api/v1/testimonials")
    assert len(feed_response.json()) == 1
    assert feed_response.json()[0]["author"] == "Tony Stark"

# 5. Test Admin Listing and Deletion
def test_admin_logs_and_deletion():
    # Seed a message and testimonial
    client.post("/api/v1/messages", json={
        "name": "Maria Hill",
        "email": "hill@shield.org",
        "content": "Status report secure."
    })
    t_response = client.post("/api/v1/testimonials", json={
        "author": "Nick Fury",
        "role": "Director",
        "content": "Aegis is operational."
    })
    t_id = t_response.json()["id"]
    
    # Admin logs - invalid passcode
    logs_response = client.get("/api/v1/admin/messages", headers={"X-Admin-Passcode": "wrong"})
    assert logs_response.status_code == 401
    
    # Admin logs - valid passcode
    messages_log = client.get("/api/v1/admin/messages", headers={"X-Admin-Passcode": "secret_ops_passcode"})
    assert messages_log.status_code == 200
    assert len(messages_log.json()) == 1
    assert messages_log.json()[0]["name"] == "Maria Hill"
    
    testimonials_log = client.get("/api/v1/admin/testimonials", headers={"X-Admin-Passcode": "secret_ops_passcode"})
    assert testimonials_log.status_code == 200
    assert len(testimonials_log.json()) == 1
    
    # Delete testimonial via admin
    delete_res = client.delete(f"/api/v1/testimonials/{t_id}", headers={"X-Admin-Passcode": "secret_ops_passcode"})
    assert delete_res.status_code == 200
    
    # Verify testimonial is gone
    testimonials_log_after = client.get("/api/v1/admin/testimonials", headers={"X-Admin-Passcode": "secret_ops_passcode"})
    assert len(testimonials_log_after.json()) == 0

# 6. Test Host Detection
def test_detect_host():
    response = client.get("/api/v1/admin/detect-host")
    assert response.status_code == 200
    assert "username" in response.json()
