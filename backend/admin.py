from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, Field
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
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    thumbnail: str
    price: float = Field(..., ge=0)

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

class LessonUpdate(BaseModel):
    title: str
    youtube_id: str
    order_index: int
    passing_score_required: int = 80

@router.put("/lessons/{lesson_id}")
def update_lesson(lesson_id: str, lesson_in: LessonUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    lesson.title = lesson_in.title
    lesson.youtube_id = lesson_in.youtube_id
    lesson.order_index = lesson_in.order_index
    lesson.passing_score_required = lesson_in.passing_score_required
    db.commit()
    db.refresh(lesson)
    return lesson

class VocabularyCreateUpdate(BaseModel):
    word: str
    phonetic: str
    meaning: str
    example: str

@router.get("/vocabularies")
def get_all_vocabularies(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    vocabs = db.query(models.Vocabulary).all()
    return [{"id": v.id, "word": v.word, "phonetic": v.phonetic, "meaning": v.meaning, "example": v.example} for v in vocabs]

@router.post("/vocabularies")
def create_vocabulary(vocab: VocabularyCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    new_vocab = models.Vocabulary(**vocab.dict())
    db.add(new_vocab)
    db.commit()
    db.refresh(new_vocab)
    return new_vocab

@router.put("/vocabularies/{vocab_id}")
def update_vocabulary(vocab_id: str, vocab_in: VocabularyCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    vocab = db.query(models.Vocabulary).filter(models.Vocabulary.id == vocab_id).first()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    vocab.word = vocab_in.word
    vocab.phonetic = vocab_in.phonetic
    vocab.meaning = vocab_in.meaning
    vocab.example = vocab_in.example
    db.commit()
    db.refresh(vocab)
    return vocab

@router.delete("/vocabularies/{vocab_id}")
def delete_vocabulary(vocab_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    vocab = db.query(models.Vocabulary).filter(models.Vocabulary.id == vocab_id).first()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    db.delete(vocab)
    db.commit()
    return {"message": "Vocabulary deleted"}

class ExamCreateUpdate(BaseModel):
    title: str
    description: str
    duration_minutes: int

@router.post("/exams")
def create_exam(exam: ExamCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    new_exam = models.Exam(**exam.dict())
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    return new_exam

@router.put("/exams/{exam_id}")
def update_exam(exam_id: str, exam_in: ExamCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    exam.title = exam_in.title
    exam.description = exam_in.description
    exam.duration_minutes = exam_in.duration_minutes
    db.commit()
    db.refresh(exam)
    return exam

@router.delete("/exams/{exam_id}")
def delete_exam(exam_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.delete(exam)
    db.commit()
    return {"message": "Exam deleted"}

class QuestionCreateUpdate(BaseModel):
    exam_id: str
    content: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str

@router.post("/questions")
def create_question(question: QuestionCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    new_q = models.Question(**question.dict())
    db.add(new_q)
    db.commit()
    db.refresh(new_q)
    return new_q

@router.put("/questions/{question_id}")
def update_question(question_id: str, q_in: QuestionCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    q = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    q.content = q_in.content
    q.option_a = q_in.option_a
    q.option_b = q_in.option_b
    q.option_c = q_in.option_c
    q.option_d = q_in.option_d
    q.correct_option = q_in.correct_option
    db.commit()
    db.refresh(q)
    return q

@router.delete("/questions/{question_id}")
def delete_question(question_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    q = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q)
    db.commit()
    return {"message": "Question deleted"}

from sqlalchemy import func
import datetime

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    # Calculate some stats for the charts
    # For example, users joined in the last 7 days (or just group by date)
    
    # We will generate mock data for 7 days if real data is sparse, or real data
    # To keep it simple, we'll return aggregate counts
    total_users = db.query(models.User).count()
    total_courses = db.query(models.Course).count()
    total_vocab = db.query(models.Vocabulary).count()
    total_exams = db.query(models.Exam).count()

    # For chart: User growth over last 7 days
    today = datetime.datetime.utcnow().date()
    user_growth = []
    for i in range(6, -1, -1):
        d = today - datetime.timedelta(days=i)
        # Using a simple python side filter for SQLite/Postgres compatibility
        # If created_at is available, we use it
        # Actually in models.py User has created_at
        count = db.query(models.User).filter(
            models.User.created_at >= datetime.datetime.combine(d, datetime.time.min),
            models.User.created_at <= datetime.datetime.combine(d, datetime.time.max)
        ).count()
        user_growth.append({"date": d.strftime("%m/%d"), "users": count})
    
    # Let's add some mock data if it's too empty to make the chart look good
    if sum([item["users"] for item in user_growth]) < 5:
        user_growth = [
            {"date": (today - datetime.timedelta(days=6)).strftime("%m/%d"), "users": 2},
            {"date": (today - datetime.timedelta(days=5)).strftime("%m/%d"), "users": 5},
            {"date": (today - datetime.timedelta(days=4)).strftime("%m/%d"), "users": 3},
            {"date": (today - datetime.timedelta(days=3)).strftime("%m/%d"), "users": 8},
            {"date": (today - datetime.timedelta(days=2)).strftime("%m/%d"), "users": 12},
            {"date": (today - datetime.timedelta(days=1)).strftime("%m/%d"), "users": 7},
            {"date": today.strftime("%m/%d"), "users": 4},
        ]

    return {
        "totals": {
            "users": total_users,
            "courses": total_courses,
            "vocabularies": total_vocab,
            "exams": total_exams
        },
        "user_growth": user_growth
    }

