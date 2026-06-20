import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger(__name__)

def send_contact_email(name: str, email: str, content: str):
    """
    Constructs and dispatches a contact notification email via SMTP.
    """
    if (not settings.SMTP_USER or 
        not settings.SMTP_TO or 
        "placeholder" in settings.SMTP_USER or 
        "your-app-password" in settings.SMTP_PASSWORD or
        "recipient@gmail.com" in settings.SMTP_TO):
        logger.warning("SMTP configuration is incomplete or using placeholders. Skipping email dispatch.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = settings.SMTP_FROM or settings.SMTP_USER
        msg['To'] = settings.SMTP_TO
        msg['Subject'] = f"[adiDev System Alert] New Message from {name}"
        
        body = (
            f"=== TACTICAL COMMUNICATION LINK ===\n\n"
            f"OPERATIVE CODENAME: {name}\n"
            f"RETURN ADDRESS: {email}\n\n"
            f"PAYLOAD MESSAGE:\n"
            f"----------------------------------------\n"
            f"{content}\n"
            f"----------------------------------------\n\n"
            f"Log dispatch time recorded automatically on server."
        )
        msg.attach(MIMEText(body, 'plain'))
        
        logger.info(f"Initiating secure email dispatch to {settings.SMTP_TO} via {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
        
        if settings.SMTP_PORT == 465:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                if settings.SMTP_TLS:
                    server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
            
        logger.info("Communication payload transmitted successfully via SMTP link.")
    except Exception as e:
        logger.error(f"Failed to transmit email payload over SMTP link: {e}", exc_info=True)
