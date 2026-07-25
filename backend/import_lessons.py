import csv
import os
import models

def import_data(db):
    try:
        # Check if we already imported to avoid duplicates
        existing_lesson = db.query(models.Lesson).filter(models.Lesson.title.ilike('%NGÀY 1%')).first()
        if existing_lesson:
            print("Lessons already imported.")
            return

        # Create the course if not exists
        course_title = "48 NGÀY LẤY GỐC TIẾNG ANH"
        course = db.query(models.Course).filter(models.Course.title == course_title).first()
        if not course:
            course = models.Course(
                title=course_title,
                description="Khóa học lấy lại nền tảng tiếng Anh trong 48 ngày. (Data imported from Google Sheet)",
                thumbnail="https://tienganhcomaiphuong.vn/wp-content/uploads/2021/08/pro3m.jpg",
                price=0.0
            )
            db.add(course)
            db.commit()
            db.refresh(course)
            
        print(f"Course ID: {course.id}")
        
        # Read the CSV
        csv_path = os.path.join(os.path.dirname(__file__), 'data.csv')
        if not os.path.exists(csv_path):
            print("data.csv not found!")
            return

        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            lines = list(reader)
            
            # Find the header row
            start_idx = 0
            for i, row in enumerate(lines):
                if len(row) >= 2 and 'STT' in row[0] and 'TÊN BÀI HỌC' in row[1]:
                    start_idx = i + 1
                    break
            
            if start_idx == 0:
                print("Could not find the header row")
                return
                
            print(f"Starting import from row {start_idx + 1}")
            
            # Import lessons
            count = 0
            for row in lines[start_idx:]:
                if len(row) < 2:
                    continue
                stt_str = row[0].strip()
                title = row[1].strip()
                
                if not stt_str.isdigit() or not title:
                    continue
                    
                order_index = int(stt_str)
                
                # Check if lesson already exists
                existing_lesson = db.query(models.Lesson).filter(
                    models.Lesson.course_id == course.id,
                    models.Lesson.order_index == order_index
                ).first()
                
                if not existing_lesson:
                    # Note: Since the CSV doesn't contain real YouTube URLs (only text "BÀI GIẢNG"),
                    # we will use a placeholder video ID.
                    lesson = models.Lesson(
                        course_id=course.id,
                        title=title,
                        youtube_id="dQw4w9WgXcQ", # Placeholder
                        order_index=order_index,
                        passing_score_required=80
                    )
                    db.add(lesson)
                    count += 1
            
            db.commit()
            print(f"Successfully imported {count} new lessons to the course.")
            
    except Exception as e:
        print(f"Error importing lessons: {e}")
