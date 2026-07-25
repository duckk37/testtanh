from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel

import models
from database import get_db
from auth import get_current_user

router = APIRouter(tags=["Comments"])

class CommentCreate(BaseModel):
    content: str

@router.get("/lessons/{lesson_id}/comments")
def get_comments(lesson_id: str, db: Session = Depends(get_db)):
    comments = db.query(models.Comment).options(joinedload(models.Comment.user)).filter(models.Comment.lesson_id == lesson_id).order_by(models.Comment.created_at.desc()).all()
    return [{"id": c.id, "content": c.content, "created_at": c.created_at, "username": c.user.username, "role": c.user.role} for c in comments]

@router.post("/lessons/{lesson_id}/comments")
def post_comment(lesson_id: str, req: CommentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_comment = models.Comment(lesson_id=lesson_id, user_id=current_user.id, content=req.content)
    db.add(new_comment)
    db.commit()
    return {"message": "Comment posted"}
