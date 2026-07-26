<div align="center">
  <img src="https://img.icons8.com/color/96/000000/language.png" alt="Logo" width="120" height="120"/>
  
  # EnglishMaster 🚀
  
  **Nền tảng Học Tiếng Anh AI Thế hệ mới - Đột phá, Tương tác & Cá nhân hóa**

  [![React](https://img.shields.io/badge/React-18.0-blue.svg?logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-FF6F00.svg?logo=google)](https://ai.google.dev/)
  [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg?logo=postgresql)](https://www.postgresql.org/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker)](https://www.docker.com/)
</div>

---

## 📖 Giới thiệu Dự án (About The Project)

**EnglishMaster** không chỉ là một trang web học tiếng Anh thông thường. Đây là một **Hệ thống Quản lý Học tập (LMS)** toàn diện, được thiết kế để giải quyết vấn đề lớn nhất của người tự học: Sự nhàm chán và thiếu định hướng. 

Bằng cách kết hợp **Trí tuệ nhân tạo (Generative AI)** đóng vai trò như một người gia sư thực thụ, hệ thống **Game hóa (Gamification)** để kích thích động lực, và một **Giao diện hiện đại (UX/UI)** mượt mà, EnglishMaster biến việc học ngôn ngữ thành một trải nghiệm thú vị mỗi ngày.

---

## ✨ Chi tiết Tính năng Nổi bật (Core Features in Detail)

### 🤖 1. Trí tuệ Nhân tạo (AI-Powered Learning)
- **AI Giám khảo (Writing Evaluator):** Sử dụng API của Google Gemini để phân tích đoạn văn tiếng Anh của người dùng. Hệ thống không chỉ bắt lỗi ngữ pháp mà còn phân tích cấu trúc câu, tính điểm đa dạng từ vựng (Lexical Diversity) và đưa ra gợi ý viết lại (Rewrite) chuyên nghiệp chuẩn IELTS.
- **Gia sư Roleplay Giao tiếp:** Tích hợp `Web Speech API`, cho phép học viên **bật Micro** và trò chuyện bằng giọng nói với Chatbot AI ngay trên giao diện web. Trải nghiệm như đang nói chuyện với người bản xứ.
- **Smart Placement Test (Bài test đầu vào):** Hệ thống đánh giá trình độ và sinh ra lộ trình học 7 ngày. AI tự động phân tích điểm yếu (ví dụ: yếu thì Quá khứ hoàn thành) và **đối chiếu với Database** để gợi ý chính xác khóa học phù hợp.

### 🏆 2. Game hóa & Cộng đồng (Gamification)
- **Chứng chỉ Điện tử (Auto-Certificates):** Khi học viên hoàn thành 100% khóa học, hệ thống tự động render ra một file **Chứng chỉ PDF** tuyệt đẹp bằng thư viện `reportlab` với tên học viên và chữ ký số.
- **Hệ thống Kinh tế Ảo (Coins & Store):** Học bài, làm nhiệm vụ (Quests) để nhận Xu. Dùng Xu mua "Khiên Bảo Vệ" hoặc đổi giao diện Đen/Neon (Themes).
- **Hệ thống Vinh Danh (Leaderboard & Badges):** Đua TOP XP với học viên khác. Top 3 hàng tuần sẽ tự động được hệ thống thưởng Xu. Chăm chỉ duy trì chuỗi (Streak) 30 ngày sẽ được cấp Huy hiệu đặc biệt.

### 🧑‍🎓 3. Tối ưu UX/UI Trải nghiệm Học viên
- **Học Video Tương Tác (Video Sync):** Tích hợp `react-youtube`, phụ đề tự động chạy theo giọng nói trong video (Karaoke Effect). Người dùng có thể click vào bất kỳ dòng phụ đề nào để tua (Seek) video.
- **Flashcard Siêu tốc (Keyboard Shortcuts):** Không cần dùng chuột. Sử dụng `Space` để lật thẻ, phím số `1`, `2`, `3` để đánh giá thẻ theo thuật toán Spaced Repetition (Lặp lại ngắt quãng), phím `S` để nghe phát âm.
- **Luyện viết an toàn:** Tự động lưu nháp (Auto-save) bài văn vào Trình duyệt. Thống kê realtime số từ, số ký tự và thời gian đọc.
- **Báo cáo Radar Chart:** Báo cáo thành tích trực quan với biểu đồ mạng nhện (`recharts`).

### 🛡️ 4. Quản trị viên (Admin Panel)
- Trang Dashboard chuyên biệt cung cấp góc nhìn toàn cảnh về Doanh thu, Học viên, và tỉ lệ chuyển đổi.
- Cho phép Seed (Tạo dữ liệu mẫu) bài kiểm tra trực tiếp từ File PDF thông qua các parser regex mạnh mẽ.

---

## 🏛️ Cấu trúc Kiến trúc (Architecture & Directory Structure)

Dự án được xây dựng theo mô hình **Client-Server** với sự tách biệt hoàn toàn giữa Frontend và Backend.

```text
📦 EnglishMaster
├── 📂 backend/               # FastAPI Backend (Python)
│   ├── 📂 routers/           # Chứa các API Endpoints (users.py, courses.py, analytics.py...)
│   ├── main.py               # Entry point khởi chạy Server FastAPI
│   ├── models.py             # Định nghĩa Schema cho SQLAlchemy (Tables, Relations)
│   ├── database.py           # Cấu hình kết nối PostgreSQL / SQLite
│   ├── auth.py               # Xử lý JWT Token & Authentication
│   ├── utils.py              # Các hàm tiện ích (tính streak, password hashing...)
│   └── requirements.txt      # Danh sách thư viện Python
├── 📂 frontend/              # React Frontend (Vite)
│   ├── 📂 src/
│   │   ├── 📂 components/    # Components tái sử dụng (AIChatWidget, Navbar, Sidebar...)
│   │   ├── 📂 pages/         # Giao diện các trang (Home, CourseDetail, Flashcard, VideoPlayer...)
│   │   ├── 📂 context/       # React Context (AuthContext) quản lý state toàn cục
│   │   ├── App.jsx           # Cấu hình Router (React Router DOM)
│   │   └── index.css         # Chứa cấu hình Tailwind & Custom CSS
│   ├── package.json          # Danh sách thư viện Node.js
│   └── tailwind.config.js    # Cấu hình UI Theme
├── docker-compose.yml        # Cấu hình triển khai hệ thống bằng Docker
└── README.md                 # Tài liệu hướng dẫn
```

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

### **Frontend**
- **Core:** `React 18`, `Vite` (Build Tool siêu tốc).
- **Styling:** `Tailwind CSS v3`, `Framer Motion` (Hiệu ứng mượt mà), `Lucide React` (Icon).
- **State & Data:** `TanStack Query (React Query)` để quản lý fetching & caching API, `React Router DOM` cho điều hướng.
- **Chuyên biệt:** `Recharts` (Vẽ biểu đồ Analytics), `React-YouTube` (Trình phát video nâng cao).

### **Backend**
- **Core:** `Python 3.10+`, `FastAPI` (Framework xử lý bất đồng bộ, tốc độ cao).
- **Database:** `SQLAlchemy` (ORM), `PostgreSQL` (Dành cho Production), `SQLite` (Dành cho Local Dev).
- **Security:** `PassLib`, `PyJWT` (Xác thực người dùng bảo mật).
- **Chuyên biệt:** `Google Generative AI` (Giao tiếp với Gemini), `ReportLab` (Vẽ và sinh file PDF), `Youtube-Transcript-API` (Bóc tách phụ đề tự động).

---

## 🚀 Hướng dẫn Cài đặt Môi trường (Local Development)

Làm theo các bước sau để thiết lập dự án trên máy tính của bạn.

### ⚙️ 1. Thiết lập Backend (API Server)
1. Di chuyển vào thư mục backend và tạo môi trường ảo (Virtual Environment):
   ```bash
   cd backend
   python -m venv venv
   ```
2. Kích hoạt môi trường ảo:
   - Trên **Windows**: `venv\Scripts\activate`
   - Trên **macOS/Linux**: `source venv/bin/activate`
3. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   pip install youtube-transcript-api google-generativeai reportlab psycopg2-binary
   ```
4. Cấu hình biến môi trường: Tạo file `.env` nằm trong thư mục `backend/` và thêm các nội dung sau:
   ```env
   # Nếu không có DATABASE_URL, hệ thống sẽ tự dùng SQLite (english_app.db)
   DATABASE_URL=postgresql://username:password@localhost:5432/englishdb
   
   # BẮT BUỘC: Lấy Key từ Google AI Studio để sử dụng tính năng Check Writing & Chatbot
   GEMINI_API_KEY=AIzaSy...
   ```
5. Khởi chạy Server:
   ```bash
   uvicorn main:app --reload
   ```
   *FastAPI sẽ chạy tại `http://localhost:8000`. Khi chạy lần đầu, Backend sẽ tự động tạo bảng CSDL và chèn dữ liệu mẫu, bao gồm cả tài khoản Admin mặc định.*

### 🎨 2. Thiết lập Frontend (Giao diện)
1. Mở một cửa sổ Terminal mới, di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các gói NPM:
   ```bash
   npm install
   ```
3. Khởi chạy Vite Dev Server:
   ```bash
   npm run dev
   ```
   *Giao diện React sẽ chạy tại `http://localhost:5173`.*

---

## 🐳 Triển khai Sản phẩm (Production Deployment)

Hệ thống đã được đóng gói containerized hoàn chỉnh thông qua Docker. Để triển khai dự án lên máy chủ VPS thực tế (DigitalOcean, AWS, Linode), hãy chạy:

```bash
# 1. Tải Source Code về Server
git clone https://github.com/duckk37/testtanh.git
cd testtanh

# 2. Tạo sẵn file SQLite Database (Nếu dùng SQLite làm DB phụ để Docker mount vào)
mkdir -p backend
touch backend/english_app.db

# 3. Build và Start toàn bộ hệ thống (Bao gồm Frontend, Backend)
docker compose up -d --build
```
> Hệ thống sẽ tự động cấu hình **Nginx** nội bộ để ánh xạ cổng cho Backend và Frontend. Truy cập ứng dụng qua cổng `80` (HTTP) hoặc cấu hình reverse proxy thêm chứng chỉ SSL (HTTPS).

---

## 🔑 Tài khoản Truy cập Mặc định (Demo Accounts)

- **Admin Account**: 
  - Email: `admin@englishmaster.com`
  - Password: `admin`
- **Học viên (Student)**: Bạn có thể tự do nhấn vào nút Đăng ký trên màn hình chính để tự tạo cho mình một tài khoản học viên và trải nghiệm các tính năng AI & Gamification.

---

## 🤝 Đóng góp (Contributing)

Mọi đóng góp (Pull Request, Bug Report, Feature Request) đều được chào đón! 
1. Fork dự án này.
2. Tạo một Branch cho tính năng của bạn (`git checkout -b feature/AmazingFeature`).
3. Commit những thay đổi (`git commit -m 'Add some AmazingFeature'`).
4. Push lên Branch đó (`git push origin feature/AmazingFeature`).
5. Mở một Pull Request.

---

<div align="center">
  <i>Được thiết kế cho thế hệ tương lai. Phát triển với niềm đam mê nâng tầm giáo dục & công nghệ.</i> ❤️
</div>
