from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from textblob import TextBlob

import models
from database import get_db
from auth import get_current_user
from utils import calculate_sm2, check_and_update_streak, update_quest_progress

router = APIRouter(tags=["Vocabulary & Writing"])

class VocabularyCreate(BaseModel):
    word: str
    phonetic: str
    meaning: str
    example: str

@router.post("/vocabularies")
def save_vocabulary(vocab: VocabularyCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    word_obj = db.query(models.Vocabulary).filter(models.Vocabulary.word == vocab.word).first()
    if not word_obj:
        word_obj = models.Vocabulary(word=vocab.word, phonetic=vocab.phonetic, meaning=vocab.meaning, example=vocab.example)
        db.add(word_obj)
        db.commit()
        db.refresh(word_obj)
        
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.vocabulary_id == word_obj.id
    ).first()
    
    if not progress:
        progress = models.UserProgress(user_id=current_user.id, vocabulary_id=word_obj.id)
        db.add(progress)
        db.commit()
        
    return {"message": "Saved successfully"}

@router.get("/vocabularies/review")
def get_due_vocabularies(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    today = datetime.utcnow()
    progress_list = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.next_review_date <= today
    ).all()
    
    return [
        {
            "id": p.vocabulary.id,
            "word": p.vocabulary.word,
            "phonetic": p.vocabulary.phonetic,
            "meaning": p.vocabulary.meaning,
            "example": p.vocabulary.example,
            "repetition": p.repetition,
            "interval": p.interval,
            "ease_factor": p.ease_factor
        }
        for p in progress_list
    ]

class ReviewSubmit(BaseModel):
    quality: int

@router.post("/vocabularies/{id}/review")
def submit_review(id: str, req: ReviewSubmit, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == current_user.id,
        models.UserProgress.vocabulary_id == id
    ).first()
    
    if not progress:
        return {"message": "Vocabulary not found in user's list"}
        
    new_stats = calculate_sm2(
        quality=req.quality,
        repetition=progress.repetition,
        ease_factor=progress.ease_factor,
        interval=progress.interval
    )
    
    progress.repetition = new_stats["repetition"]
    progress.interval = new_stats["interval"]
    progress.ease_factor = new_stats["ease_factor"]
    progress.next_review_date = new_stats["next_review_date"]
    
    check_and_update_streak(current_user, db)
    update_quest_progress(current_user.id, "learn_words", 1, db)
    
    db.commit()
    return {"message": "Reviewed successfully", "next_review_date": progress.next_review_date}


class AddWordRequest(BaseModel):
    word: str
    phonetic: str = None
    meaning: str = None
    example: str = None
    user_id: str = None

@router.post("/api/v1/vocabulary", response_model=dict)
def add_vocabulary(req: AddWordRequest, db: Session = Depends(get_db)):
    vocab = db.query(models.Vocabulary).filter(models.Vocabulary.word == req.word).first()
    if not vocab:
        vocab = models.Vocabulary(word=req.word, phonetic=req.phonetic, meaning=req.meaning, example=req.example)
        db.add(vocab)
        db.commit()
        db.refresh(vocab)
    
    if req.user_id:
        progress = db.query(models.UserProgress).filter(
            models.UserProgress.user_id == req.user_id,
            models.UserProgress.vocabulary_id == vocab.id
        ).first()
        if not progress:
            progress = models.UserProgress(user_id=req.user_id, vocabulary_id=vocab.id)
            db.add(progress)
            db.commit()
            
    return {"message": "Word added successfully", "vocabulary_id": vocab.id}

class ReviewRequest(BaseModel):
    user_id: str
    vocabulary_id: str
    quality: int

class ReviewResponse(BaseModel):
    message: str
    next_review_date: datetime

@router.post("/api/v1/progress/review", response_model=ReviewResponse)
def review_vocabulary(request: ReviewRequest, db: Session = Depends(get_db)):
    progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == request.user_id,
        models.UserProgress.vocabulary_id == request.vocabulary_id
    ).first()
    
    if not progress:
        progress = models.UserProgress(user_id=request.user_id, vocabulary_id=request.vocabulary_id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    new_stats = calculate_sm2(
        quality=request.quality,
        repetition=progress.repetition,
        ease_factor=progress.ease_factor,
        interval=progress.interval
    )
    
    progress.repetition = new_stats["repetition"]
    progress.interval = new_stats["interval"]
    progress.ease_factor = new_stats["ease_factor"]
    progress.next_review_date = new_stats["next_review_date"]
    
    db.commit()
    
    return ReviewResponse(
        message="Cập nhật tiến độ ôn tập thành công!",
        next_review_date=new_stats["next_review_date"]
    )


class WritingRequest(BaseModel):
    text: str

@router.post("/api/check-writing")
def check_writing(req: WritingRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    blob = TextBlob(req.text)
    
    corrected_text = str(blob.correct())
    
    original_words = blob.words
    corrected_words = TextBlob(corrected_text).words
    
    mistakes = []
    for i in range(min(len(original_words), len(corrected_words))):
        if original_words[i].lower() != corrected_words[i].lower():
            mistakes.append({
                "original": str(original_words[i]),
                "suggestion": str(corrected_words[i])
            })
            
    word_count = len(original_words)
    unique_words = len(set(word.lower() for word in original_words))
    diversity = round((unique_words / word_count * 100), 1) if word_count > 0 else 0
    
    if word_count >= 50 and len(mistakes) == 0:
        update_quest_progress(current_user.id, "perfect_score", 1, db)
    if word_count > 0:
        check_and_update_streak(current_user, db)
        
    return {
        "corrected_text": corrected_text,
        "mistakes": mistakes,
        "stats": {
            "word_count": word_count,
            "lexical_diversity": diversity,
            "mistake_count": len(mistakes)
        }
    }
