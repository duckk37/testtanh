from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

# --- Auth & Users ---
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: str
    password: str = Field(..., min_length=6)

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    coins: int
    streak_count: int
    active_theme: str
    unlocked_themes: str
    last_activity_date: Optional[datetime] = None
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    active_theme: Optional[str] = None
    password: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Admin ---
class ReorderRequest(BaseModel):
    lesson_ids: List[str]

class UserRoleUpdate(BaseModel):
    role: str

class UserCoinsUpdate(BaseModel):
    coins: int

# --- Course & Lesson ---
class CourseBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    thumbnail: str
    price: float = Field(..., ge=0)

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    id: str
    is_purchased: Optional[bool] = False
    class Config:
        from_attributes = True

class LessonCreate(BaseModel):
    course_id: str
    title: str
    youtube_id: Optional[str] = None
    order_index: int
    passing_score_required: int = 80
    exam_id: Optional[str] = None
    content: Optional[str] = None

class LessonUpdate(BaseModel):
    title: str
    youtube_id: Optional[str] = None
    order_index: int
    passing_score_required: int = 80
    exam_id: Optional[str] = None
    content: Optional[str] = None

class LessonResponse(BaseModel):
    id: str
    course_id: str
    title: str
    youtube_id: Optional[str] = None
    exam_id: Optional[str] = None
    passing_score_required: int = 80
    order_index: int
    is_unlocked: bool = False
    is_completed: bool = False
    content: Optional[str] = None
    subtitles: Optional[str] = None
    class Config:
        from_attributes = True

# --- Vocabulary ---
class VocabularyCreateUpdate(BaseModel):
    word: str
    phonetic: str
    meaning: str
    example: str

# --- Exams & Questions ---
class ExamCreateUpdate(BaseModel):
    title: str
    description: str
    duration_minutes: int

class ExamResponse(ExamCreateUpdate):
    id: str
    class Config:
        from_attributes = True

class QuestionCreateUpdate(BaseModel):
    exam_id: str
    content: str
    option_a: str | None = None
    option_b: str | None = None
    option_c: str | None = None
    option_d: str | None = None
    correct_option: str
    image_url: str | None = None
    question_type: str = "multiple_choice"

class QuestionResponse(QuestionCreateUpdate):
    id: str
    class Config:
        from_attributes = True

class SubmitTestRequest(BaseModel):
    answers: dict # {question_id: selected_option}

# --- Comments ---
class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    content: str
    created_at: datetime
    user_id: str
    username: str
    class Config:
        from_attributes = True

# --- Analytics ---
class AdminStatsResponse(BaseModel):
    total_users: int
    total_courses: int
    total_revenue: float
    total_lessons_completed: int
