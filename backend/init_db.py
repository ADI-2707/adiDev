from app.db.session import engine
from app.models.models import Base
from app.core.config import settings

print(f"Creating tables for {settings.PROJECT_NAME}...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")

# Seed the testimonials table
from app.db.session import SessionLocal
from app.models.models import Testimonial

db = SessionLocal()
if db.query(Testimonial).count() == 0:
    print("Seeding initial testimonials...")
    initial_testimonials = [
        Testimonial(
            author="Sarah Jenkins",
            role="Lead Systems Engineer, Apex Automation",
            content="Aditya completely overhauled our legacy machine dashboard. The new Blazor WASM client handles socket data seamlessly without ever dropping a frame. Incredibly solid engineering.",
            is_approved=True
        ),
        Testimonial(
            author="David Chen",
            role="Product Manager, VSM Venture Control",
            content="Working with Aditya is a breath of fresh air. He doesn't just write code; he thinks about the entire system architecture, failure states, and user experience. The telemetry console he built is best-in-class.",
            is_approved=True
        ),
        Testimonial(
            author="Dr. Elena Rostova",
            role="Director of Education, E-Learning Hub",
            content="We had 500+ students trying to stream 4K video exams simultaneously, and our old platform crashed daily. Aditya rebuilt the streaming API gateway in .NET, and we haven't had a single crash since.",
            is_approved=True
        )
    ]
    db.add_all(initial_testimonials)
    db.commit()
    print("Testimonials seeded successfully!")
else:
    print("Testimonials already seeded.")
db.close()
