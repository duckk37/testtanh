from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime
import models
from database import get_db
from auth import get_current_user

router = APIRouter(tags=["Certificates"])

@router.get("/certificates/generate")
def generate_certificate(course_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    # Check if all lessons are completed
    total_lessons = db.query(models.Lesson).filter(models.Lesson.course_id == course_id).count()
    completed_lessons = db.query(models.UserLessonProgress).join(models.Lesson).filter(
        models.Lesson.course_id == course_id,
        models.UserLessonProgress.user_id == current_user.id,
        models.UserLessonProgress.is_completed == 1
    ).count()
    
    if total_lessons == 0 or completed_lessons < total_lessons:
        raise HTTPException(status_code=400, detail="Bạn chưa hoàn thành khóa học này!")
        
    return {
        "user_name": current_user.username,
        "course_title": course.title,
        "date": datetime.date.today().strftime('%B %d, %Y')
    }
