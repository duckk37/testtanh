from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from database import engine, SessionLocal
import models
from auth import get_password_hash
import admin
import migrations
from dotenv import load_dotenv
import time
from rich.console import Console
from rich.panel import Panel

console = Console()

# Load environment variables from .env file
load_dotenv()

# Routers
from routers import auth as auth_router
from routers import users as users_router
from routers import courses as courses_router
from routers import gamification as gamification_router
from routers import vocabulary as vocabulary_router
from routers import comments as comments_router
from routers import analytics as analytics_router
from routers import video as video_router
from routers import ai as ai_router
from routers import learning_path as learning_path_router
from routers import certificates as certificates_router

# Create tables
models.Base.metadata.create_all(bind=engine)

# Apply migrations
print("Applying database migrations if any...")
migrations.apply_migrations(engine)

app = FastAPI(title="English Master API")

import os
os.makedirs(os.path.join(os.path.dirname(__file__), "static", "images"), exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(admin.router)
app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(courses_router.router)
app.include_router(gamification_router.router)
app.include_router(vocabulary_router.router)
app.include_router(comments_router.router)
app.include_router(analytics_router.router)
app.include_router(video_router.router)
app.include_router(ai_router.router)
app.include_router(learning_path_router.router)
app.include_router(certificates_router.router)

# Add Gzip Compression for large responses (Video transcripts, roadmaps, etc)
app.add_middleware(GZipMiddleware, minimum_size=500)

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=600,
)

@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    
    status_color = "green" if response.status_code < 400 else "red"
    method = request.method
    path = request.url.path
    
    # Hide noisy static requests
    if not path.startswith("/static"):
        console.print(f"[bold blue]⚡ [{method}][/bold blue] [cyan]{path}[/cyan] -> [{status_color}]{response.status_code}[/{status_color}] ({process_time:.2f}ms)")
        
    return response

# Create Database Tables and Seed Mock Data
@app.on_event("startup")
def on_startup():
    console.print(Panel.fit("[bold green]🚀 EnglishMaster Server Started Successfully![/bold green]\n[cyan]Listening on http://0.0.0.0:8000[/cyan]", border_style="green"))
    console.print("[yellow]System Status:[/yellow] [green]OK[/green] | [yellow]Database:[/yellow] [green]Connected[/green]")
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
            # Trigger reload one more time
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

        # Import 48-day course and lessons from CSV
        try:
            import import_lessons
            import_lessons.import_data(db)
        except Exception as e:
            print(f"Failed to import lessons: {e}")

        # Seed automated tests from PDF
        try:
            import seed_tests
            seed_tests.seed(db)
        except Exception as e:
            print(f"Failed to seed tests: {e}")
        
    finally:
        db.close()
