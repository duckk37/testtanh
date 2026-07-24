append_code = """
# ==========================================
# GAMIFICATION & QUESTS ROUTES
# ==========================================
import random

def check_and_update_streak(user: models.User, db: Session):
    now = datetime.datetime.utcnow()
    
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
        if user.streak_shields > 0:
            user.streak_shields -= 1
            # Keep streak, just update date
            user.last_activity_date = now
        else:
            user.streak_count = 1
            user.last_activity_date = now
    elif delta_days == 0:
        # Already updated today
        user.last_activity_date = now
        
    db.commit()

@app.get("/users/me/quests")
def get_daily_quests(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    today_str = datetime.datetime.utcnow().date().isoformat()
    
    quests = db.query(models.DailyQuest).filter(
        models.DailyQuest.user_id == current_user.id,
        models.DailyQuest.date == today_str
    ).all()
    
    if not quests:
        # Generate new quests for today
        quest_templates = [
            {"type": "learn_words", "target": 10, "reward": 20},
            {"type": "perfect_score", "target": 1, "reward": 50},
            {"type": "complete_lesson", "target": 1, "reward": 30}
        ]
        
        for q in quest_templates:
            new_q = models.DailyQuest(
                user_id=current_user.id,
                quest_type=q["type"],
                target_value=q["target"],
                reward_coins=q["reward"],
                date=today_str
            )
            db.add(new_q)
            quests.append(new_q)
        db.commit()
        
    return quests

def update_quest_progress(user_id: str, quest_type: str, progress_amount: int, db: Session):
    today_str = datetime.datetime.utcnow().date().isoformat()
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

@app.get("/store/items")
def get_store_items():
    return [
        {"id": "shield_1", "name": "Khiên bảo vệ Streak", "description": "Bảo vệ chuỗi học của bạn không bị mất nếu lỡ quên 1 ngày", "price": 100, "type": "shield"},
        {"id": "theme_dark", "name": "Giao diện Dark Mode", "description": "Giao diện tối ngầu đét", "price": 200, "type": "theme"},
        {"id": "theme_neon", "name": "Giao diện Cyberpunk Neon", "description": "Giao diện Neon nổi bật", "price": 500, "type": "theme"},
    ]

@app.post("/store/buy/{item_id}")
def buy_item(item_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    items = get_store_items()
    item = next((i for i in items if i["id"] == item_id), None)
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if (current_user.coins or 0) < item["price"]:
        raise HTTPException(status_code=400, detail="Not enough coins")
        
    if item["type"] == "shield":
        current_user.streak_shields = (current_user.streak_shields or 0) + 1
    elif item["type"] == "theme":
        unlocked = current_user.unlocked_themes.split(',') if current_user.unlocked_themes else []
        if item_id in unlocked:
            raise HTTPException(status_code=400, detail="Already owned this theme")
        unlocked.append(item_id)
        current_user.unlocked_themes = ','.join(unlocked)
        current_user.active_theme = item_id
        
    current_user.coins -= item["price"]
    db.commit()
    
    return {"message": "Purchase successful", "coins": current_user.coins}
"""

with open(r"C:\Users\duck\.gemini\antigravity\scratch\interactive-english\backend\main.py", "a", encoding="utf-8") as f:
    f.write(append_code)

print("Appended gamification routes successfully.")
