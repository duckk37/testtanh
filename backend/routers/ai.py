from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai
from auth import get_current_user
import models

router = APIRouter(tags=["AI Chat"])

class ChatRequest(BaseModel):
    message: str

# Config API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@router.post("/ai/chat")
def chat_with_ai(request: ChatRequest, current_user: models.User = Depends(get_current_user)):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")
        
    try:
        # Using gemini-2.5-flash model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # System prompt for context
        system_prompt = "You are a helpful English teacher. You should help the user practice English, explain grammar, and suggest vocabulary. Keep your answers concise and friendly. "
        
        full_prompt = system_prompt + f"\nUser: {request.message}\nTeacher:"
        
        response = model.generate_content(full_prompt)
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
