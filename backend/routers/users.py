from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

import models
from database import get_db
from auth import get_current_user

router = APIRouter(tags=["Users"])

@router.get("/users/me")
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

@router.get("/users/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    score_subq = db.query(
        models.UserLessonProgress.user_id,
        func.sum(models.UserLessonProgress.highest_score).label("total_score")
    ).group_by(models.UserLessonProgress.user_id).subquery()

    words_subq = db.query(
        models.UserProgress.user_id,
        func.count(models.UserProgress.id).label("words_learned")
    ).group_by(models.UserProgress.user_id).subquery()

    results = db.query(
        models.User,
        func.coalesce(score_subq.c.total_score, 0).label("total_score"),
        func.coalesce(words_subq.c.words_learned, 0).label("words_learned")
    ).outerjoin(score_subq, models.User.id == score_subq.c.user_id) \
     .outerjoin(words_subq, models.User.id == words_subq.c.user_id) \
     .order_by(func.coalesce(score_subq.c.total_score, 0).desc(), models.User.streak_count.desc()) \
     .limit(10).all()

    leaderboard = []
    for user, score, words in results:
        leaderboard.append({
            "id": user.id,
            "username": user.username,
            "streak_count": user.streak_count,
            "total_score": int(score),
            "words_learned": int(words)
        })
        
    return leaderboard[:10]

@router.get("/users/me/stats")
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

@router.get("/users/me/courses")
def get_user_courses(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    courses = db.query(models.Course).all()
    result = []
    
    for course in courses:
        total_lessons = db.query(models.Lesson).filter(models.Lesson.course_id == course.id).count()
        if total_lessons == 0:
            continue
            
        completed_lessons = db.query(models.UserLessonProgress).join(models.Lesson).filter(
            models.UserLessonProgress.user_id == current_user.id,
            models.Lesson.course_id == course.id,
            models.UserLessonProgress.is_completed == 1
        ).count()
        
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
