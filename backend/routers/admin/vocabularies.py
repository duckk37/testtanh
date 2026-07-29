from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db
from routers.admin.dependencies import require_assistant

router = APIRouter(prefix="/admin/vocabularies", tags=["admin_vocabularies"])

@router.get("/")
def get_all_vocabularies(db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    vocabs = db.query(models.Vocabulary).all()
    return [{"id": v.id, "word": v.word, "phonetic": v.phonetic, "meaning": v.meaning, "example": v.example} for v in vocabs]

@router.post("/")
def create_vocabulary(vocab: schemas.VocabularyCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    new_vocab = models.Vocabulary(**vocab.dict())
    db.add(new_vocab)
    db.commit()
    db.refresh(new_vocab)
    return new_vocab

@router.put("/{vocab_id}")
def update_vocabulary(vocab_id: str, vocab_in: schemas.VocabularyCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    vocab = db.query(models.Vocabulary).filter(models.Vocabulary.id == vocab_id).first()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    vocab.word = vocab_in.word
    vocab.phonetic = vocab_in.phonetic
    vocab.meaning = vocab_in.meaning
    vocab.example = vocab_in.example
    db.commit()
    db.refresh(vocab)
    return vocab

@router.delete("/{vocab_id}")
def delete_vocabulary(vocab_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    vocab = db.query(models.Vocabulary).filter(models.Vocabulary.id == vocab_id).first()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    db.delete(vocab)
    db.commit()
    return {"message": "Vocabulary deleted"}
