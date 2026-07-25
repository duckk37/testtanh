<div align="center">
  <img src="https://img.icons8.com/color/96/000000/language.png" alt="Logo"/>
  
  # EnglishMaster 🚀
  
  **Nền tảng Học Tiếng Anh AI Thế hệ mới - Đột phá, Tương tác & Cá nhân hóa**

  [![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100-009688.svg)](https://fastapi.tiangolo.com/)
  [![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-FF6F00.svg)](https://ai.google.dev/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
</div>

---

**EnglishMaster** là một hệ thống quản lý học tập (LMS) toàn diện được thiết kế để thay đổi cách chúng ta học Tiếng Anh. Kết hợp sức mạnh của **Trí tuệ nhân tạo (AI)**, hệ thống **Game hóa (Gamification)**, và **Giao diện hiện đại (Framer Motion)**, nền tảng giúp học viên không bao giờ cảm thấy nhàm chán khi học ngôn ngữ.

## ✨ Tính năng Nổi bật (Core Features)

### 🧑‍🎓 Trải nghiệm Học viên Cực đỉnh
*   **🤖 AI Chat Widget Thông minh:** Trợ lý AI tích hợp sẵn dưới dạng pop-up góc màn hình. Gọi AI 24/7 để sửa lỗi ngữ pháp, tra từ vựng, luyện giao tiếp tự nhiên với hiệu ứng gõ phím sinh động (typing indicator).
*   **🎯 Bài Kiểm Tra Đầu Vào AI (Placement Test):** Đánh giá trình độ người dùng qua các câu hỏi trắc nghiệm mượt mà. AI tự động phân tích điểm yếu và sinh ra **Lộ trình học cá nhân hóa 7 ngày** chỉ dành riêng cho bạn.
*   **🎬 Học qua Video YouTube:** Dán link YouTube bất kỳ, hệ thống sẽ tự động bóc tách phụ đề (Transcript) và đồng bộ hóa dòng thời gian (Time-sync). Vừa xem video, vừa học từ mới qua phụ đề hiển thị realtime.
*   **🗂️ Flashcard 3D (Spaced Repetition):** Ôn tập từ vựng khoa học dựa trên thuật toán lặp lại ngắt quãng. Giao diện lật thẻ 3D trực quan và ghi nhớ các từ "khó nhằn" tự động.
*   **🎮 Hệ thống Gamification Gây nghiện:** 
    *   **Chuỗi ngày học (Daily Streak):** Thắp sáng ngọn lửa học tập mỗi ngày.
    *   **Nhiệm vụ (Quests):** Hệ thống nhiệm vụ phong phú tặng thưởng Xu (Coins).
    *   **Cửa hàng (Store):** Dùng Xu để mua "Khiên bảo vệ Streak" hoặc các hình nền hiếm. Mua Xu qua API Thanh toán hoặc nhận miễn phí khi hoàn thành bài.
    *   **Bảng xếp hạng (Leaderboard):** Đua TOP kinh nghiệm (XP) với người dùng khác.
*   **📈 Thống kê & Phân tích:** Báo cáo chi tiết biểu đồ hoạt động trong 30 ngày và độ hiệu quả khi học.
*   **🌗 True Dark Mode & Animations:** Giao diện hỗ trợ Chế độ Tối hoàn chỉnh, kết hợp các hiệu ứng trượt mượt mà (Framer Motion).

### 🛡️ Quản trị viên Toàn năng (Admin Dashboard)
*   **Thống kê thời gian thực:** Xem tổng quan số lượng user, khóa học, doanh thu, và dữ liệu truy cập.
*   **Quản lý Khóa học & Bài học:** Tùy biến toàn bộ nội dung giáo án. Tự động bóc tách và phân tích ngữ pháp từ File PDF (Auto-Seed Tests).
*   **Quản lý Ngân hàng Từ vựng:** Thêm, sửa, xóa các từ vựng cho Flashcard.
*   **Quản lý Người dùng:** Chặn/Mở khóa tài khoản, phân quyền quản trị.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

| Mảng | Công nghệ |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v3, Framer Motion, TanStack Query, React Router DOM, Recharts, Lucide React |
| **Backend** | Python 3.10+, FastAPI (ASGI), SQLAlchemy (ORM) |
| **Database** | PostgreSQL / SQLite (Development) |
| **AI Integration**| Google Generative AI (Gemini Pro) |
| **Infrastructure**| Docker, Docker Compose, Nginx |

Dự án được triển khai theo **Clean Architecture** ở Backend (Modular Routers) và tổ chức component siêu tái sử dụng ở Frontend, đảm bảo hiệu năng và dễ dàng bảo trì.

---

## 🚀 Hướng dẫn Cài đặt Môi trường (Local Setup)

Dự án được chia thành hai nhánh độc lập: `frontend` (React) và `backend` (FastAPI).

### Bước 1: Khởi chạy Backend (API Server)

```bash
cd backend
python -m venv venv
# Trên Windows: venv\Scripts\activate
# Trên macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
pip install youtube-transcript-api google-generativeai

# Tạo file .env ở thư mục backend và dán API Key Gemini của bạn:
# GEMINI_API_KEY=AIzaSy...

uvicorn main:app --reload
```
> Server Backend sẽ chạy tại: **http://localhost:8000**
> Khi chạy lần đầu, Backend sẽ tự động tạo cơ sở dữ liệu `english_app.db`, Seed Bài kiểm tra mẫu và **Tài khoản Admin mặc định**.

### Bước 2: Khởi chạy Frontend (Giao diện)

Mở một cửa sổ Terminal mới:

```bash
cd frontend
npm install
npm run dev
```
> Giao diện Frontend sẽ chạy tại: **http://localhost:5173**

---

## 🐳 Triển khai lên Máy chủ (Docker / DigitalOcean / VPS)

Dự án đã được đóng gói hoàn chỉnh bằng **Docker Compose**. Dễ dàng triển khai lên máy chủ thực tế (VPS như DigitalOcean, Linode, AWS) chỉ với vài lệnh:

```bash
# 1. Clone Source Code về máy chủ
git clone https://github.com/duckk37/testtanh.git
cd testtanh

# 2. Tạo sẵn file SQLite Database (Để Docker mount vào)
mkdir -p backend
touch backend/english_app.db

# 3. Chạy toàn bộ hệ thống bằng Docker
docker compose up -d --build
```
> **Mẹo Tối Ưu Cho VPS Giá Rẻ (RAM < 1GB):**
> Frontend Vite khi build cần nhiều RAM. Hãy tạo file **Swap 2GB** trên máy chủ trước khi chạy lệnh `docker compose build` để tránh lỗi Out of Memory.
> App sẽ chạy trên **Cổng 80 (HTTP)**, bạn có thể trỏ tên miền trực tiếp về IP của VPS!

---

## 🔑 Tài khoản Truy cập Mặc định

- **Admin Account**: `admin@englishmaster.com` | Pass: `admin`
- Các tài khoản học viên (Student) có thể được đăng ký trực tiếp trên giao diện Đăng ký của trang web.

---

<div align="center">
  <i>Được thiết kế cho thế hệ tương lai. Phát triển với niềm đam mê nâng tầm giáo dục.</i> ❤️
</div>
