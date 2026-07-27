import os
import sys
import json
import fitz  # PyMuPDF
import google.generativeai as genai
from PIL import Image
import io
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Question, Exam
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY is not set in .env")
    sys.exit(1)

genai.configure(api_key=api_key)
# Use Gemini 1.5 Flash for vision tasks (fast and cheap)
model = genai.GenerativeModel('gemini-1.5-flash')

PROMPT = """
You are an expert AI teacher assistant. I am giving you:
1. An image of a full page of an English test.
2. A sequence of smaller images that were extracted from this page.

Your task is to extract all the questions from the page into a structured JSON format.
There are two types of questions: 'multiple_choice' and 'fill_in_blank'.

For each question, figure out if any of the provided extracted images belongs to it. 
If an image belongs to the question, include its 0-based index in the 'image_index' field. If no image, set to null.

Output JSON format exactly like this:
[
  {
    "content": "What are they?",
    "question_type": "fill_in_blank",
    "option_a": null,
    "option_b": null,
    "option_c": null,
    "option_d": null,
    "correct_option": "They are hats.",
    "image_index": 0
  },
  {
    "content": "What is the capital of Vietnam?",
    "question_type": "multiple_choice",
    "option_a": "Hanoi",
    "option_b": "Saigon",
    "option_c": "Hue",
    "option_d": "Danang",
    "correct_option": "A",
    "image_index": null
  }
]

Return ONLY valid JSON.
"""

def process_pdf(pdf_path: str, exam_id: str):
    db = SessionLocal()
    try:
        # Check if exam exists
        exam = db.query(Exam).filter(Exam.id == exam_id).first()
        if not exam:
            print(f"Error: Exam with id {exam_id} not found.")
            return

        doc = fitz.open(pdf_path)
        static_dir = os.path.join(os.path.dirname(__file__), "static", "images")
        os.makedirs(static_dir, exist_ok=True)

        for page_num in range(len(doc)):
            print(f"Processing page {page_num + 1}/{len(doc)}...")
            page = doc[page_num]
            
            # Render full page
            pix = page.get_pixmap(dpi=150)
            page_img = Image.open(io.BytesIO(pix.tobytes("png")))
            
            # Extract images
            image_list = page.get_images(full=True)
            extracted_images = []
            saved_image_paths = []
            
            for img_idx, img in enumerate(image_list):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                img_ext = base_image["ext"]
                
                # Save to disk
                filename = f"exam_{exam_id}_p{page_num}_{img_idx}.{img_ext}"
                filepath = os.path.join(static_dir, filename)
                with open(filepath, "wb") as f:
                    f.write(image_bytes)
                
                saved_image_paths.append(f"/static/images/{filename}")
                extracted_images.append(Image.open(io.BytesIO(image_bytes)))
            
            # Prepare Gemini inputs
            contents = [PROMPT, page_img] + extracted_images
            
            print(f"  Found {len(extracted_images)} images. Sending to Gemini...")
            response = model.generate_content(contents)
            
            # Parse JSON
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
                
            try:
                questions_data = json.loads(text.strip())
            except json.JSONDecodeError:
                print("  Error: Gemini did not return valid JSON.")
                print(text)
                continue
                
            # Insert to DB
            for q_data in questions_data:
                img_url = None
                img_idx = q_data.get("image_index")
                if img_idx is not None and 0 <= img_idx < len(saved_image_paths):
                    img_url = saved_image_paths[img_idx]
                
                new_q = Question(
                    exam_id=exam_id,
                    content=q_data.get("content", ""),
                    question_type=q_data.get("question_type", "multiple_choice"),
                    option_a=q_data.get("option_a"),
                    option_b=q_data.get("option_b"),
                    option_c=q_data.get("option_c"),
                    option_d=q_data.get("option_d"),
                    correct_option=str(q_data.get("correct_option", "")),
                    image_url=img_url
                )
                db.add(new_q)
            
            db.commit()
            print(f"  Saved {len(questions_data)} questions for page {page_num + 1}.")
            
    finally:
        db.close()
        print("Done!")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python import_pdf_ai.py <path_to_pdf> <exam_id>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    exam_id = sys.argv[2]
    process_pdf(pdf_path, exam_id)
