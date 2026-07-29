from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from database import get_db
from routers.admin.dependencies import require_admin

router = APIRouter(prefix="/admin/users", tags=["admin_users"])

@router.get("/")
def get_all_users(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    users = db.query(models.User).all()
    return [{"id": u.id, "email": u.email, "username": u.username, "role": u.role, "streak_count": u.streak_count, "coins": u.coins} for u in users]

@router.put("/{user_id}/role")
def update_user_role(user_id: str, role_update: schemas.UserRoleUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    if role_update.role not in ["admin", "teacher", "assistant", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role_update.role
    db.commit()
    db.refresh(user)
    return {"message": f"User role updated to {user.role}"}

@router.put("/{user_id}/coins")
def update_user_coins(user_id: str, coins_update: schemas.UserCoinsUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.coins += coins_update.coins
    db.commit()
    db.refresh(user)
    return {"message": "Coins added", "new_balance": user.coins}

@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}
