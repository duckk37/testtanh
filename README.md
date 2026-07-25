# Interactive English Learning Platform 🚀

Một nền tảng học tiếng Anh trực tuyến tương tác toàn diện (LMS & Gamification), được thiết kế theo tiêu chuẩn Clean Architecture với giao diện hiện đại (Modern UI), hệ thống Game hóa (Gamification) giữ chân học viên, và hiệu suất tối ưu.

Đồng thời, nền tảng cung cấp cho Admin hệ thống quản lý đầy đủ (Khóa học, Bài học, Flashcard, Đề thi, Doanh thu).

---

## 🌟 Tính năng nổi bật (Features)

### 🎓 Dành cho Học viên (Students)
- **Hệ thống Khóa học & Bài học**: Học qua video bài giảng với giao diện thân thiện, tiến trình học được lưu lại tự động. Đạt điểm kiểm tra tối thiểu để mở khóa bài tiếp theo.
- **Interactive Video & Phụ đề**: Click trực tiếp vào một từ tiếng Anh trên màn hình video (subtitles) để tra nghĩa nhanh chóng (Click-to-Translate) và tự động thêm vào sổ tay từ vựng.
- **Luyện tập Flashcard (Spaced Repetition)**: Học từ vựng với thẻ lật 3D, tích hợp thuật toán lặp lại ngắt quãng (SM-2) trí tuệ nhân tạo để nhắc lại từ vựng đúng lúc sắp quên.
- **Làm bài Kiểm tra (Quizzes)**: Đếm ngược thời gian làm bài, chấm điểm tự động ngay lập tức và xem lại chi tiết đáp án Đúng/Sai kèm giải thích.
- **Hệ thống Gamification (Gây nghiện)**:
  - **Chuỗi ngày học (Daily Streaks)**: Giữ streak mỗi ngày bằng cách đăng nhập và hoàn thành bài học.
  - **Nhiệm vụ hàng ngày (Daily Quests)**: Hệ thống nhiệm vụ ngẫu nhiên mỗi ngày giúp người dùng định hướng học tập (VD: Hoàn thành 1 bài test, Học 10 từ vựng).
  - **Hệ thống Tiền tệ (Coins) & Cửa hàng**: Tích lũy xu từ việc học để đổi Theme (Giao diện màu sắc) hoặc mua vật phẩm "Khiên bảo vệ" (Streak Shield).
- **Hồ sơ Cá nhân (Profile) & Bảng Xếp Hạng (Leaderboard)**: Xem thống kê học tập qua biểu đồ (Recharts), thành tựu (Badges) và thi đua điểm số với hàng ngàn học viên khác trên Bảng Vàng.

### ⚙️ Dành cho Quản trị viên (Admin)
- **Dashboard Tổng quan**: Biểu đồ thống kê lượng người dùng mới, số khóa học, bài kiểm tra và doanh thu theo thời gian thực.
- **Quản lý Khóa học & Bài học**: Thêm, sửa, xóa khóa học. Cấu hình điều kiện mở khóa bài học (Passing score).
- **Quản lý Flashcard & Từ vựng**: Cập nhật ngân hàng từ vựng, quản lý phiên âm và nghĩa.
- **Quản lý Đề thi & Câu hỏi**: Tạo bài kiểm tra trắc nghiệm, nhập liệu đáp án nhanh chóng thông qua giao diện chuyên dụng.

### 🎨 Giao diện (UI/UX)
- **True Dark Mode**: Hỗ trợ Chế độ Tối toàn diện trên mọi màn hình, giúp bảo vệ mắt khi học ban đêm.
- **Glassmorphism**: Hiệu ứng kính mờ (backdrop-blur) cao cấp, mượt mà trên Header và Sidebar.
- **Responsive Design**: Tương thích hoàn hảo trên cả Mobile, Tablet và Desktop. Hỗ trợ Sidebar tự động thu gọn.
- **Code Splitting (Lazy Loading)**: Tải trang nhanh như chớp nhờ kỹ thuật chia tách các file JS.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

### Frontend (SPA - Trải nghiệm tức thì)
- **React.js (Vite)**: Framework chính cho giao diện tốc độ siêu cao.
- **Tailwind CSS v3**: Quản lý UI/UX, dễ dàng mở rộng, hỗ trợ Dark Mode và Responsive.
- **TanStack Query (React Query)**: Quản lý trạng thái server (Server State), tự động Caching dữ liệu khóa học/bảng xếp hạng trong 5 phút, tự động đồng bộ hóa dữ liệu.
- **Lucide React**: Thư viện icon phong phú.
- **Recharts**: Vẽ biểu đồ thống kê học tập trực quan.

### Backend (Modular FastAPI - Clean Architecture)
- **Python (FastAPI)**: API siêu tốc, bất đồng bộ (Asynchronous ASGI).
- **Kiến trúc Modular Routers**: Phân mảnh `main.py` thành các module độc lập (`auth.py`, `users.py`, `courses.py`, `gamification.py`...) giúp dễ dàng bảo trì và mở rộng.
- **SQLAlchemy (ORM)**: Truy vấn và quản lý cơ sở dữ liệu. Xử lý bài toán N+1 query hiệu quả bằng `joinedload`.
- **PostgreSQL / SQLite**: SQLite cho môi trường phát triển (Local) và PostgreSQL cho môi trường sản xuất (Production).
- **Authentication**: JWT (JSON Web Tokens) và bảo mật mã hóa mật khẩu bằng `bcrypt`.

---

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng (Setup Instructions)

Dự án được chia làm 2 phần: `frontend` và `backend`. Bạn cần chạy cả hai để ứng dụng hoạt động đầy đủ.

### 1. Cài đặt Backend (FastAPI)

Yêu cầu: Python 3.8+

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Tạo môi trường ảo (khuyến nghị)
python -m venv venv

# 3. Kích hoạt môi trường ảo
# Trên Windows:
venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate

# 4. Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# 5. Chạy server phát triển
uvicorn main:app --reload
```
Backend sẽ khởi chạy tại: `http://localhost:8000`  
Hệ thống sẽ tự động tạo cơ sở dữ liệu SQLite (`english_app.db`), tạo dữ liệu giả lập (Mock data) như khóa học, câu hỏi và tài khoản Admin ở lần khởi động đầu tiên.

### 2. Cài đặt Frontend (React + Vite)

Yêu cầu: Node.js 16+

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các dependencies
npm install

# 3. Chạy server phát triển
npm run dev
```
Frontend sẽ khởi chạy tại: `http://localhost:5173`

---

## 🔑 Tài khoản Test mặc định

Khi Backend khởi động lần đầu, hệ thống sẽ tự động tạo một tài khoản Admin:
- **Email**: `admin@englishmaster.com`
- **Mật khẩu**: `admin`

*(Lưu ý: Nếu bạn sử dụng PostgreSQL trên Production, bạn có thể thiết lập tài khoản Admin thông qua script hoặc thao tác DB trực tiếp).*

---

## 🌐 Triển khai (Deployment)

Dự án đã được thiết kế sẵn để đưa lên các dịch vụ đám mây chuyên nghiệp.
- **Frontend (Static Hosting)**: Khuyên dùng **Vercel** hoặc **Netlify**. Chọn thư mục `frontend` và lệnh `npm run build`. Đã tối ưu Code Splitting nên dung lượng tải rất nhẹ.
- **Backend (Web Service)**: Khuyên dùng **Render**, **Railway** hoặc **Heroku**. 
  - Lệnh start cho Render/Heroku (sử dụng Gunicorn + Uvicorn workers): 
    `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`
  - Đã có sẵn file `startup.sh` để xử lý các tài nguyên phụ trợ trước khi app chạy.

---
*BGKH English - Developed with ❤️ for Interactive English Learning.*
