# EnglishMaster - Interactive English Learning Platform 🚀

EnglishMaster là một nền tảng học Tiếng Anh trực tuyến tương tác cao, được thiết kế để kết hợp giữa việc học qua Video (YouTube) và hệ thống bài kiểm tra đánh giá, đi kèm với các yếu tố Trò chơi hóa (Gamification) để tạo động lực cho học viên.

## 🌟 Tính năng nổi bật

### 1. Học qua Video Tương tác
- Nhúng video bài giảng từ YouTube.
- **Khóa/Mở khóa bài học**: Người dùng bắt buộc phải hoàn thành bài kiểm tra của bài học hiện tại (đạt điểm chuẩn) mới có thể mở khóa bài học tiếp theo.

### 2. Hệ thống Tài khoản & Bảo mật (JWT)
- Đăng ký và Đăng nhập bảo mật với mã hóa mật khẩu (Bcrypt).
- Quản lý phiên đăng nhập bằng JSON Web Tokens (JWT).

### 3. Gamification (Trò chơi hóa)
- **Daily Streak 🔥**: Theo dõi số ngày học liên tiếp của học viên.
- **Badges (Huy hiệu) 🏆**: Tự động trao huy hiệu khi đạt thành tích (VD: "First Steps" cho bài học đầu tiên, "Perfect Score" khi đạt 100 điểm, "3-Day Streak" khi học 3 ngày liên tiếp).
- Trang Hồ sơ (Profile) cá nhân hóa hiển thị bộ sưu tập huy hiệu.

### 4. Admin Dashboard (Trang Quản trị)
- Hệ thống phân quyền (`user` và `admin`).
- Bảng điều khiển quản trị viên cho phép xem danh sách người dùng, theo dõi chuỗi ngày học của họ.
- Quản lý danh sách khóa học và bài học.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:**
  - React.js (Vite)
  - React Router DOM (Điều hướng)
  - TailwindCSS (Styling)
  - Context API (Quản lý trạng thái User & Authentication)
  - Lucide React (Icons)
  
- **Backend:**
  - FastAPI (Python)
  - SQLAlchemy (ORM)
  - SQLite (Cơ sở dữ liệu mặc định, dễ dàng chuyển đổi sang PostgreSQL)
  - Passlib & PyJWT (Xác thực và Bảo mật)

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (v18+)
- Python (3.10+)

### 1. Cài đặt và Chạy Backend

Di chuyển vào thư mục backend:
```bash
cd backend
```

Tạo và kích hoạt môi trường ảo (Virtual Environment):
```bash
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

Cài đặt thư viện:
```bash
pip install fastapi uvicorn sqlalchemy passlib bcrypt==4.0.1 pyjwt python-multipart
```

Khởi chạy Server:
```bash
uvicorn main:app --reload
```
*Backend sẽ chạy tại: `http://localhost:8000`*

**(Lưu ý: Database và tài khoản mẫu sẽ được tự động khởi tạo khi chạy server lần đầu).**

### 2. Cài đặt và Chạy Frontend

Mở một terminal mới, di chuyển vào thư mục frontend:
```bash
cd frontend
```

Cài đặt các gói phụ thuộc:
```bash
npm install
```

Khởi chạy ứng dụng Frontend:
```bash
npm run dev
```
*Frontend sẽ chạy tại: `http://localhost:5173`*

---

## 🔑 Tài khoản Test mặc định

Hệ thống đã tự động tạo sẵn một tài khoản Admin để bạn có thể trải nghiệm ngay lập tức.

- **Tài khoản Admin:**
  - Email: `admin@englishmaster.com`
  - Mật khẩu: `admin`

*(Với tài khoản này, bạn có thể truy cập vào nút "Admin" trên thanh điều hướng).*

---

## 📂 Cấu trúc dự án cơ bản

```text
interactive-english/
├── backend/
│   ├── main.py           # Entry point, API Routes chính
│   ├── models.py         # Schema Database (SQLAlchemy)
│   ├── database.py       # Cấu hình kết nối Database
│   ├── auth.py           # Logic JWT, Hashing, Auth Dependencies
│   └── admin.py          # API Routes dành cho Admin
└── frontend/
    ├── src/
    │   ├── components/   # Các Component dùng chung (Header, VideoPlayer...)
    │   ├── context/      # AuthContext (Quản lý trạng thái đăng nhập)
    │   ├── pages/        # Các trang giao diện (Home, Login, Profile, Admin,...)
    │   ├── App.jsx       # Routing chính
    │   └── main.jsx      # Entry point React
    └── package.json
```

## 📝 API Endpoints chính

- `POST /register`: Đăng ký tài khoản.
- `POST /login`: Đăng nhập (trả về JWT Token).
- `GET /users/me`: Lấy thông tin user hiện tại (kèm số Streak và Danh sách Huy hiệu).
- `GET /courses`: Lấy danh sách khóa học.
- `GET /courses/{id}/lessons`: Lấy bài học (bao gồm trạng thái Khóa/Mở khóa theo tiến độ user).
- `POST /lessons/{id}/submit-test`: Nộp bài kiểm tra và nhận huy hiệu (Gamification logic).
- `GET /admin/*`: Các API quản lý dành cho Admin.

---
*Chúc bạn có những trải nghiệm tuyệt vời với EnglishMaster! 🎉*
