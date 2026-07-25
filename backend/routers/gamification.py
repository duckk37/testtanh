from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

import models
from database import get_db
from auth import get_current_user

router = APIRouter(tags=["Gamification & Store"])

@router.get("/users/me/quests")
def get_daily_quests(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    today_str = datetime.utcnow().date().isoformat()
    
    quests = db.query(models.DailyQuest).filter(
        models.DailyQuest.user_id == current_user.id,
        models.DailyQuest.date == today_str
    ).all()
    
    if not quests:
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

def get_store_items():
    return [
        {"id": "shield_1", "name": "Khiên bảo vệ Streak", "description": "Bảo vệ chuỗi học của bạn không bị mất nếu lỡ quên 1 ngày", "price": 100, "type": "shield"},
        {"id": "theme_dark", "name": "Giao diện Dark Mode", "description": "Giao diện tối ngầu đét", "price": 200, "type": "theme"},
        {"id": "theme_neon", "name": "Giao diện Cyberpunk Neon", "description": "Giao diện Neon nổi bật", "price": 500, "type": "theme"},
    ]

@router.get("/store/items")
def list_store_items():
    return get_store_items()

@router.post("/store/buy/{item_id}")
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
