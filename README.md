# Interactive English Learning Platform

Một nền tảng học tiếng Anh trực tuyến tương tác, hỗ trợ học viên luyện tập từ vựng, ngữ pháp, làm bài kiểm tra và theo dõi tiến độ. Đồng thời cung cấp cho Admin bộ công cụ quản lý toàn diện (Khóa học, Bài học, Flashcard, Đề thi).

## 🌟 Tính năng nổi bật

### Dành cho Học viên (Students)
- **Hệ thống Khóa học & Bài học**: Học qua video và tài liệu trực quan.
- **Flashcard 3D & Text-to-Speech**: Luyện tập từ vựng với thẻ lật 3D, tích hợp AI chấm điểm phát âm (Microphone) và đọc mẫu (Text-to-Speech).
- **Thuật toán Spaced Repetition (SM-2)**: Tối ưu hóa việc ôn tập từ vựng, tự động lên lịch nhắc nhở những từ bạn sắp quên.
- **Làm bài Kiểm tra (Quizzes)**: Đếm ngược thời gian, chấm điểm tự động và review (xem lại) chi tiết đáp án Đúng/Sai sau khi nộp bài.
- **Theo dõi Tiến độ (Progress Tracking)**: Bảng điều khiển cá nhân (Profile) hiển thị biểu đồ học tập, số khóa học đang tham gia và các huy hiệu (Gamification) đạt được.
- **Bảng xếp hạng (Leaderboard)**: Kích thích tinh thần học tập thông qua việc thi đua điểm số.

### Dành cho Quản trị viên (Admin)
- **Dashboard Tổng quan**: Biểu đồ thống kê người dùng, khóa học và doanh thu.
- **Quản lý Khóa học & Bài học**: Thêm, sửa, xóa khóa học và sắp xếp các bài học video.
- **Quản lý Flashcard**: Cập nhật ngân hàng từ vựng.
- **Quản lý Đề thi & Câu hỏi**: Tạo bài kiểm tra và giao diện chuyên dụng để nhập/chỉnh sửa nội dung câu hỏi (kèm 4 đáp án và đáp án đúng).

---

## 🛠 Công nghệ sử dụng

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Python, FastAPI, SQLAlchemy (ORM).
- **Database**: SQLite (dùng cho môi trường phát triển cục bộ).
- **Authentication**: JWT (JSON Web Tokens).

---

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng (Setup Instructions)

Dự án được chia làm 2 phần: `frontend` và `backend`. Bạn cần chạy cả hai để ứng dụng hoạt động đầy đủ.

### 1. Cài đặt Backend (FastAPI)

Yêu cầu: Python 3.8+

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo môi trường ảo (tùy chọn nhưng khuyến nghị)
python -m venv venv

# Kích hoạt môi trường ảo
# Trên Windows:
venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate

# Cài đặt các thư viện cần thiết
pip install -r requirements.txt
# Nếu chưa có requirements.txt, hãy chạy:
# pip install fastapi uvicorn sqlalchemy passlib[bcrypt] pyjwt pydantic python-multipart

# Chạy server
uvicorn main:app --reload
```
Backend sẽ chạy tại: `http://localhost:8000`

### 2. Cài đặt Frontend (React + Vite)

Yêu cầu: Node.js 16+

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt các dependencies
npm install

# Chạy server phát triển
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🔑 Tài khoản Test mặc định

Khi Backend khởi động lần đầu, hệ thống sẽ tự động tạo một tài khoản Admin:
- **Email**: `admin@englishmaster.com`
- **Mật khẩu**: `admin`

Bạn có thể đăng nhập bằng tài khoản này để trải nghiệm **Admin Dashboard**.

### Cấp quyền Admin cho tài khoản khác (Local SQLite)
Nếu bạn tạo một tài khoản mới từ giao diện và muốn cấp quyền admin, bạn có thể chạy lệnh python sau trong thư mục `backend`:

```python
import sqlite3
conn = sqlite3.connect('english_app.db')
conn.execute("UPDATE users SET role='admin' WHERE email='email_cua_ban@gmail.com'")
conn.commit()
conn.close()
```

---

## 📁 Cấu trúc thư mục

```
interactive-english/
├── backend/
│   ├── main.py          # API endpoints, FastAPI app
│   ├── admin.py         # Router dành riêng cho Admin
│   ├── models.py        # Database schema (SQLAlchemy)
│   ├── auth.py          # Xử lý JWT & Hashing
│   └── database.py      # Kết nối SQLite
└── frontend/
    ├── src/
    │   ├── components/  # Các component UI tái sử dụng (Card, Flashcard, Admin Tabs...)
    │   ├── pages/       # Các trang chính (Home, CourseDetail, LessonTest, Profile...)
    │   ├── contexts/    # Context API (AuthContext)
    │   └── config.js    # Cấu hình API URL
    └── package.json     # Cấu hình npm
```
