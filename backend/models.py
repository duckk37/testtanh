from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=generate_uuid)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # 'user' or 'admin'
    streak_count = Column(Integer, default=0)
    last_activity_date = Column(DateTime, nullable=True)
    
    progress = relationship("UserLessonProgress", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Video(Base):
    __tablename__ = "videos"
    id = Column(String, primary_key=True, default=generate_uuid)
    youtube_id = Column(String, unique=True, index=True)
    title = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Vocabulary(Base):
    __tablename__ = "vocabularies"
    id = Column(String, primary_key=True, default=generate_uuid)
    word = Column(String, unique=True, index=True)
    phonetic = Column(String)
    meaning = Column(String)
    example = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserProgress(Base):
    __tablename__ = "user_progress"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    vocabulary_id = Column(String, ForeignKey("vocabularies.id", ondelete="CASCADE"))
    repetition = Column(Integer, default=0)
    interval = Column(Integer, default=0)
    ease_factor = Column(Float, default=2.5)
    next_review_date = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships (Optional but helpful)
    user = relationship("User")
    vocabulary = relationship("Vocabulary")

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(String)
    thumbnail = Column(String)
    price = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    lessons = relationship("Lesson", back_populates="course")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(String, primary_key=True, default=generate_uuid)
    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"))
    exam_id = Column(String, ForeignKey("exams.id", ondelete="SET NULL"), nullable=True)
    passing_score_required = Column(Integer, default=80)
    title = Column(String)
    youtube_id = Column(String)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    course = relationship("Course", back_populates="lessons")

class Exam(Base):
    __tablename__ = "exams"
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(String)
    duration_minutes = Column(Integer, default=60)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    questions = relationship("Question", back_populates="exam")

class Question(Base):
    __tablename__ = "questions"
    id = Column(String, primary_key=True, default=generate_uuid)
    exam_id = Column(String, ForeignKey("exams.id", ondelete="CASCADE"))
    content = Column(String)
    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)
    correct_option = Column(String) # A, B, C, or D
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    exam = relationship("Exam", back_populates="questions")

class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    lesson_id = Column(String, ForeignKey("lessons.id", ondelete="CASCADE"))
    is_completed = Column(Integer, default=0) # 0 = false, 1 = true
    score = Column(Integer, default=0) # Current/Last score
    highest_score = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson")

class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    description = Column(String)
    icon = Column(String) # Emoji or URL

class UserBadge(Base):
    __tablename__ = "user_badges"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"))
    badge_id = Column(String, ForeignKey("badges.id", ondelete="CASCADE"))
    awarded_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")
