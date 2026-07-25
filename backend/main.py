from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal
import models
from auth import get_password_hash
import admin
import migrations

# Routers
from routers import auth as auth_router
from routers import users as users_router
from routers import courses as courses_router
from routers import gamification as gamification_router
from routers import vocabulary as vocabulary_router
from routers import comments as comments_router

# Create tables
models.Base.metadata.create_all(bind=engine)

# Apply migrations
print("Applying database migrations if any...")
migrations.apply_migrations(engine)

app = FastAPI()

app.include_router(admin.router)
app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(courses_router.router)
app.include_router(gamification_router.router)
app.include_router(vocabulary_router.router)
app.include_router(comments_router.router)

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=600,
)

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
