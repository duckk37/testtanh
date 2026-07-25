import models

def seed(db):
    try:
        # Check if the exam already exists to avoid duplicates
        existing_exam = db.query(models.Exam).filter(models.Exam.title == "Bài kiểm tra Bài 1 (Nhập tự động)").first()
        if existing_exam:
            print("Tests already seeded.")
            return

        # Find Lesson 1
        lesson = db.query(models.Lesson).filter(
            (models.Lesson.title.ilike('%NGÀY 1%')) | (models.Lesson.order_index == 1)
        ).first()
        
        if not lesson:
            print("Lesson 1 not found for seeding tests!")
            return
            
        print(f"Seeding tests for Lesson ID: {lesson.id}")
        
        # Create an Exam for this lesson
        exam = models.Exam(
            title="Bài kiểm tra Bài 1 (Nhập tự động)",
            description="Bài tập kiểm tra kiến thức về động từ tobe, mạo từ a/an.",
            duration_minutes=15
        )
        db.add(exam)
        db.commit()
        db.refresh(exam)
        
        # Update the lesson to link to this exam
        lesson.exam_id = exam.id
        db.commit()
        
        questions_data = [
            # Câu 1-5
            {
                "content": "Điền mạo từ 'a/an' phù hợp: ....... baby",
                "a": "a", "b": "an", "c": "", "d": "",
                "correct": "A"
            },
            {
                "content": "Điền mạo từ 'a/an' phù hợp: ....... orange",
                "a": "a", "b": "an", "c": "", "d": "",
                "correct": "B"
            },
            {
                "content": "Điền mạo từ 'a/an' phù hợp: ....... woman",
                "a": "a", "b": "an", "c": "", "d": "",
                "correct": "A"
            },
            {
                "content": "Điền mạo từ 'a/an' phù hợp: ....... car",
                "a": "a", "b": "an", "c": "", "d": "",
                "correct": "A"
            },
            {
                "content": "Điền mạo từ 'a/an' phù hợp: ....... apple",
                "a": "a", "b": "an", "c": "", "d": "",
                "correct": "B"
            },
            # Câu 6-10
            {
                "content": "Điền dạng phù hợp của động từ 'to be' vào chỗ trống: We _______ happy.",
                "a": "is", "b": "am", "c": "are", "d": "be",
                "correct": "C"
            },
            {
                "content": "Điền dạng phù hợp của động từ 'to be' vào chỗ trống: It _______ my book.",
                "a": "is", "b": "am", "c": "are", "d": "be",
                "correct": "A"
            },
            {
                "content": "Điền dạng phù hợp của động từ 'to be' vào chỗ trống: They _______ her dogs.",
                "a": "is", "b": "am", "c": "are", "d": "be",
                "correct": "C"
            },
            {
                "content": "Điền dạng phù hợp của động từ 'to be' vào chỗ trống: I _______ a student.",
                "a": "is", "b": "am", "c": "are", "d": "be",
                "correct": "B"
            },
            {
                "content": "Điền dạng phù hợp của động từ 'to be' vào chỗ trống: He _______ her brother.",
                "a": "is", "b": "am", "c": "are", "d": "be",
                "correct": "A"
            },
            # Câu 11-15
            {
                "content": "Chọn dạng viết tắt đúng: It is a big book.",
                "a": "It's a big book.", "b": "Its a big book.", "c": "It're a big book.", "d": "It a big book.",
                "correct": "A"
            },
            {
                "content": "Chọn dạng viết tắt đúng: We are not teachers.",
                "a": "We not teachers.", "b": "We aren't teachers.", "c": "We isn't teachers.", "d": "We don't teachers.",
                "correct": "B"
            },
            {
                "content": "Chọn dạng viết tắt đúng: They are small apples.",
                "a": "They're small apples.", "b": "There small apples.", "c": "They small apples.", "d": "Their small apples.",
                "correct": "A"
            },
            {
                "content": "Chọn dạng viết tắt đúng: He is short.",
                "a": "His short.", "b": "He're short.", "c": "He's short.", "d": "He isn't short.",
                "correct": "C"
            },
            {
                "content": "Chọn dạng viết tắt đúng: She is in the car.",
                "a": "She are in the car.", "b": "She're in the car.", "c": "She's in the car.", "d": "She in the car.",
                "correct": "C"
            },
            # Câu 16-20
            {
                "content": "Chọn đáp án phù hợp: She _______ short; she is tall.",
                "a": "are", "b": "am", "c": "isn't", "d": "aren't",
                "correct": "C"
            },
            {
                "content": "Chọn đáp án phù hợp: I _______ a teacher. I am a student.",
                "a": "is not", "b": "am not", "c": "aren't", "d": "don't",
                "correct": "B"
            },
            {
                "content": "Chọn đáp án phù hợp: My brother is happy. He _______ sad.",
                "a": "isn't", "b": "are", "c": "am not", "d": "aren't",
                "correct": "A"
            },
            {
                "content": "Chọn đáp án phù hợp: They are not her books; they _______ my books.",
                "a": "is", "b": "are", "c": "am", "d": "be",
                "correct": "B"
            },
            {
                "content": "Chọn đáp án phù hợp: It _______ a big car. It's a small car.",
                "a": "aren't", "b": "am not", "c": "is not", "d": "don't",
                "correct": "C"
            }
        ]
        
        for q in questions_data:
            question = models.Question(
                exam_id=exam.id,
                content=q["content"],
                option_a=q["a"],
                option_b=q["b"],
                option_c=q["c"],
                option_d=q["d"],
                correct_option=q["correct"]
            )
            db.add(question)
            
        db.commit()
        print("Added 20 questions successfully during startup!")
        
    except Exception as e:
        print(f"Error seeding Lesson 1 tests: {e}")

    # Import tests for Lessons 2 to 4 from JSON
    import json
    import os
    json_path = os.path.join(os.path.dirname(__file__), 'tests_data.json')
    if os.path.exists(json_path):
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                tests_data = json.load(f)
                
            for lesson_num_str, data in tests_data.items():
                lesson_num = int(lesson_num_str)
                exam_title = data["title"]
                
                # Check if exam exists
                existing_exam = db.query(models.Exam).filter(models.Exam.title == exam_title).first()
                if existing_exam:
                    continue
                    
                # Find lesson
                lesson = db.query(models.Lesson).filter(
                    (models.Lesson.title.ilike(f'%NGÀY {lesson_num}%')) | (models.Lesson.order_index == lesson_num)
                ).first()
                
                if not lesson:
                    print(f"Lesson {lesson_num} not found!")
                    continue
                    
                # Create exam
                exam = models.Exam(
                    title=exam_title,
                    description=data["description"],
                    duration_minutes=data["duration_minutes"]
                )
                db.add(exam)
                db.commit()
                db.refresh(exam)
                
                # Link exam to lesson
                lesson.exam_id = exam.id
                db.commit()
                
                # Create questions
                for q in data["questions"]:
                    question = models.Question(
                        exam_id=exam.id,
                        content=q["content"],
                        option_a=q["a"],
                        option_b=q["b"],
                        option_c=q["c"],
                        option_d=q["d"],
                        correct_option=q["correct"]
                    )
                    db.add(question)
                
                db.commit()
                print(f"Added {len(data['questions'])} questions for Lesson {lesson_num}!")
                
        except Exception as e:
            print(f"Error seeding tests from JSON: {e}")
