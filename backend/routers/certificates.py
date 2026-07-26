from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.colors import HexColor
import datetime

import models
from database import get_db
from auth import get_current_user

router = APIRouter(tags=["Certificates"])

@router.get("/api/certificates/generate")
def generate_certificate(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    cert_dir = os.path.join(os.getcwd(), "static", "certificates")
    os.makedirs(cert_dir, exist_ok=True)
    
    file_name = f"cert_{current_user.id}_{course_id}.pdf"
    file_path = os.path.join(cert_dir, file_name)
    
    # Generate PDF
    c = canvas.Canvas(file_path, pagesize=landscape(A4))
    width, height = landscape(A4)
    
    # Draw Background
    c.setFillColor(HexColor("#0f172a")) # Slate 900
    c.rect(0, 0, width, height, fill=1)
    
    # Border
    c.setStrokeColor(HexColor("#eab308")) # Yellow 500
    c.setLineWidth(10)
    c.rect(20, 20, width - 40, height - 40)
    
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Helvetica-Bold", 40)
    c.drawCentredString(width / 2, height - 100, "CERTIFICATE OF COMPLETION")
    
    c.setFont("Helvetica", 20)
    c.drawCentredString(width / 2, height - 160, "This is to certify that")
    
    # Remove accents for standard Helvetica compatibility, or use standard English
    import unicodedata
    def strip_accents(s):
       return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
       
    username_ascii = strip_accents(current_user.username)
    course_title_ascii = strip_accents(course.title)
    
    c.setFillColor(HexColor("#eab308"))
    c.setFont("Helvetica-Bold", 35)
    c.drawCentredString(width / 2, height - 220, username_ascii)
    
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Helvetica", 20)
    c.drawCentredString(width / 2, height - 280, "has successfully completed the course")
    
    c.setFillColor(HexColor("#38bdf8"))
    c.setFont("Helvetica-Bold", 25)
    c.drawCentredString(width / 2, height - 340, course_title_ascii)
    
    c.setFillColor(HexColor("#94a3b8"))
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2, height - 400, f"Awarded on: {datetime.date.today().strftime('%B %d, %Y')}")
    
    c.save()
    
    return FileResponse(file_path, media_type='application/pdf', filename=file_name)
