# Interactive English Learning Platform 🚀

Một nền tảng học tiếng Anh trực tuyến tương tác toàn diện, được thiết kế với giao diện hiện đại (Modern UI) và các tính năng Game hóa (Gamification) giúp học viên duy trì động lực học tập mỗi ngày. Đồng thời, nền tảng cung cấp cho Admin hệ thống quản lý đầy đủ (Khóa học, Bài học, Flashcard, Đề thi).

---

## 🌟 Tính năng nổi bật (Features)

### 🎓 Dành cho Học viên (Students)
- **Hệ thống Khóa học & Bài học**: Học qua video bài giảng với giao diện thân thiện, tiến trình học được lưu lại tự động.
- **Interactive Video & Phụ đề**: Cho phép bật/tắt phụ đề, click trực tiếp vào một từ tiếng Anh trên màn hình video để tra nghĩa nhanh chóng (Click-to-Translate).
- **Luyện tập Flashcard (Spaced Repetition)**: Học từ vựng với thẻ lật 3D, tích hợp AI chấm điểm phát âm (Microphone) và thuật toán lặp lại ngắt quãng (SM-2) để tối ưu việc ghi nhớ.
- **Làm bài Kiểm tra (Quizzes)**: Đếm ngược thời gian làm bài, chấm điểm tự động ngay lập tức và xem lại chi tiết đáp án Đúng/Sai kèm giải thích.
- **Hệ thống Gamification (Gây nghiện)**:
  - **Chuỗi ngày học (Streaks)**: Giữ streak mỗi ngày bằng cách hoàn thành bài học, mua "Khiên bảo vệ" (Streak Shield) bằng điểm thưởng.
  - **Nhiệm vụ hàng ngày (Daily Quests)**: Hệ thống nhiệm vụ ngẫu nhiên mỗi ngày giúp người dùng định hướng học tập.
  - **Hệ thống Tiền tệ (Coins) & Cửa hàng**: Tích lũy xu từ việc học để đổi Theme (Giao diện màu sắc) hoặc các vật phẩm khác.
- **Hồ sơ Cá nhân (Profile) & Bảng Xếp Hạng**: Xem thống kê học tập qua biểu đồ (Recharts), thành tựu (Badges) và thi đua trên Leaderboard.

### ⚙️ Dành cho Quản trị viên (Admin)
- **Dashboard Tổng quan**: Biểu đồ thống kê lượng người dùng mới, số khóa học, bài kiểm tra và doanh thu theo thời gian thực.
- **Quản lý Khóa học & Bài học**: Thêm, sửa, xóa khóa học. Cấu hình điều kiện mở khóa bài học (Passing score).
- **Quản lý Flashcard & Từ vựng**: Cập nhật ngân hàng từ vựng, quản lý phiên âm và nghĩa.
- **Quản lý Đề thi & Câu hỏi**: Tạo và tinh chỉnh bài kiểm tra, nhập liệu đáp án trắc nghiệm nhanh chóng thông qua giao diện chuyên dụng.

### 🎨 Giao diện (UI/UX)
- **True Dark Mode**: Hỗ trợ Chế độ Tối toàn diện trên mọi màn hình, giúp bảo vệ mắt khi học ban đêm.
- **Glassmorphism**: Hiệu ứng kính mờ (backdrop-blur) cao cấp, mượt mà trên Header và Sidebar.
- **Responsive Design**: Tương thích hoàn hảo trên cả Mobile, Tablet và Desktop. Hỗ trợ Sidebar tự động thu gọn.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

### Frontend
- **React.js (Vite)**: Framework chính cho giao diện.
- **Tailwind CSS v3**: Quản lý UI/UX, hỗ trợ Dark Mode và Responsive.
- **Lucide React**: Thư viện icon.
- **Recharts**: Vẽ biểu đồ thống kê học tập.

### Backend
- **Python (FastAPI)**: Xử lý API tốc độ cao, bất đồng bộ (Asynchronous).
- **SQLAlchemy (ORM)**: Truy vấn và quản lý cơ sở dữ liệu.
- **PostgreSQL / SQLite**: Hỗ trợ SQLite cho môi trường phát triển (Local) và PostgreSQL cho môi trường sản xuất (Production).
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
Hệ thống sẽ tự động tạo cơ sở dữ liệu SQLite (`english_app.db`) và chạy **Auto-Migration** ở lần khởi động đầu tiên.

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

Khi Backend khởi động lần đầu, hệ thống sẽ tự động tạo một tài khoản Admin để bạn có thể vào trang Quản lý:
- **Email**: `admin@englishmaster.com`
- **Mật khẩu**: `admin`

*(Lưu ý: Nếu bạn sử dụng PostgreSQL trên Production, bạn có thể thiết lập tài khoản Admin thông qua các lệnh SQL trực tiếp trên Database).*

---

## 🌐 Triển khai (Deployment)

Dự án đã được cấu hình để dễ dàng triển khai trên các nền tảng đám mây:
- **Frontend**: Khuyên dùng **Vercel** hoặc **Netlify**. Chỉ cần trỏ thư mục gốc vào `frontend` và chạy lệnh `npm run build`.
- **Backend**: Khuyên dùng **Render**, **Railway** hoặc **Heroku**. Sử dụng tệp `requirements.txt` và `uvicorn` để chạy app FastAPI. 
  - Lệnh start cho Render: `uvicorn main:app --host 0.0.0.0 --port 10000`

---
*Developed with ❤️ for Interactive English Learning.*
