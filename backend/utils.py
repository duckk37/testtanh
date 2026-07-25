from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import models

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

def check_and_update_streak(user: models.User, db: Session):
    now = datetime.utcnow()
    
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
        missed_days = delta_days - 1
        if (user.streak_shields or 0) >= missed_days:
            user.streak_shields = (user.streak_shields or 0) - missed_days
            # Keep streak, just update date
            user.last_activity_date = now
        else:
            user.streak_count = 1
            user.streak_shields = 0
            user.last_activity_date = now
    elif delta_days == 0:
        # Already updated today
        user.last_activity_date = now
        
    db.commit()

def update_quest_progress(user_id: str, quest_type: str, progress_amount: int, db: Session):
    today_str = datetime.utcnow().date().isoformat()
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
