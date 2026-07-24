from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import models
from database import get_db
from auth import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

def require_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

class ReorderRequest(BaseModel):
    lesson_ids: List[str]

@router.get("/users")
def get_all_users(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    users = db.query(models.User).all()
    return [{"id": u.id, "email": u.email, "username": u.username, "role": u.role, "streak_count": u.streak_count} for u in users]

class CourseCreate(BaseModel):
    title: str
    description: str
    thumbnail: str
    price: float

@router.post("/courses")
def create_course(course: CourseCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    new_course = models.Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.delete("/courses/{course_id}")
def delete_course(course_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}

@router.put("/courses/{course_id}")
def update_course(course_id: str, course_in: CourseCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course.title = course_in.title
    course.description = course_in.description
    course.price = course_in.price
    course.thumbnail = course_in.thumbnail
    
    db.commit()
    db.refresh(course)
    return course

class LessonCreate(BaseModel):
    course_id: str
    title: str
    youtube_id: str
    order_index: int
    passing_score_required: int = 80

@router.post("/lessons")
def create_lesson(lesson: LessonCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    new_lesson = models.Lesson(**lesson.dict())
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson

@router.delete("/lessons/{lesson_id}")
def delete_lesson(lesson_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted"}

@router.put("/courses/{course_id}/lessons/reorder")
def reorder_lessons(course_id: str, req: ReorderRequest, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    for index, lesson_id in enumerate(req.lesson_ids):
        lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id, models.Lesson.course_id == course_id).first()
        if lesson:
            lesson.order_index = index + 1
    db.commit()
    return {"message": "Reordered successfully"}
