import sys
import os
from sqlalchemy import inspect, text

# Add the backend directory to Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.db.session import engine

def migrate():
    print("Checking database schema for testimonials table...")
    inspector = inspect(engine)
    
    # Check if table exists
    if not inspector.has_table("testimonials"):
        print("Error: testimonials table does not exist. Run init_db.py first.")
        return

    columns = [col["name"] for col in inspector.get_columns("testimonials")]
    
    if "is_approved" not in columns:
        print("Column 'is_approved' not found. Appending to testimonials table...")
        with engine.begin() as conn:
            # Add column
            conn.execute(text("ALTER TABLE testimonials ADD COLUMN is_approved BOOLEAN DEFAULT FALSE"))
            # Update existing records to True so existing testimonials remain visible
            conn.execute(text("UPDATE testimonials SET is_approved = TRUE"))
        print("Column 'is_approved' successfully added and initialized.")
    else:
        print("Column 'is_approved' already exists in testimonials table. No migration needed.")

if __name__ == "__main__":
    migrate()
