from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm

import models
from database import get_db
from auth import get_password_hash, verify_password, create_access_token
from utils import check_and_update_streak

router = APIRouter(tags=["Authentication"])

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user.password)
    new_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_pwd,
        streak_count=1,
        last_activity_date=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    # Update Streak
    check_and_update_streak(user, db)
    
    # Check 3-Day Streak badge
    if user.streak_count >= 3:
        streak_badge = db.query(models.Badge).filter(models.Badge.name == "3-Day Streak").first()
        if streak_badge:
            has_badge = db.query(models.UserBadge).filter(models.UserBadge.user_id == user.id, models.UserBadge.badge_id == streak_badge.id).first()
            if not has_badge:
                db.add(models.UserBadge(user_id=user.id, badge_id=streak_badge.id))
    
    db.commit()
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
