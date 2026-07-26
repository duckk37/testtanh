import os
import json
import time
import google.generativeai as genai
from dotenv import load_dotenv

# Load API key from backend/.env
load_dotenv('backend/.env')
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

pdf_files = {
    1: "bai ktra/1 2 DA.pdf",
    2: "bai ktra/2 DA.pdf",
    3: "bai ktra/3 DA.pdf",
    4: "bai ktra/4 da.pdf"
}

all_tests = {}

for lesson_idx, pdf_path in pdf_files.items():
    print(f"Processing Lesson {lesson_idx}: {pdf_path}")
    try:
        sample_file = genai.upload_file(path=pdf_path, display_name=f"Lesson {lesson_idx} Test")
        print(f"Uploaded file '{sample_file.display_name}' as: {sample_file.uri}")
        
        # Wait for file to process
        while sample_file.state.name == 'PROCESSING':
            print('.', end='', flush=True)
            time.sleep(2)
            sample_file = genai.get_file(sample_file.name)
            
        print(f"\nFile state: {sample_file.state.name}")
        
        if sample_file.state.name == 'FAILED':
            print("File processing failed.")
            continue
            
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        
        prompt = """
        Extract all the multiple-choice English questions from this test document.
        Return the output ONLY as a raw JSON array. DO NOT use markdown code blocks like ```json.
        Each object in the array MUST have exactly these keys:
        - "content": The question text (string)
        - "a": Option A text (string)
        - "b": Option B text (string)
        - "c": Option C text (string)
        - "d": Option D text (string)
        - "correct": The correct option letter (string, "A", "B", "C", or "D"). Look for circled answers, bold text, highlights, or answer keys at the end. If you cannot determine the correct answer, guess based on English grammar rules.
        """
        
        response = model.generate_content([sample_file, prompt])
        result = response.text.strip()
        
        # Clean up if the model still outputs markdown
        if result.startswith("```json"):
            result = result[7:]
        if result.startswith("```"):
            result = result[3:]
        if result.endswith("```"):
            result = result[:-3]
            
        parsed_json = json.loads(result.strip())
        all_tests[str(lesson_idx)] = parsed_json
        print(f"Successfully extracted {len(parsed_json)} questions for Lesson {lesson_idx}.")
        
        # Clean up file
        genai.delete_file(sample_file.name)
        
    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")

with open('backend/tests_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_tests, f, ensure_ascii=False, indent=4)

print("Saved all extracted tests to backend/tests_data.json")

