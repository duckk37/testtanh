from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import os
import requests
from auth import get_current_user
import models

router = APIRouter(tags=["AI Chat"])

class ChatRequest(BaseModel):
    message: str

# Config API Key
def get_gemini_api_key():
    return os.environ.get("GEMINI_API_KEY", "")

@router.post("/ai/chat")
def chat_with_ai(request: ChatRequest, current_user: models.User = Depends(get_current_user)):
    api_key = get_gemini_api_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")
        
    try:
        # System prompt for context
        system_prompt = "You are a helpful English teacher. You should help the user practice English, explain grammar, and suggest vocabulary. Keep your answers concise and friendly. "
        
        full_prompt = system_prompt + f"\nUser: {request.message}\nTeacher:"
        
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }
        payload = {
            "contents": [{"parts": [{"text": full_prompt}]}]
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        
        reply = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        
        return {"response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
