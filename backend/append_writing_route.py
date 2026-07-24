append_code = """
# ==========================================
# WRITING PRACTICE API
# ==========================================
from textblob import TextBlob
from pydantic import BaseModel
from typing import List

class WritingRequest(BaseModel):
    text: str

@app.post("/api/check-writing")
def check_writing(req: WritingRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    blob = TextBlob(req.text)
    
    # Simple spell check
    corrected_text = str(blob.correct())
    
    # Find mistakes by comparing words
    original_words = blob.words
    corrected_words = TextBlob(corrected_text).words
    
    mistakes = []
    for i in range(min(len(original_words), len(corrected_words))):
        if original_words[i].lower() != corrected_words[i].lower():
            mistakes.append({
                "original": str(original_words[i]),
                "suggestion": str(corrected_words[i])
            })
            
    # Word count and lexical diversity (unique words / total words)
    word_count = len(original_words)
    unique_words = len(set(word.lower() for word in original_words))
    diversity = round((unique_words / word_count * 100), 1) if word_count > 0 else 0
    
    # Gamification
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
"""

with open(r"C:\Users\duck\.gemini\antigravity\scratch\interactive-english\backend\main.py", "a", encoding="utf-8") as f:
    f.write(append_code)

print("Appended writing practice route successfully.")
