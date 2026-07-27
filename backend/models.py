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
    coins = Column(Integer, default=0)
    streak_shields = Column(Integer, default=0)
    active_theme = Column(String, default="default")
    unlocked_themes = Column(String, default="default") # JSON string or comma-separated
    
    progress = relationship("UserLessonProgress", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
    comments = relationship("Comment", back_populates="user")
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
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    vocabulary_id = Column(String, ForeignKey("vocabularies.id", ondelete="CASCADE"), index=True)
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
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(String, primary_key=True, default=generate_uuid)
    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), index=True)
    exam_id = Column(String, ForeignKey("exams.id", ondelete="SET NULL"), nullable=True, index=True)
    passing_score_required = Column(Integer, default=80)
    title = Column(String)
    youtube_id = Column(String)
    subtitles = Column(String, nullable=True) # JSON array of {time: float, text: str}
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    course = relationship("Course", back_populates="lessons")
    comments = relationship("Comment", back_populates="lesson")

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
    exam_id = Column(String, ForeignKey("exams.id", ondelete="CASCADE"), index=True)
    content = Column(String)
    option_a = Column(String)
    option_b = Column(String)
    option_c = Column(String)
    option_d = Column(String)
    correct_option = Column(String) # A, B, C, D, or text for fill_in_blank
    image_url = Column(String, nullable=True)
    question_type = Column(String, default="multiple_choice") # multiple_choice, fill_in_blank
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    exam = relationship("Exam", back_populates="questions")

class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    lesson_id = Column(String, ForeignKey("lessons.id", ondelete="CASCADE"), index=True)
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
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    badge_id = Column(String, ForeignKey("badges.id", ondelete="CASCADE"), index=True)
    awarded_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    lesson_id = Column(String, ForeignKey("lessons.id", ondelete="CASCADE"), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="comments")
    lesson = relationship("Lesson", back_populates="comments")

class DailyQuest(Base):
    __tablename__ = "daily_quests"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    quest_type = Column(String) # e.g., 'learn_words', 'perfect_score', 'listen_audio'
    target_value = Column(Integer)
    current_progress = Column(Integer, default=0)
    reward_coins = Column(Integer, default=10)
    date = Column(String) # YYYY-MM-DD
    is_completed = Column(Integer, default=0) # 0 or 1
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")

class LearningPath(Base):
    __tablename__ = "learning_paths"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    level = Column(String, default="Beginner")
    roadmap_json = Column(String) # Storing the 7-day roadmap as a JSON string
    current_day = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")

class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    course_id = Column(String, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True, index=True)
    amount = Column(Float, default=0.0)
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")
    course = relationship("Course")

