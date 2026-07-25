from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

import models
from database import get_db
from auth import get_current_user

router = APIRouter(tags=["Analytics"])

@router.get("/analytics/overview")
def get_analytics_overview(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Total vocabularies the user is learning
    total_learning = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id
    ).count()
    
    # Vocabularies considered "learned" (e.g. interval > 21 days)
    well_known = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.interval > 21
    ).count()
    
    # Vocabularies due for review today
    today = datetime.utcnow()
    due_today = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.next_review_date <= today
    ).count()
    
    # Heatmap data (fake for now, based on user creation date to today)
    # Ideally we should log daily activity in a separate table. For now, generate some dummy data for the last 30 days
    heatmap = []
    import random
    for i in range(30):
        d = today - timedelta(days=29 - i)
        # Mock activity data: 0 to 5
        heatmap.append({
            "date": d.strftime("%Y-%m-%d"),
            "count": random.randint(0, 5) if i > 15 else 0 # More activity recently
        })
        
    return {
        "streak": current_user.streak_count or 0,
        "total_learning": total_learning,
        "well_known": well_known,
        "due_today": due_today,
        "heatmap": heatmap
    }

@router.get("/analytics/weak-words")
def get_weak_words(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Weakest words are those with lowest ease_factor or highest repetition count but still short interval
    weak_progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.repetition > 0 # At least reviewed once
    ).order_by(models.UserProgress.ease_factor.asc()).limit(5).all()
    
    return [
        {
            "word": p.vocabulary.word,
            "meaning": p.vocabulary.meaning,
            "ease_factor": p.ease_factor,
            "repetition": p.repetition,
            "interval": p.interval
        }
        for p in weak_progress
    ]
