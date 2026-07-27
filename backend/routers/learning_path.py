from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import json
import requests
from typing import List, Dict, Any
from auth import get_current_user
import models
from database import get_db

router = APIRouter(tags=["Learning Path"])

# Config API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

class PlacementAnswer(BaseModel):
    answers: dict # {question_index: selected_option}

@router.get("/learning-path/placement-questions")
def get_placement_questions():
    # Mocking some placement questions. In a real app, these would come from DB.
    questions = [
        {"id": "q1", "text": "I ___ to the store yesterday.", "options": {"A": "go", "B": "went", "C": "gone", "D": "going"}},
        {"id": "q2", "text": "She has ___ lived here for 5 years.", "options": {"A": "already", "B": "since", "C": "for", "D": "been"}},
        {"id": "q3", "text": "If I ___ you, I would study harder.", "options": {"A": "am", "B": "was", "C": "were", "D": "be"}},
        {"id": "q4", "text": "I look forward ___ you soon.", "options": {"A": "to see", "B": "to seeing", "C": "seeing", "D": "see"}},
        {"id": "q5", "text": "By the time we arrive, the movie ___.", "options": {"A": "will start", "B": "started", "C": "will have started", "D": "starts"}}
    ]
    return questions

@router.post("/learning-path/generate")
def generate_learning_path(
    request: PlacementAnswer, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")
        
    # Analyze the answers to determine level (mock logic)
    # q1: past simple, q2: present perfect, q3: conditional type 2, q4: gerunds, q5: future perfect
    correct_answers = {"q1": "B", "q2": "D", "q3": "C", "q4": "B", "q5": "C"}
    score = 0
    weaknesses = []
    
    mapping = {
        "q1": "Past Simple",
        "q2": "Present Perfect Continuous",
        "q3": "Conditional Type 2",
        "q4": "Gerunds after prepositions",
        "q5": "Future Perfect"
    }
    
    for q_id, correct_ans in correct_answers.items():
        if request.answers.get(q_id) == correct_ans:
            score += 1
        else:
            weaknesses.append(mapping[q_id])
            
    if score <= 2:
        level = "Beginner"
    elif score <= 4:
        level = "Intermediate"
    else:
        level = "Advanced"

    # Get courses to recommend
    courses = db.query(models.Course).all()
    course_list = ", ".join([f"ID {c.id}: {c.title}" for c in courses])
    
    # Call AI to generate roadmap
    prompt = f"""
    You are an expert English teacher. 
    A student has taken a placement test. Their level is determined as {level} (Score: {score}/5).
    They are weak in the following grammar/vocabulary areas: {', '.join(weaknesses) if weaknesses else 'None. They did perfectly.'}.
    
    Available courses in the system: {course_list}
    
    Generate a 7-day personalized study roadmap in JSON format.
    The JSON should be an object with two keys:
    1. "roadmap": an array of exactly 7 objects (one for each day). Each object must have:
       - "day": integer (1 to 7)
       - "title": string (A catchy title for the day's focus)
       - "tasks": an array of strings (3 specific tasks for that day, tailored to their weaknesses and level).
    2. "recommended_course_id": string (Select the most appropriate course ID from the available courses above based on their weaknesses. If none fits, use an empty string).
    
    Return ONLY valid JSON. Do not include markdown blocks like ```json.
    """
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        
        # Clean up output if AI wrapped in markdown
        output_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
        if output_text.startswith("```json"):
            output_text = output_text[7:]
        if output_text.startswith("```"):
            output_text = output_text[3:]
        if output_text.endswith("```"):
            output_text = output_text[:-3]
            
        roadmap_json = output_text.strip()
        
        # Validate json
        json.loads(roadmap_json)
        
        # Save to DB
        # Overwrite if exists
        existing = db.query(models.LearningPath).filter(models.LearningPath.user_id == current_user.id).first()
        if existing:
            existing.level = level
            existing.roadmap_json = roadmap_json
            existing.current_day = 1
        else:
            new_path = models.LearningPath(
                user_id=current_user.id,
                level=level,
                roadmap_json=roadmap_json,
                current_day=1
            )
            db.add(new_path)
        db.commit()
        
        return {"message": "Roadmap generated successfully", "level": level}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate roadmap: {str(e)}")

@router.get("/learning-path/current")
def get_current_learning_path(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    path = db.query(models.LearningPath).filter(models.LearningPath.user_id == current_user.id).first()
    if not path:
        return {"exists": False}
        
    try:
        roadmap_data = json.loads(path.roadmap_json)
        # Handle both old array format and new object format
        if isinstance(roadmap_data, list):
            roadmap = roadmap_data
            recommended_course_id = None
        else:
            roadmap = roadmap_data.get("roadmap", [])
            recommended_course_id = roadmap_data.get("recommended_course_id")
            
        return {
            "exists": True,
            "level": path.level,
            "current_day": path.current_day,
            "roadmap": roadmap,
            "recommended_course_id": recommended_course_id
        }
    except:
        return {"exists": False, "error": "Invalid JSON data in database"}
