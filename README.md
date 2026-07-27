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
  [![Android](https://img.shields.io/badge/Android-Termux_Ready-3DDC84.svg?logo=android)](https://termux.dev/)
</div>

---

## 📖 Giới thiệu Dự án (About The Project)

**EnglishMaster** không chỉ là một trang web học tiếng Anh thông thường. Đây là một **Hệ thống Quản lý Học tập (LMS)** toàn diện, được thiết kế để giải quyết vấn đề lớn nhất của người tự học: Sự nhàm chán và thiếu định hướng. 

Bằng cách kết hợp **Trí tuệ nhân tạo (Generative AI)** đóng vai trò như một người gia sư thực thụ, hệ thống **Game hóa (Gamification)** để kích thích động lực, và một **Giao diện hiện đại (UX/UI)** mượt mà, EnglishMaster biến việc học ngôn ngữ thành một trải nghiệm thú vị mỗi ngày.

---

## ✨ Chi tiết Tính năng Nổi bật (Core Features in Detail)

### 🤖 1. Trí tuệ Nhân tạo (AI-Powered Learning)
- **AI Giám khảo (Writing Evaluator):** Sử dụng API của Google Gemini để phân tích đoạn văn tiếng Anh của người dùng. Hệ thống không chỉ bắt lỗi ngữ pháp mà còn phân tích cấu trúc câu, tính điểm đa dạng từ vựng (Lexical Diversity) và đưa ra gợi ý viết lại (Rewrite) chuyên nghiệp chuẩn IELTS/TOEIC.
- **Gia sư Roleplay Giao tiếp:** Tích hợp API chuyển đổi giọng nói thành văn bản, cho phép học viên **bật Micro** và trò chuyện bằng giọng nói với Chatbot AI ngay trên giao diện web. Trải nghiệm như đang nói chuyện với người bản xứ trong các tình huống thực tế (mua sắm, phỏng vấn, du lịch).
- **Smart Placement Test (Bài test đầu vào):** Hệ thống đánh giá trình độ và sinh ra lộ trình học 7 ngày. AI tự động phân tích điểm yếu (ví dụ: yếu thì Quá khứ hoàn thành) và **đối chiếu với Database** để gợi ý chính xác khóa học phù hợp.

### 🏆 2. Game hóa & Cộng đồng (Gamification)
- **Chứng chỉ Điện tử (Auto-Certificates):** Khi học viên hoàn thành 100% khóa học (Video & Bài test), hệ thống tự động render ra một file **Chứng chỉ PDF** tuyệt đẹp bằng thư viện `reportlab` với tên học viên và chữ ký số. Người dùng có thể tải về để chia sẻ lên LinkedIn hoặc Facebook.
- **Hệ thống Kinh tế Ảo (Coins & Store):** Học bài, làm nhiệm vụ (Quests) để nhận Xu. Dùng Xu mua "Khiên Bảo Vệ" hoặc đổi giao diện Đen/Neon (Themes). Mở khóa bài học tự do mà không bắt buộc phải hoàn thành các bài tập cũ.
- **Hệ thống Vinh Danh (Leaderboard & Badges):** Đua TOP XP với học viên khác. Top 3 hàng tuần sẽ tự động được hệ thống thưởng Xu. Chăm chỉ duy trì chuỗi (Streak) 30 ngày sẽ được cấp Huy hiệu đặc biệt (Ví dụ: "Cú Đêm Chăm Chỉ").

### 🧑‍🎓 3. Tối ưu UX/UI Trải nghiệm Học viên
- **Học Video Tương Tác (Video Sync):** Tích hợp `react-youtube`, phụ đề tự động chạy theo giọng nói trong video (Karaoke Effect). Người dùng có thể click vào bất kỳ dòng phụ đề nào để tua (Seek) video.
- **Flashcard Siêu tốc (Keyboard Shortcuts):** Không cần dùng chuột. Sử dụng `Space` để lật thẻ, phím số `1`, `2`, `3` để đánh giá thẻ theo thuật toán Spaced Repetition (Lặp lại ngắt quãng), phím `S` để nghe phát âm.
- **Luyện viết an toàn:** Tự động lưu nháp (Auto-save) bài văn vào Trình duyệt (`localStorage`). Ngay cả khi rớt mạng, bài luận vẫn an toàn. Thống kê realtime số từ, số ký tự và thời gian đọc chuẩn xác.
- **Báo cáo Radar Chart:** Báo cáo thành tích trực quan với biểu đồ mạng nhện (`recharts`), giúp học viên biết mình đang mạnh/yếu Kỹ năng Nghe/Nói/Đọc/Viết ra sao.

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

## 🚀 Hướng dẫn Cài đặt Môi trường (Local Development)

Làm theo các bước sau để thiết lập dự án trên máy tính của bạn (Windows/macOS/Linux).

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
   pip install youtube-transcript-api google-generativeai reportlab psycopg2
   ```
4. Cấu hình biến môi trường: Tạo file `.env` nằm trong thư mục `backend/` và thêm:
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
   *FastAPI sẽ chạy tại `http://localhost:8000`.*

### 🎨 2. Thiết lập Frontend (Giao diện)
1. Mở một cửa sổ Terminal mới, di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   npm install
   ```
2. Khởi chạy Vite Dev Server:
   ```bash
   npm run dev
   ```
   *Giao diện React sẽ chạy tại `http://localhost:5173`.*

---

## 📱 Hướng dẫn Cài đặt trên Điện thoại Android (Termux)

Nếu bạn không có máy tính, bạn hoàn toàn có thể chạy toàn bộ Server & Giao diện trực tiếp trên điện thoại Android thông qua ứng dụng **Termux** (Tải bản mới nhất từ F-Droid, không tải trên Google Play).

Vì Android có kiến trúc ARM và gặp một số giới hạn khi biên dịch mã nguồn C/Rust (lỗi `os error 26` Text file busy), hãy làm chuẩn theo các bước sau:

**Bước 1: Cài đặt gói lõi hệ thống & thư viện biên dịch sẵn**
```bash
termux-setup-storage
pkg update && pkg upgrade -y
pkg install git nodejs python python-fastapi python-uvicorn python-cryptography python-bcrypt python-sqlalchemy rust binutils cloudflared -y
```

**Bước 2: Cài đặt cấu hình môi trường Android & Tải Source**
```bash
# Fix lỗi Text file busy và khai báo Android API
export ANDROID_API_LEVEL=24
export TMPDIR=~/tmp
mkdir -p ~/tmp
export CARGO_BUILD_JOBS=1

# Tải Source code
git clone https://github.com/duckk37/testtanh.git
cd testtanh/backend
```

**Bước 3: Chạy Backend (Bắt buộc dùng `--system-site-packages`)**
```bash
rm -rf venv
python -m venv venv --system-site-packages
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy passlib pyjwt pydantic google-generativeai reportlab youtube-transcript-api
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Bước 4: Chạy Frontend (Mở Session Termux mới)**
```bash
cd testtanh/frontend
npm install
npm run dev -- --host 0.0.0.0
```

---

## 🌍 Đưa Website ra Internet bằng Cloudflare Tunnel (Miễn phí)

Thay vì chỉ chạy trên `localhost`, bạn có thể cho phép bất kỳ ai trên thế giới truy cập vào trang web của bạn bằng Cloudflare. (Có thể chạy trên cả PC hoặc Termux).

1. Mở cửa sổ Terminal mới (Session 3) và chạy hầm cho Backend (Cổng 8000):
   ```bash
   cloudflared tunnel --url http://localhost:8000
   ```
   *Lưu lại đường link `https://xxxx.trycloudflare.com` màu xanh.*

2. Mở file `frontend/src/config.js` (Hoặc file `.env`), thay đổi `API_URL` trỏ về đường link Cloudflare bên trên. Chạy lại Frontend (`npm run dev`).

3. Mở Terminal mới (Session 4) và chạy hầm cho Frontend (Cổng 5173):
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```
   *Gửi đường link Cloudflare thứ 2 này cho bạn bè. Khi họ truy cập, hệ thống sẽ hoạt động thông suốt y như một ứng dụng web thực thụ!*

---

## 🐳 Triển khai Sản phẩm (Production Deployment)

Hệ thống đã được đóng gói containerized hoàn chỉnh thông qua Docker.
```bash
git clone https://github.com/duckk37/testtanh.git
cd testtanh
mkdir -p backend && touch backend/english_app.db
docker compose up -d --build
```
> Hệ thống sẽ tự động cấu hình **Nginx** nội bộ. Truy cập ứng dụng qua cổng `80` (HTTP).

---

## 🔑 Tài khoản Truy cập Mặc định (Demo Accounts)

- **Admin Account**: 
  - Email: `admin@englishmaster.com`
  - Password: `admin`
- **Học viên (Student)**: Nhấn vào nút Đăng ký trên màn hình chính để tự tạo cho mình một tài khoản học viên và trải nghiệm các tính năng AI & Gamification.

---

## 🤝 Đóng góp (Contributing)

Mọi đóng góp đều được chào đón! 
1. Fork dự án này.
2. Tạo Branch (`git checkout -b feature/AmazingFeature`).
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`).
4. Push lên Branch đó (`git push origin feature/AmazingFeature`).
5. Mở Pull Request.

---

<div align="center">
  <i>Được thiết kế cho thế hệ tương lai. Phát triển với niềm đam mê nâng tầm giáo dục & công nghệ.</i> ❤️
</div>
