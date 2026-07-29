from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
import os
import shutil
import models
import schemas
import import_pdf_ai
from database import get_db
from routers.admin.dependencies import require_assistant

router = APIRouter(prefix="/admin", tags=["admin_exams"])

@router.post("/exams")
def create_exam(exam: schemas.ExamCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    new_exam = models.Exam(**exam.dict())
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    return new_exam

@router.put("/exams/{exam_id}")
def update_exam(exam_id: str, exam_in: schemas.ExamCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    exam.title = exam_in.title
    exam.description = exam_in.description
    exam.duration_minutes = exam_in.duration_minutes
    db.commit()
    db.refresh(exam)
    return exam

@router.delete("/exams/{exam_id}")
def delete_exam(exam_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    exam = db.query(models.Exam).filter(models.Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.delete(exam)
    db.commit()
    return {"message": "Exam deleted"}

@router.post("/exams/{exam_id}/upload-pdf")
async def upload_pdf_to_exam(
    exam_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    admin: models.User = Depends(require_assistant)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
    os.makedirs("temp", exist_ok=True)
    file_path = os.path.join("temp", f"{exam_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    background_tasks.add_task(import_pdf_ai.process_pdf, file_path, exam_id)
    return {"message": "File uploaded and is being processed by AI"}

@router.post("/questions")
def create_question(question: schemas.QuestionCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    new_q = models.Question(**question.dict())
    db.add(new_q)
    db.commit()
    db.refresh(new_q)
    return new_q

@router.put("/questions/{question_id}")
def update_question(question_id: str, q_in: schemas.QuestionCreateUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    q = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    q.content = q_in.content
    q.option_a = q_in.option_a
    q.option_b = q_in.option_b
    q.option_c = q_in.option_c
    q.option_d = q_in.option_d
    q.correct_option = q_in.correct_option
    db.commit()
    db.refresh(q)
    return q

@router.delete("/questions/{question_id}")
def delete_question(question_id: str, db: Session = Depends(get_db), admin: models.User = Depends(require_assistant)):
    q = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q)
    db.commit()
    return {"message": "Question deleted"}
