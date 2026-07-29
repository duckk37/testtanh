from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db
from routers.admin.dependencies import require_teacher

router = APIRouter(prefix="/admin", tags=["admin_courses"])

@router.post("/courses")
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_teacher)):
    new_course = models.Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.delete("/courses/{course_id}")
def delete_course(course_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_teacher)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}

@router.put("/courses/{course_id}")
def update_course(course_id: str, course_in: schemas.CourseCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_teacher)):
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

@router.post("/lessons")
def create_lesson(lesson: schemas.LessonCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_teacher)):
    new_lesson = models.Lesson(**lesson.dict())
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson

@router.delete("/lessons/{lesson_id}")
def delete_lesson(lesson_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_teacher)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted"}

@router.put("/courses/{course_id}/lessons/reorder")
def reorder_lessons(course_id: str, req: schemas.ReorderRequest, db: Session = Depends(get_db), admin: models.User = Depends(require_teacher)):
    for index, lesson_id in enumerate(req.lesson_ids):
        lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id, models.Lesson.course_id == course_id).first()
        if lesson:
            lesson.order_index = index + 1
    db.commit()
    return {"message": "Reordered successfully"}

@router.put("/lessons/{lesson_id}")
def update_lesson(lesson_id: str, lesson_in: schemas.LessonUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_teacher)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    lesson.title = lesson_in.title
    if lesson_in.youtube_id is not None:
        lesson.youtube_id = lesson_in.youtube_id
    lesson.order_index = lesson_in.order_index
    lesson.passing_score_required = lesson_in.passing_score_required
    if lesson_in.exam_id == "":
        lesson.exam_id = None
    elif lesson_in.exam_id is not None:
        lesson.exam_id = lesson_in.exam_id
    db.commit()
    db.refresh(lesson)
    return lesson
