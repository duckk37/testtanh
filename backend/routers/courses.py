from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

import models
from database import get_db
from auth import get_current_user
from utils import check_and_update_streak, update_quest_progress

router = APIRouter(tags=["Courses & Exams"])

class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    thumbnail: str
    price: float

class LessonResponse(BaseModel):
    id: str
    course_id: str
    title: str
    youtube_id: str
    exam_id: Optional[str] = None
    passing_score_required: int = 80
    order_index: int
    is_unlocked: bool = False
    is_completed: bool = False

class ExamResponse(BaseModel):
    id: str
    title: str
    description: str
    duration_minutes: int

class QuestionResponse(BaseModel):
    id: str
    exam_id: str
    content: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str

class SubmitTestRequest(BaseModel):
    answers: dict # {question_id: selected_option}

@router.get("/courses", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@router.get("/courses/{course_id}/lessons", response_model=List[LessonResponse])
def get_lessons(course_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    lessons = db.query(models.Lesson).filter(models.Lesson.course_id == course_id).order_by(models.Lesson.order_index).all()
    
    progress_records = db.query(models.UserLessonProgress).filter(
        models.UserLessonProgress.user_id == current_user.id
    ).all()
    completed_lesson_ids = {p.lesson_id for p in progress_records if p.is_completed}
    
    result = []
    is_previous_completed = True 
    
    is_admin = getattr(current_user, 'role', '') == 'admin'
    
    for idx, lesson in enumerate(lessons):
        is_completed = lesson.id in completed_lesson_ids
        is_unlocked = is_previous_completed or is_completed
        
        if is_admin:
            is_unlocked = True
            
        result.append(LessonResponse(
            id=lesson.id,
            course_id=lesson.course_id,
            title=lesson.title,
            youtube_id=lesson.youtube_id,
            exam_id=lesson.exam_id,
            order_index=lesson.order_index,
            is_completed=is_completed,
            is_unlocked=is_unlocked
        ))
        is_previous_completed = is_completed
        
    return result

@router.post("/lessons/{lesson_id}/submit-test")
def submit_lesson_test(lesson_id: str, req: SubmitTestRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson or not lesson.exam_id:
        raise HTTPException(status_code=404, detail="Lesson or exam not found")
        
    questions = db.query(models.Question).filter(models.Question.exam_id == lesson.exam_id).all()
    if not questions:
        raise HTTPException(status_code=400, detail="Đề thi chưa khả dụng (Chưa có câu hỏi).")
        
    correct_count = 0
    for q in questions:
        if req.answers.get(q.id) == q.correct_option:
            correct_count += 1
            
    score = (correct_count / len(questions)) * 100 if questions else 0
    is_passed = score >= lesson.passing_score_required
    
    progress = db.query(models.UserLessonProgress).filter(
        models.UserLessonProgress.user_id == current_user.id,
        models.UserLessonProgress.lesson_id == lesson_id
    ).first()
    
    if not progress:
        progress = models.UserLessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            is_completed=1 if is_passed else 0,
            score=int(score),
            highest_score=int(score),
            attempts=1
        )
        db.add(progress)
    else:
        if is_passed:
            progress.is_completed = 1
        progress.score = int(score)
        progress.highest_score = max(progress.highest_score, int(score))
        progress.attempts += 1
        
    # Gamification: Badges
    if is_passed:
        first_steps_badge = db.query(models.Badge).filter(models.Badge.name == "First Steps").first()
        if first_steps_badge:
            if not db.query(models.UserBadge).filter(models.UserBadge.user_id == current_user.id, models.UserBadge.badge_id == first_steps_badge.id).first():
                db.add(models.UserBadge(user_id=current_user.id, badge_id=first_steps_badge.id))
                
    if score == 100:
        perfect_badge = db.query(models.Badge).filter(models.Badge.name == "Perfect Score").first()
        if perfect_badge:
            if not db.query(models.UserBadge).filter(models.UserBadge.user_id == current_user.id, models.UserBadge.badge_id == perfect_badge.id).first():
                db.add(models.UserBadge(user_id=current_user.id, badge_id=perfect_badge.id))
                
    # Update Streak and Quests
    check_and_update_streak(current_user, db)
    if is_passed:
        update_quest_progress(current_user.id, "complete_lesson", 1, db)
    if score == 100:
        update_quest_progress(current_user.id, "perfect_score", 1, db)
        
    db.commit()
    return {
        "message": "Test submitted", 
        "score": score, 
        "is_completed": progress.is_completed == 1,
        "is_passed": is_passed,
        "highest_score": progress.highest_score,
        "attempts": progress.attempts
    }

@router.get("/exams", response_model=List[ExamResponse])
def get_exams(db: Session = Depends(get_db)):
    return db.query(models.Exam).all()

@router.get("/exams/{exam_id}", response_model=ExamResponse)
def get_exam(exam_id: str, db: Session = Depends(get_db)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.get("/exams/{exam_id}/questions", response_model=List[QuestionResponse])
def get_questions(exam_id: str, db: Session = Depends(get_db)):
    return db.query(models.Question).filter(models.Question.exam_id == exam_id).all()
