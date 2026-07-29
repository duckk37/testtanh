from fastapi import Depends, HTTPException
from auth import get_current_user
import models

def require_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions: Admin only")
    return current_user

def require_teacher(current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Not enough permissions: Teacher or Admin required")
    return current_user

def require_assistant(current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["admin", "teacher", "assistant"]:
        raise HTTPException(status_code=403, detail="Not enough permissions: Assistant, Teacher, or Admin required")
    return current_user
