<div align="center">
  <img src="https://img.icons8.com/color/96/000000/language.png" alt="Logo"/>
  
  # EnglishMaster 🚀
  
  **Nền tảng Học Tiếng Anh AI Thế hệ mới - Đột phá, Tương tác & Cá nhân hóa**

  [![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100-009688.svg)](https://fastapi.tiangolo.com/)
  [![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-FF6F00.svg)](https://ai.google.dev/)
  [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg)](https://www.postgresql.org/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
</div>

---

**EnglishMaster** là một hệ thống quản lý học tập (LMS) toàn diện được thiết kế để thay đổi cách chúng ta học Tiếng Anh. Phiên bản mới nhất mang đến sự kết hợp sức mạnh của **Trí tuệ nhân tạo (Advanced AI)**, hệ thống **Game hóa (Gamification)**, và **Tối ưu Trải nghiệm (UX/UI)**, giúp học viên học tập hiệu quả, mượt mà và không bao giờ nhàm chán.

## ✨ Tính năng Nổi bật (Core Features)

### 🤖 Trí tuệ Nhân tạo Cao cấp (Advanced AI)
* **AI Giám khảo IELTS:** Tích hợp **Google Gemini** thay vì thuật toán thông thường. AI tự động đọc hiểu ngữ cảnh bài viết luận, phát hiện lỗi ngữ pháp, chấm điểm độ phong phú từ vựng (Lexical Diversity) và đưa ra bản gợi ý sửa lỗi hoàn hảo.
* **Gia sư Roleplay bằng Giọng nói:** Tích hợp Web Speech API vào Chatbot. Học viên có thể bật Micro để luyện nói tiếng Anh trực tiếp với AI thay vì chỉ gõ phím.
* **AI Thiết kế Lộ trình thật:** Bài kiểm tra đầu vào (Placement Test) tự động đánh giá điểm yếu và gửi dữ liệu cho AI để sinh ra lộ trình 7 ngày, **đồng thời đối chiếu với Database để đề xuất khóa học phù hợp nhất**.

### 🏆 Tương tác & Cộng đồng (Gamification)
* **Hệ thống Chứng chỉ Tự động:** Tích hợp thư viện `reportlab` tự động vẽ và cấp phát file **Chứng chỉ PDF** mang tên người dùng khi hoàn thành khóa học.
* **Đua TOP Bảng Xếp Hạng (Leaderboard):** Tự động phát thưởng Xu (Coins) vào cuối tuần cho Top 3 học viên xuất sắc nhất.
* **Huy hiệu Chuỗi Ngày Học (Badges):** Tự động trao tặng Huy hiệu vinh danh (Badge) và phần thưởng khi học viên đạt được Streak học 30 ngày liên tiếp.
* **Hệ thống Kinh tế Ảo:** Làm nhiệm vụ, học bài để kiếm Xu. Dùng Xu để mua Theme giao diện mới hoặc "Khiên bảo vệ" giữ Streak.

### 🧑‍🎓 Tối ưu Trải nghiệm Học viên (UX/UI Optimizations)
* **Video Tương tác Thông minh (Karaoke Effect):** Nhúng `react-youtube`. Phụ đề được đồng bộ hóa với video, tự động bôi màu câu đang phát và **hỗ trợ tua video (seek)** ngay khi click vào dòng phụ đề.
* **Flashcard Siêu tốc bằng Phím tắt:** Sử dụng phím `Space` để lật thẻ, phím `1, 2, 3` để đánh giá độ khó và phím `S` để nghe phát âm, không cần đụng đến chuột.
* **Luyện Viết An Toàn (Auto-save):** Bài viết tự động lưu nháp vào trình duyệt, kèm theo phân tích chi tiết số lượng từ, số ký tự và ước lượng thời gian đọc.
* **Báo cáo Học tập (Radar Chart):** Báo cáo cá nhân hóa sử dụng Biểu đồ Mạng nhện trực quan để đánh giá độ đồng đều của 4 kỹ năng (Nghe, Nói, Đọc, Viết).
* **True Dark Mode:** Giao diện tối hoàn chỉnh.

### 🛡️ Quản trị viên Toàn năng (Admin Dashboard)
* **Theo dõi Doanh thu & Người dùng:** Bảng điều khiển xem doanh thu, biểu đồ người dùng đăng ký mới trực quan.
* **Khóa tài khoản (Ban/Unban):** Quản lý trạng thái hoạt động của thành viên.
* **Quản lý Khóa học:** Thêm/sửa khóa học, bài học, bài kiểm tra và ngân hàng từ vựng.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

| Mảng | Công nghệ |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v3, Framer Motion, TanStack Query, React Router DOM, Recharts, Lucide React, React-YouTube |
| **Backend** | Python 3.10+, FastAPI (ASGI), SQLAlchemy (ORM), ReportLab (PDF) |
| **Database** | PostgreSQL (Production) / SQLite (Development) |
| **AI Integration**| Google Generative AI (Gemini Flash) |
| **Infrastructure**| Docker, Docker Compose, Nginx |

---

## 🚀 Hướng dẫn Cài đặt Môi trường (Local Setup)

Dự án được chia thành hai thư mục độc lập: `frontend` (React) và `backend` (FastAPI).

### Bước 1: Khởi chạy Backend (API Server)

```bash
cd backend
python -m venv venv
# Trên Windows: venv\Scripts\activate
# Trên macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
pip install youtube-transcript-api google-generativeai reportlab psycopg2-binary

# Tạo file .env ở thư mục backend và cấu hình Database + AI:
# DATABASE_URL=postgresql://user:pass@localhost/dbname
# GEMINI_API_KEY=AIzaSy...

uvicorn main:app --reload
```
> Server Backend sẽ chạy tại: **http://localhost:8000**
> Tự động tạo cơ sở dữ liệu và **Tài khoản Admin mặc định** trong lần chạy đầu tiên.

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

Dự án đã được cấu hình hoàn chỉnh bằng **Docker Compose** bao gồm cả Container cho PostgreSQL. 

```bash
# 1. Clone Source Code về máy chủ
git clone https://github.com/duckk37/testtanh.git
cd testtanh

# 2. Chạy toàn bộ hệ thống bằng Docker
docker compose up -d --build
```
> App sẽ được expose tự động qua Nginx trên cổng 80 (HTTP).

---

## 🔑 Tài khoản Truy cập Mặc định

- **Admin Account**: `admin@englishmaster.com` | Pass: `admin`
- Học viên có thể tự do đăng ký tài khoản từ giao diện trang chủ.

---

<div align="center">
  <i>Học tiếng Anh không còn là gánh nặng khi bạn có AI làm bạn đồng hành!</i> 🚀
</div>
