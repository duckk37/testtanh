import logging
from sqlalchemy import inspect, text

logger = logging.getLogger(__name__)

def apply_migrations(engine):
    inspector = inspect(engine)
    
    with engine.begin() as conn:
        # Check users table
        if inspector.has_table('users'):
            columns = [col['name'] for col in inspector.get_columns('users')]
            if 'streak_count' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN streak_count INTEGER DEFAULT 0"))
                logger.info("Added streak_count to users")
            if 'last_activity_date' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN last_activity_date TIMESTAMP"))
                logger.info("Added last_activity_date to users")
            if 'coins' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 0"))
                logger.info("Added coins to users")
            if 'streak_shields' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN streak_shields INTEGER DEFAULT 0"))
                logger.info("Added streak_shields to users")
            if 'active_theme' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN active_theme VARCHAR DEFAULT 'default'"))
                logger.info("Added active_theme to users")
            if 'unlocked_themes' not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN unlocked_themes VARCHAR DEFAULT 'default'"))
                logger.info("Added unlocked_themes to users")
                
        # Check lessons table
        if inspector.has_table('lessons'):
            columns = [col['name'] for col in inspector.get_columns('lessons')]
            if 'subtitles' not in columns:
                conn.execute(text("ALTER TABLE lessons ADD COLUMN subtitles VARCHAR"))
                logger.info("Added subtitles to lessons")
            if 'exam_id' not in columns:
                conn.execute(text("ALTER TABLE lessons ADD COLUMN exam_id VARCHAR"))
                logger.info("Added exam_id to lessons")
            if 'passing_score_required' not in columns:
                conn.execute(text("ALTER TABLE lessons ADD COLUMN passing_score_required INTEGER DEFAULT 80"))
                logger.info("Added passing_score_required to lessons")
            if 'content' not in columns:
                conn.execute(text("ALTER TABLE lessons ADD COLUMN content VARCHAR"))
                logger.info("Added content to lessons")

        # Check questions table
        if inspector.has_table('questions'):
            columns = [col['name'] for col in inspector.get_columns('questions')]
            if 'image_url' not in columns:
                conn.execute(text("ALTER TABLE questions ADD COLUMN image_url VARCHAR"))
                logger.info("Added image_url to questions")
            if 'question_type' not in columns:
                conn.execute(text("ALTER TABLE questions ADD COLUMN question_type VARCHAR DEFAULT 'multiple_choice'"))
                logger.info("Added question_type to questions")
