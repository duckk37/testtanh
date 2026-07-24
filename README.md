# 🎓 Interactive English Platform (EnglishMaster)

**EnglishMaster** là một nền tảng học tiếng Anh trực tuyến tương tác toàn diện, được thiết kế với giao diện hiện đại (hỗ trợ Dark Mode) và hệ thống bài giảng phong phú (Video, Flashcard, Bài kiểm tra). Dự án hướng tới việc mang lại trải nghiệm học tập thú vị thông qua cơ chế Gamification (Bảng xếp hạng, Chuỗi ngày học liên tục).

---

## ✨ Tính năng nổi bật

### Dành cho Học viên (Users)
- **Xác thực an toàn:** Đăng nhập, Đăng ký bảo mật với mã hóa mật khẩu (Bcrypt) và JWT Token.
- **Khám phá Khóa học:** Danh sách khóa học đa dạng, giao diện thẻ (card) trực quan, hiển thị giá cả và mô tả.
- **Học tập Tương tác:**
  - 📺 **Video bài giảng:** Tích hợp trực tiếp video YouTube.
  - 🎴 **Flashcard từ vựng:** Học từ vựng với hiệu ứng lật thẻ 3D sinh động, phát âm, ví dụ ngữ cảnh.
  - 📝 **Bài kiểm tra (Quizzes):** Trắc nghiệm tính điểm tự động, chấm điểm ngay lập tức.
- **Gamification & Xã hội:**
  - 🔥 **Streak (Chuỗi ngày học):** Kích thích động lực học tập mỗi ngày.
  - 🏆 **Bảng xếp hạng (Leaderboard):** Tôn vinh các học viên có điểm số/chuỗi ngày cao nhất.
- **Cá nhân hóa:** Hồ sơ cá nhân (Profile) theo dõi tiến độ, đổi mật khẩu. Hỗ trợ **Chế độ Tối (Dark Mode)** thân thiện với mắt.

### Dành cho Quản trị viên (Admin)
- **Bảng điều khiển (Dashboard):** Tổng quan dữ liệu thời gian thực (số lượng người dùng, doanh thu dự kiến, khóa học).
- **Quản lý Khóa học (CRUD):** Thêm mới, chỉnh sửa thông tin (Tên, Mô tả, Giá bán, Ảnh bìa), và xóa khóa học một cách an toàn.
- **Quản lý Người dùng:** Giám sát danh sách học viên, phân quyền và kiểm tra tiến độ học tập (Streak) của từng cá nhân.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### 💻 Frontend (Client)
- **Framework:** React.js (khởi tạo qua Vite để build siêu tốc).
- **Styling:** Tailwind CSS (tiện lợi, responsive, dark mode `class` strategy).
- **Routing:** React Router DOM (Single Page Application).
- **Icons:** Lucide React (nhẹ, đồng bộ).
- **Deploy:** Vercel (kèm cấu hình `vercel.json` để fix lỗi 404 router).

### ⚙️ Backend (Server)
- **Framework:** FastAPI (Python) cực nhanh, hỗ trợ async/await và tự động sinh Swagger UI API Docs.
- **ORM & Database:** SQLAlchemy giao tiếp với cơ sở dữ liệu **PostgreSQL** (Lưu trữ trên nền tảng Serverless **Neon**).
- **Bảo mật:** Passlib (Bcrypt) băm mật khẩu, PyJWT tạo token phiên đăng nhập.
- **CORS:** Cấu hình chuẩn cho phép Frontend giao tiếp chéo domain.
- **Deploy:** Render Web Services.

---

## 📂 Cấu trúc thư mục

```text
interactive-english/
├── backend/                  # Mã nguồn Server (FastAPI)
│   ├── main.py               # File chạy chính & định tuyến (Routes)
│   ├── models.py             # Định nghĩa cấu trúc Database (SQLAlchemy Tables)
│   ├── database.py           # Kết nối PostgreSQL (Neon DB)
│   ├── auth.py               # Logic Đăng nhập, JWT, Bcrypt
│   ├── admin.py              # Các API dành riêng cho Quản trị viên
│   ├── import_*.py           # Script tự động import dữ liệu mẫu (Khóa học, Flashcard)
│   └── requirements.txt      # Danh sách thư viện Python cần thiết
│
├── frontend/                 # Mã nguồn Client (React + Vite)
│   ├── src/
│   │   ├── components/       # Các UI Component dùng chung (Navbar, Footer, Skeleton)
│   │   ├── context/          # State toàn cục (AuthContext, ThemeContext)
│   │   ├── pages/            # Các trang chính (Home, CourseDetail, AdminDashboard, Flashcard, NotFound...)
│   │   ├── App.jsx           # Cấu hình Router và Bọc các Provider
│   │   ├── index.css         # CSS toàn cục (Tailwind directives)
│   │   └── config.js         # Lưu biến môi trường (API_URL)
│   ├── tailwind.config.js    # Cấu hình Tailwind (Thêm class Dark Mode)
│   ├── vercel.json           # Cấu hình deploy Vercel SPA
│   └── package.json          # Danh sách thư viện Node.js
└── README.md
```

---

## 🚀 Hướng dẫn cài đặt chạy cục bộ (Local Development)

### Yêu cầu hệ thống
- **Node.js** (Phiên bản >= 18.x)
- **Python** (Phiên bản >= 3.9)
- **Cơ sở dữ liệu PostgreSQL** (Có thể dùng local hoặc Neon.tech)

### 1. Cài đặt Backend (FastAPI)

1. Mở terminal, di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Tạo và kích hoạt môi trường ảo (Virtual Environment):
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Cài đặt thư viện:
   ```bash
   pip install -r requirements.txt
   ```
4. Cấu hình CSDL PostgreSQL:
   - Mở file `database.py`
   - Tìm biến `SQLALCHEMY_DATABASE_URL` và đổi sang link Database của bạn (ví dụ link từ Neon).
5. Khởi chạy Server:
   ```bash
   uvicorn main:app --reload
   ```
   *Backend sẽ chạy tại: `http://localhost:8000`*
   *Tài liệu API tự động (Swagger): `http://localhost:8000/docs`*

### 2. Cài đặt Frontend (React)

1. Mở terminal khác, di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt gói Node Modules:
   ```bash
   npm install
   ```
3. Khởi chạy giao diện:
   ```bash
   npm run dev
   ```
   *Frontend sẽ chạy tại: `http://localhost:5173`*

> **Lưu ý kết nối:** Hãy đảm bảo biến `API_URL` trong tệp `frontend/src/config.js` trỏ đúng vào địa chỉ Backend của bạn (ví dụ `http://localhost:8000` khi chạy local, hoặc link Render khi deploy).

---

## 📜 Các hàm API Chính (Endpoints)

Dưới đây là một số API nổi bật trong dự án:

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| **POST** | `/register` | Tạo tài khoản học viên mới |
| **POST** | `/token` | Đăng nhập (trả về access_token) |
| **GET** | `/users/me` | Lấy thông tin tài khoản đang đăng nhập |
| **GET** | `/courses` | Lấy danh sách tất cả các khóa học |
| **GET** | `/courses/{id}/lessons`| Lấy chi tiết bài học của 1 khóa |
| **POST** | `/admin/courses` | (Admin) Tạo mới 1 khóa học |
| **PUT** | `/admin/courses/{id}`| (Admin) Sửa thông tin khóa học |
| **DELETE**| `/admin/courses/{id}`| (Admin) Xóa khóa học |
| **GET** | `/admin/users` | (Admin) Xem danh sách toàn bộ Users |

---
*Dự án được xây dựng và tối ưu với sự trợ giúp của AI Assistants.* 🤖✨
