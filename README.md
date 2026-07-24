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

## 🚀 Hướng dẫn Cài đặt & Setup Chi tiết

### Yêu cầu hệ thống
- **Node.js** (Phiên bản >= 18.x)
- **Python** (Phiên bản >= 3.9)
- **Git**

### Bước 1: Thiết lập Database trên Neon.tech (PostgreSQL)
1. Truy cập [Neon.tech](https://neon.tech/) và tạo tài khoản.
2. Tạo Project mới, đặt tên tùy ý.
3. Ở trang Dashboard của Neon, tìm mục **Connection Details**, sao chép chuỗi kết nối (Connection String). Trông nó sẽ giống như thế này:  
   `postgresql://neondb_owner:xxxxxx@ep-wandering-leaf-xxx.aws.neon.tech/neondb?sslmode=require`

### Bước 2: Cài đặt Backend (FastAPI)
1. Mở terminal, di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Tạo và kích hoạt môi trường ảo (Virtual Environment):
   ```bash
   # Dành cho Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Dành cho macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```
4. **Cấu hình Database:**
   - Mở file `backend/database.py`.
   - Tìm biến `SQLALCHEMY_DATABASE_URL` và thay chuỗi kết nối vừa lấy từ Neon vào đây.
5. **Chạy Script để chèn dữ liệu mẫu (Seed Data):**
   *(Nếu bạn muốn hệ thống có sẵn Khóa học, Bài học và Flashcard để xem thử)*
   ```bash
   python import_lessons.py
   ```
6. Khởi chạy Server:
   ```bash
   uvicorn main:app --reload
   ```
   *Backend sẽ chạy tại: `http://localhost:8000`*  
   *Xem tài liệu API tự động tại: `http://localhost:8000/docs`*

### Bước 3: Cài đặt Frontend (React)
1. Mở một cửa sổ terminal **mới** và di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các gói thư viện Node Modules:
   ```bash
   npm install
   ```
3. **Cấu hình API URL:**
   - Mở file `frontend/src/config.js`.
   - Nếu chạy ở máy tính (Local), đặt `export const API_URL = 'http://localhost:8000';`.
   - Nếu đã Deploy Backend lên Render, đổi thành link Render của bạn (VD: `https://testtanh-backend.onrender.com`).
4. Khởi chạy giao diện:
   ```bash
   npm run dev
   ```
   *Frontend sẽ mở tại: `http://localhost:5173`*

---

## 🌐 Hướng dẫn Triển khai (Deployment)

### 1. Deploy Backend lên Render.com
1. Đăng nhập [Render.com](https://render.com/), chọn **New Web Service**.
2. Kết nối với repo GitHub của dự án này.
3. Thiết lập thông số:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Ấn **Create Web Service**. Đợi vài phút để Render cấp phát link cho Backend.
5. Copy link Backend vừa tạo và sửa vào file `frontend/src/config.js`.

### 2. Deploy Frontend lên Vercel.com
1. Đăng nhập [Vercel](https://vercel.com/), chọn **Add New... -> Project**.
2. Chọn repo GitHub của dự án này.
3. Trong phần **Framework Preset**, chọn `Vite`.
4. Trong phần **Root Directory**, gõ `frontend`.
5. Bấm **Deploy**. Vercel sẽ tự động đọc cấu hình `vercel.json` để ngăn chặn lỗi 404 khi load lại trang và xuất bản website của bạn lên internet.

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
