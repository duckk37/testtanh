from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
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
        
    return {
        "user_name": current_user.username,
        "course_title": course.title,
        "date": datetime.date.today().strftime('%B %d, %Y')
    }
