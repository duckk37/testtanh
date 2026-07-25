import sqlite3
import uuid
import datetime

db_path = "C:/Users/duck/.gemini/antigravity/scratch/interactive-english/english_app.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Find Lesson 1
cursor.execute("SELECT id FROM lessons WHERE title LIKE '%NGÀY 1%' OR order_index = 1 LIMIT 1")
row = cursor.fetchone()
if not row:
    print("Lesson 1 not found!")
    exit(1)

lesson_id = row[0]
print(f"Found Lesson ID: {lesson_id}")

# Create an Exam for this lesson
exam_id = str(uuid.uuid4())
now = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

cursor.execute('''
    INSERT INTO exams (id, title, description, duration_minutes, created_at)
    VALUES (?, ?, ?, ?, ?)
''', (exam_id, "Bài kiểm tra Bài 1", "Bài tập kiểm tra kiến thức về động từ tobe, mạo từ a/an.", 15, now))

# Update the lesson to link to this exam
cursor.execute("UPDATE lessons SET exam_id = ? WHERE id = ?", (exam_id, lesson_id))

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
    # Câu 6-10 (fill in blank converted to multiple choice to fit schema)
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
    q_id = str(uuid.uuid4())
    cursor.execute('''
        INSERT INTO questions (id, exam_id, content, option_a, option_b, option_c, option_d, correct_option, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (q_id, exam_id, q["content"], q["a"], q["b"], q["c"], q["d"], q["correct"], now))

conn.commit()
conn.close()
print("Added 20 questions successfully!")
