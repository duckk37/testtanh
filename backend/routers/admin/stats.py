from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime
import models
from database import get_db
from routers.admin.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["admin_stats"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    total_users = db.query(models.User).count()
    total_courses = db.query(models.Course).count()
    total_vocab = db.query(models.Vocabulary).count()
    total_exams = db.query(models.Exam).count()

    total_revenue = db.query(func.sum(models.Order.amount)).scalar() or 0.0

    today = datetime.datetime.utcnow().date()
    user_growth = []
    revenue_growth = []
    
    for i in range(6, -1, -1):
        d = today - datetime.timedelta(days=i)
        start_time = datetime.datetime.combine(d, datetime.time.min)
        end_time = datetime.datetime.combine(d, datetime.time.max)
        
        # New users
        users_count = db.query(models.User).filter(
            models.User.created_at >= start_time,
            models.User.created_at <= end_time
        ).count()
        user_growth.append({
            "date": d.strftime("%m/%d"),
            "users": users_count
        })
        
        # Revenue
        rev = db.query(func.sum(models.Order.amount)).filter(
            models.Order.created_at >= start_time,
            models.Order.created_at <= end_time
        ).scalar() or 0.0
        revenue_growth.append({
            "date": d.strftime("%m/%d"),
            "revenue": float(rev)
        })

    # Calculate Churn Rate (Users inactive for 30+ days)
    thirty_days_ago = today - datetime.timedelta(days=30)
    active_users = db.query(models.User).filter(
        models.User.last_activity_date >= datetime.datetime.combine(thirty_days_ago, datetime.time.min)
    ).count()
    churn_rate = 0.0
    if total_users > 0:
        churn_rate = round(((total_users - active_users) / total_users) * 100, 1)

    # Calculate Completion Rate (Completed lessons / Total progress records)
    total_progress = db.query(models.UserLessonProgress).count()
    completed_progress = db.query(models.UserLessonProgress).filter(models.UserLessonProgress.is_completed == 1).count()
    completion_rate = 0.0
    if total_progress > 0:
        completion_rate = round((completed_progress / total_progress) * 100, 1)

    # Mock data if empty for visual purposes (Since it's a test app)
    if total_users == 0:
        total_users = 150
        user_growth = [
            {"date": (today - datetime.timedelta(days=6)).strftime("%m/%d"), "users": 10},
            {"date": (today - datetime.timedelta(days=5)).strftime("%m/%d"), "users": 15},
            {"date": (today - datetime.timedelta(days=4)).strftime("%m/%d"), "users": 20},
            {"date": (today - datetime.timedelta(days=3)).strftime("%m/%d"), "users": 18},
            {"date": (today - datetime.timedelta(days=2)).strftime("%m/%d"), "users": 25},
            {"date": (today - datetime.timedelta(days=1)).strftime("%m/%d"), "users": 30},
            {"date": today.strftime("%m/%d"), "users": 32},
        ]
        total_revenue = 15000000
        revenue_growth = [
            {"date": (today - datetime.timedelta(days=6)).strftime("%m/%d"), "revenue": 1000000},
            {"date": (today - datetime.timedelta(days=5)).strftime("%m/%d"), "revenue": 1500000},
            {"date": (today - datetime.timedelta(days=4)).strftime("%m/%d"), "revenue": 2000000},
            {"date": (today - datetime.timedelta(days=3)).strftime("%m/%d"), "revenue": 1200000},
            {"date": (today - datetime.timedelta(days=2)).strftime("%m/%d"), "revenue": 2500000},
            {"date": (today - datetime.timedelta(days=1)).strftime("%m/%d"), "revenue": 1800000},
            {"date": today.strftime("%m/%d"), "revenue": 900000},
        ]
        if total_revenue == 0.0:
            total_revenue = sum([item["revenue"] for item in revenue_growth])
        
        churn_rate = 15.2
        completion_rate = 68.5

    return {
        "totals": {
            "users": total_users,
            "courses": total_courses,
            "vocabularies": total_vocab,
            "exams": total_exams,
            "revenue": total_revenue,
            "churn_rate": churn_rate,
            "completion_rate": completion_rate
        },
        "user_growth": user_growth,
        "revenue_growth": revenue_growth
    }

@router.post("/trigger-weekly-rewards")
def trigger_weekly_rewards(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    score_subq = db.query(
        models.UserLessonProgress.user_id,
        func.sum(models.UserLessonProgress.highest_score).label("total_score")
    ).group_by(models.UserLessonProgress.user_id).subquery()
    
    results = db.query(
        models.User,
        func.coalesce(score_subq.c.total_score, 0).label("total_score")
    ).outerjoin(score_subq, models.User.id == score_subq.c.user_id) \
     .order_by(func.coalesce(score_subq.c.total_score, 0).desc(), models.User.streak_count.desc()) \
     .limit(3).all()
     
    rewards = [500, 300, 100]
    awarded = []
    
    for idx, (user, score) in enumerate(results):
        if idx < len(rewards):
            user.coins = (user.coins or 0) + rewards[idx]
            awarded.append({"username": user.username, "coins_awarded": rewards[idx]})
            
    db.commit()
    return {"message": "Weekly rewards distributed successfully", "awarded": awarded}
