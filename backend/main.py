from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional

import models
from database import engine, get_db, SessionLocal
from fastapi.security import OAuth2PasswordRequestForm
from auth import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
import admin

import os

# Create tables
models.Base.metadata.create_all(bind=engine)

# Apply migrations
import migrations
print("Applying database migrations if any...")
migrations.apply_migrations(engine)

# Download TextBlob corpora on startup
print("Downloading TextBlob corpora...")
os.system("python -m textblob.download_corpora")

app = FastAPI()
app.include_router(admin.router)

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=600,
)

def calculate_sm2(quality: int, repetition: int, ease_factor: float, interval: int) -> dict:
    if quality >= 3:
        if repetition == 0:
            interval = 1
        elif repetition == 1:
            interval = 6
        else:
            interval = int(round(interval * ease_factor))
        repetition += 1
    else:
        repetition = 0
        interval = 1
        
    ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    
    if ease_factor < 1.3:
        ease_factor = 1.3
        
    return {
        "repetition": repetition,
        "ease_factor": ease_factor,
        "interval": interval,
        "next_review_date": datetime.utcnow() + timedelta(days=interval)
    }

class ProgressResponse(BaseModel):
    user_id: str
    vocab_id: str
    ease_factor: float
    interval: int
    repetitions: int
    next_review_date: datetime

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

# Create Database Tables and Seed Mock Data
@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=engine)
    
    # Seed Mock Data
    db = SessionLocal()
    try:
        # Check Admin User
        if not db.query(models.User).filter(models.User.email == "admin@englishmaster.com").first():
            hashed_pwd = get_password_hash("admin")
            admin_user = models.User(username="Admin", email="admin@englishmaster.com", hashed_password=hashed_pwd, role="admin", streak_count=1)
            db.add(admin_user)
            db.commit()

        # Check Badges
        if not db.query(models.Badge).first():
            db.add(models.Badge(name="First Steps", description="Hoàn thành bài học đầu tiên", icon="🌟"))
            db.add(models.Badge(name="Perfect Score", description="Đạt 100% điểm bài kiểm tra", icon="🎯"))
            db.add(models.Badge(name="3-Day Streak", description="Học liên tục 3 ngày", icon="🔥"))
            db.commit()
            
        # Check if course exists
        if not db.query(models.Course).first():
            course1 = models.Course(
                title="Pro 3M - Ôn Thi THPT Quốc Gia",
                description="Khóa học toàn diện bao phủ toàn bộ kiến thức Tiếng Anh THPT.",
                thumbnail="https://tienganhcomaiphuong.vn/wp-content/uploads/2021/08/pro3m.jpg",
                price=1500000
            )
            course2 = models.Course(
                title="Khóa Giải Đề Chuyên Sâu",
                description="Khóa học tập trung giải các đề thi thử mới nhất.",
                thumbnail="https://tienganhcomaiphuong.vn/wp-content/uploads/2021/08/giai-de.jpg",
                price=900000
            )
            db.add(course1)
            db.add(course2)
            db.commit()
            
            # Add Lessons for Course 1
            lesson1 = models.Lesson(course_id=course1.id, title="Bài 1: Thì hiện tại đơn", youtube_id="dQw4w9WgXcQ", order_index=1)
            lesson2 = models.Lesson(course_id=course1.id, title="Bài 2: Câu bị động", youtube_id="jNQXAC9IVRw", order_index=2)
            db.add(lesson1)
            db.add(lesson2)
            db.commit()

        # Check if exam exists
        if not db.query(models.Exam).first():
            exam1 = models.Exam(
                title="Đề Thi Thử THPT Quốc Gia 2024 - Đề 1",
                description="Đề thi thử bám sát cấu trúc đề minh họa Bộ GD&ĐT.",
                duration_minutes=60
            )
            exam2 = models.Exam(
                title="Bài kiểm tra Bài 1",
                description="Mini-test sau bài học",
                duration_minutes=15
            )
            db.add(exam1)
            db.add(exam2)
            db.commit()
            
            # Gán exam2 cho lesson1
            l1 = db.query(models.Lesson).filter(models.Lesson.order_index == 1).first()
            if l1:
                l1.exam_id = exam2.id
                db.commit()
            
            # Add Questions
            q1 = models.Question(
                exam_id=exam1.id,
                content="She ________ a letter to her friend yesterday.",
                option_a="writes",
                option_b="wrote",
                option_c="has written",
                option_d="was writing",
                correct_option="B"
            )
            q2 = models.Question(
                exam_id=exam1.id,
                content="By the time we arrive, the movie ________.",
                option_a="will start",
                option_b="started",
                option_c="will have started",
                option_d="has started",
                correct_option="C"
            )
            db.add(q1)
            db.add(q2)
            db.commit()
    finally:
        db.close()

# API Endpoints
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user.password)
    new_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_pwd,
        streak_count=1,
        last_activity_date=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form_data.username is actually used for email or username depending on frontend, we'll assume it's email here
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    # Update Streak
    if user.last_activity_date:
        today = datetime.utcnow().date()
        last_date = user.last_activity_date.date()
        if last_date == today - timedelta(days=1):
            user.streak_count += 1
        elif last_date < today - timedelta(days=1):
            user.streak_count = 1
    else:
        user.streak_count = 1
    user.last_activity_date = datetime.utcnow()
    
    # Check 3-Day Streak badge
    if user.streak_count >= 3:
        streak_badge = db.query(models.Badge).filter(models.Badge.name == "3-Day Streak").first()
        if streak_badge:
            has_badge = db.query(models.UserBadge).filter(models.UserBadge.user_id == user.id, models.UserBadge.badge_id == streak_badge.id).first()
            if not has_badge:
                db.add(models.UserBadge(user_id=user.id, badge_id=streak_badge.id))
    
    db.commit()
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
def read_users_me(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_badges = db.query(models.UserBadge).filter(models.UserBadge.user_id == current_user.id).all()
    badge_list = [{"id": ub.badge.id, "name": ub.badge.name, "description": ub.badge.description, "icon": ub.badge.icon} for ub in user_badges]
    return {
        "username": current_user.username, 
        "email": current_user.email, 
        "id": current_user.id,
        "role": current_user.role,
        "streak_count": current_user.streak_count,
        "badges": badge_list
    }

@app.get("/users/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    leaderboard = []
    
    for user in users:
        # Calculate total score from UserLessonProgress
        progress_records = db.query(models.UserLessonProgress).filter(
            models.UserLessonProgress.user_id == user.id
        ).all()
        total_score = sum([p.highest_score for p in progress_records])
        
        # Calculate words learned for tie-breakers or extra stats
        words_learned = db.query(models.UserProgress).filter(
            models.UserProgress.user_id == user.id
        ).count()
        
        leaderboard.append({
            "id": user.id,
            "username": user.username,
            "streak_count": user.streak_count,
            "total_score": total_score,
            "words_learned": words_learned
        })
        
    # Sort by total_score descending, then streak_count
    leaderboard.sort(key=lambda x: (x["total_score"], x["streak_count"]), reverse=True)
    
    return leaderboard[:10] # Return top 10

@app.get("/users/me/stats")
def get_user_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Total words learned
    progress_records = db.query(models.UserProgress).filter(models.UserProgress.user_id == current_user.id).all()
    total_words = len(progress_records)
    
    # Average exam score
    lesson_progress = db.query(models.UserLessonProgress).filter(models.UserLessonProgress.user_id == current_user.id, models.UserLessonProgress.highest_score > 0).all()
    avg_score = sum([lp.highest_score for lp in lesson_progress]) / len(lesson_progress) if lesson_progress else 0
    
    # Chart data (last 7 days vocabulary progress)
    today = datetime.utcnow().date()
    chart_data = []
    
    for i in range(6, -1, -1):
        target_date = today - timedelta(days=i)
        # Count words learned on this specific date
        count = sum(1 for p in progress_records if p.created_at.date() == target_date)
        chart_data.append({
            "name": target_date.strftime("%d/%m"),
            "words": count
        })
        
    return {
        "total_words": total_words,
        "avg_score": round(avg_score, 1),
        "streak_count": current_user.streak_count,
        "coins": current_user.coins,
        "streak_shields": current_user.streak_shields,
        "active_theme": current_user.active_theme,
        "unlocked_themes": current_user.unlocked_themes.split(',') if current_user.unlocked_themes else [],
        "chart_data": chart_data
    }

@app.get("/users/me/courses")
def get_user_courses(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    result = []
    
    for course in courses:
        total_lessons = db.query(models.Lesson).filter(models.Lesson.course_id == course.id).count()
        if total_lessons == 0:
            continue
            
        # Get lessons the user has completed in this course
        completed_lessons = db.query(models.UserLessonProgress).join(models.Lesson).filter(
            models.UserLessonProgress.user_id == current_user.id,
            models.Lesson.course_id == course.id,
            models.UserLessonProgress.is_completed == 1
        ).count()
        
        # Only include courses the user has interacted with (or you can include all, let's include courses with at least 1 lesson completed or attempted)
        attempted_lessons = db.query(models.UserLessonProgress).join(models.Lesson).filter(
            models.UserLessonProgress.user_id == current_user.id,
            models.Lesson.course_id == course.id
        ).count()
        
        if attempted_lessons > 0:
            result.append({
                "id": course.id,
                "title": course.title,
                "thumbnail": course.thumbnail,
                "total_lessons": total_lessons,
                "completed_lessons": completed_lessons,
                "progress_percentage": round((completed_lessons / total_lessons) * 100)
            })
            
    return result

@app.get("/courses", response_model=List[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.Course).all()

@app.get("/courses/{course_id}/lessons", response_model=List[LessonResponse])
def get_lessons(course_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    lessons = db.query(models.Lesson).filter(models.Lesson.course_id == course_id).order_by(models.Lesson.order_index).all()
    
    # Calculate progress for the current user
    progress_records = db.query(models.UserLessonProgress).filter(
        models.UserLessonProgress.user_id == current_user.id
    ).all()
    completed_lesson_ids = {p.lesson_id for p in progress_records if p.is_completed}
    
    result = []
    is_previous_completed = True # First lesson is always unlocked
    
    for idx, lesson in enumerate(lessons):
        is_completed = lesson.id in completed_lesson_ids
        is_unlocked = is_previous_completed or is_completed
        
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

class SubmitTestRequest(BaseModel):
    answers: dict # {question_id: selected_option}

@app.post("/lessons/{lesson_id}/submit-test")
def submit_lesson_test(lesson_id: str, req: SubmitTestRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson or not lesson.exam_id:
        raise HTTPException(status_code=404, detail="Lesson or exam not found")
        
    questions = db.query(models.Question).filter(models.Question.exam_id == lesson.exam_id).all()
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

@app.get("/exams", response_model=List[ExamResponse])
def get_exams(db: Session = Depends(get_db)):
    return db.query(models.Exam).all()

@app.get("/exams/{exam_id}", response_model=ExamResponse)
def get_exam(exam_id: str, db: Session = Depends(get_db)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@app.get("/exams/{exam_id}/questions", response_model=List[QuestionResponse])
def get_questions(exam_id: str, db: Session = Depends(get_db)):
    return db.query(models.Question).filter(models.Question.exam_id == exam_id).all()

# ==========================================
# VOCABULARY & SM-2 ALGORITHM
# ==========================================
class VocabularyCreate(BaseModel):
    word: str
    phonetic: str
    meaning: str
    example: str

@app.post("/vocabularies")
def save_vocabulary(vocab: VocabularyCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    word_obj = db.query(models.Vocabulary).filter(models.Vocabulary.word == vocab.word).first()
    if not word_obj:
        word_obj = models.Vocabulary(word=vocab.word, phonetic=vocab.phonetic, meaning=vocab.meaning, example=vocab.example)
        db.add(word_obj)
        db.commit()
        db.refresh(word_obj)
        
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.vocabulary_id == word_obj.id
    ).first()
    
    if not progress:
        progress = models.UserProgress(user_id=current_user.id, vocabulary_id=word_obj.id)
        db.add(progress)
        db.commit()
        
    return {"message": "Saved successfully"}

@app.get("/vocabularies/review")
def get_due_vocabularies(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    today = datetime.utcnow()
    progress_list = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.next_review_date <= today
    ).all()
    
    return [
        {
            "id": p.vocabulary.id,
            "word": p.vocabulary.word,
            "phonetic": p.vocabulary.phonetic,
            "meaning": p.vocabulary.meaning,
            "example": p.vocabulary.example,
            "repetition": p.repetition,
            "interval": p.interval,
            "ease_factor": p.ease_factor
        }
        for p in progress_list
    ]

class ReviewSubmit(BaseModel):
    quality: int # 1 to 5 (SM-2 standard)

@app.post("/vocabularies/{id}/review")
def submit_review(id: str, req: ReviewSubmit, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.vocabulary_id == id
    ).first()
    if not progress:
        raise HTTPException(status_code=404, detail="Vocabulary not found in user's notebook")
        
    # SM-2 Algorithm
    q = req.quality
    if q >= 3:
        if progress.repetition == 0:
            progress.interval = 1
        elif progress.repetition == 1:
            progress.interval = 6
        else:
            progress.interval = int(round(progress.interval * progress.ease_factor))
        progress.repetition += 1
    else:
        progress.repetition = 0
        progress.interval = 1
        
    progress.ease_factor = progress.ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if progress.ease_factor < 1.3:
        progress.ease_factor = 1.3
        
    progress.next_review_date = datetime.utcnow() + timedelta(days=progress.interval)
    
    # Update Streak and Quests
    check_and_update_streak(current_user, db)
    update_quest_progress(current_user.id, "learn_words", 1, db)
    
    db.commit()
    return {"message": "Reviewed successfully", "next_review_date": progress.next_review_date}

# ==========================================
# COMMENTS API
# ==========================================
class CommentCreate(BaseModel):
    content: str

@app.get("/lessons/{lesson_id}/comments")
def get_comments(lesson_id: str, db: Session = Depends(get_db)):
    comments = db.query(models.Comment).options(joinedload(models.Comment.user)).filter(models.Comment.lesson_id == lesson_id).order_by(models.Comment.created_at.desc()).all()
    return [{"id": c.id, "content": c.content, "created_at": c.created_at, "username": c.user.username, "role": c.user.role} for c in comments]

@app.post("/lessons/{lesson_id}/comments")
def post_comment(lesson_id: str, req: CommentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_comment = models.Comment(lesson_id=lesson_id, user_id=current_user.id, content=req.content)
    db.add(new_comment)
    db.commit()
    return {"message": "Comment posted"}

class ReviewRequest(BaseModel):
    user_id: str
    vocabulary_id: str
    quality: int

class ReviewResponse(BaseModel):
    message: str
    next_review_date: datetime



class AddWordRequest(BaseModel):
    word: str
    phonetic: str = None
    meaning: str = None
    example: str = None
    user_id: str = None # To auto-add to user_progress

@app.post("/api/v1/vocabulary", response_model=dict)
def add_vocabulary(req: AddWordRequest, db: Session = Depends(get_db)):
    # Check if word exists
    vocab = db.query(models.Vocabulary).filter(models.Vocabulary.word == req.word).first()
    if not vocab:
        vocab = models.Vocabulary(word=req.word, phonetic=req.phonetic, meaning=req.meaning, example=req.example)
        db.add(vocab)
        db.commit()
        db.refresh(vocab)
    
    # If user_id provided, link to user_progress if not exist
    if req.user_id:
        progress = db.query(models.UserProgress).filter(
            models.UserProgress.user_id == req.user_id,
            models.UserProgress.vocabulary_id == vocab.id
        ).first()
        if not progress:
            progress = models.UserProgress(user_id=req.user_id, vocabulary_id=vocab.id)
            db.add(progress)
            db.commit()
            
    return {"message": "Word added successfully", "vocabulary_id": vocab.id}

@app.post("/api/v1/progress/review", response_model=ReviewResponse)
def review_vocabulary(request: ReviewRequest, db: Session = Depends(get_db)):
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == request.user_id,
        models.UserProgress.vocabulary_id == request.vocabulary_id
    ).first()
    
    if not progress:
        # Create one if not exists (mock user)
        progress = models.UserProgress(user_id=request.user_id, vocabulary_id=request.vocabulary_id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    new_stats = calculate_sm2(
        quality=request.quality,
        repetition=progress.repetition,
        ease_factor=progress.ease_factor,
        interval=progress.interval
    )
    
    progress.repetition = new_stats["repetition"]
    progress.interval = new_stats["interval"]
    progress.ease_factor = new_stats["ease_factor"]
    progress.next_review_date = new_stats["next_review_date"]
    
    db.commit()
    
    return ReviewResponse(
        message="Cập nhật tiến độ ôn tập thành công!",
        next_review_date=new_stats["next_review_date"]
    )

# ==========================================
# GAMIFICATION & QUESTS ROUTES
# ==========================================
import random

def check_and_update_streak(user: models.User, db: Session):
    now = datetime.datetime.utcnow()
    
    if not user.last_activity_date:
        user.streak_count = 1
        user.last_activity_date = now
        db.commit()
        return

    # Calculate days difference
    last_date = user.last_activity_date.date()
    today = now.date()
    delta_days = (today - last_date).days

    if delta_days == 1:
        # Consecutive day
        user.streak_count += 1
        user.last_activity_date = now
    elif delta_days > 1:
        # Streak broken, check shields
        if user.streak_shields > 0:
            user.streak_shields -= 1
            # Keep streak, just update date
            user.last_activity_date = now
        else:
            user.streak_count = 1
            user.last_activity_date = now
    elif delta_days == 0:
        # Already updated today
        user.last_activity_date = now
        
    db.commit()

@app.get("/users/me/quests")
def get_daily_quests(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    today_str = datetime.datetime.utcnow().date().isoformat()
    
    quests = db.query(models.DailyQuest).filter(
        models.DailyQuest.user_id == current_user.id,
        models.DailyQuest.date == today_str
    ).all()
    
    if not quests:
        # Generate new quests for today
        quest_templates = [
            {"type": "learn_words", "target": 10, "reward": 20},
            {"type": "perfect_score", "target": 1, "reward": 50},
            {"type": "complete_lesson", "target": 1, "reward": 30}
        ]
        
        for q in quest_templates:
            new_q = models.DailyQuest(
                user_id=current_user.id,
                quest_type=q["type"],
                target_value=q["target"],
                reward_coins=q["reward"],
                date=today_str
            )
            db.add(new_q)
            quests.append(new_q)
        db.commit()
        
    return quests

def update_quest_progress(user_id: str, quest_type: str, progress_amount: int, db: Session):
    today_str = datetime.datetime.utcnow().date().isoformat()
    quest = db.query(models.DailyQuest).filter(
        models.DailyQuest.user_id == user_id,
        models.DailyQuest.date == today_str,
        models.DailyQuest.quest_type == quest_type,
        models.DailyQuest.is_completed == 0
    ).first()
    
    if quest:
        quest.current_progress += progress_amount
        if quest.current_progress >= quest.target_value:
            quest.current_progress = quest.target_value
            quest.is_completed = 1
            
            # Reward user
            user = db.query(models.User).filter(models.User.id == user_id).first()
            if user:
                user.coins = (user.coins or 0) + quest.reward_coins
                
        db.commit()

@app.get("/store/items")
def get_store_items():
    return [
        {"id": "shield_1", "name": "Khiên bảo vệ Streak", "description": "Bảo vệ chuỗi học của bạn không bị mất nếu lỡ quên 1 ngày", "price": 100, "type": "shield"},
        {"id": "theme_dark", "name": "Giao diện Dark Mode", "description": "Giao diện tối ngầu đét", "price": 200, "type": "theme"},
        {"id": "theme_neon", "name": "Giao diện Cyberpunk Neon", "description": "Giao diện Neon nổi bật", "price": 500, "type": "theme"},
    ]

@app.post("/store/buy/{item_id}")
def buy_item(item_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    items = get_store_items()
    item = next((i for i in items if i["id"] == item_id), None)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if (current_user.coins or 0) < item["price"]:
        raise HTTPException(status_code=400, detail="Not enough coins")
        
    if item["type"] == "shield":
        current_user.streak_shields = (current_user.streak_shields or 0) + 1
    elif item["type"] == "theme":
        unlocked = current_user.unlocked_themes.split(',') if current_user.unlocked_themes else []
        if item_id in unlocked:
            raise HTTPException(status_code=400, detail="Already owned this theme")
        unlocked.append(item_id)
        current_user.unlocked_themes = ','.join(unlocked)
        current_user.active_theme = item_id
        
    current_user.coins -= item["price"]
    db.commit()
    
    return {"message": "Purchase successful", "coins": current_user.coins}

# ==========================================
# WRITING PRACTICE API
# ==========================================
from textblob import TextBlob
from pydantic import BaseModel
from typing import List

class WritingRequest(BaseModel):
    text: str

@app.post("/api/check-writing")
def check_writing(req: WritingRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    blob = TextBlob(req.text)
    
    # Simple spell check
    corrected_text = str(blob.correct())
    
    # Find mistakes by comparing words
    original_words = blob.words
    corrected_words = TextBlob(corrected_text).words
    
    mistakes = []
    for i in range(min(len(original_words), len(corrected_words))):
        if original_words[i].lower() != corrected_words[i].lower():
            mistakes.append({
                "original": str(original_words[i]),
                "suggestion": str(corrected_words[i])
            })
            
    # Word count and lexical diversity (unique words / total words)
    word_count = len(original_words)
    unique_words = len(set(word.lower() for word in original_words))
    diversity = round((unique_words / word_count * 100), 1) if word_count > 0 else 0
    
    # Gamification
    if word_count >= 50 and len(mistakes) == 0:
        update_quest_progress(current_user.id, "perfect_score", 1, db)
    if word_count > 0:
        check_and_update_streak(current_user, db)
        
    return {
        "corrected_text": corrected_text,
        "mistakes": mistakes,
        "stats": {
            "word_count": word_count,
            "lexical_diversity": diversity,
            "mistake_count": len(mistakes)
        }
    }
