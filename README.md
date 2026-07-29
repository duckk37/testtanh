# Interactive English Platform 🚀

Một nền tảng học tiếng Anh trực tuyến tương tác, đa nền tảng (Web & Mobile), được xây dựng theo hướng Gamification (Trò chơi hóa) kết hợp các tính năng học thuật hiện đại.

## ✨ Tính năng Nổi bật

### Hệ thống Học tập (E-Learning Core)
- **Kiểm tra Đầu vào (Placement Test):** Đánh giá chính xác năng lực người dùng khi mới tham gia.
- **Lộ trình Cá nhân hóa (Roadmap):** Các khóa học, bài giảng video, bài tập thực hành được sắp xếp khoa học.
- **Luyện tập đa kỹ năng:** Từ vựng, ngữ pháp, điền từ, bài kiểm tra (Exams & Quizzes).

### Trò chơi hóa (Gamification)
- **Level & XP:** Nhận điểm kinh nghiệm, lên cấp qua mỗi bài học hoàn thành.
- **Hệ thống Nhiệm vụ (Quests):** Nhiệm vụ hàng ngày, hàng tuần giúp tăng động lực.
- **Xu (Coins) & Cửa hàng (Store):** Dùng xu mua vật phẩm bảo vệ chuỗi ngày học (Streak Freeze) hoặc đổi lấy các tiện ích khác.
- **Chuỗi ngày học (Streaks):** Theo dõi tần suất học liên tục hàng ngày.
- **Bảng xếp hạng (Leaderboard):** Tăng tính cạnh tranh cộng đồng.

### Quản trị & Phân quyền (RBAC)
Hệ thống phân chia 4 cấp độ quyền hạn rõ ràng:
- **Admin:** Quản trị toàn quyền, xem biểu đồ doanh thu, thống kê, thay đổi quyền người dùng.
- **Teacher:** Soạn thảo giáo trình, chấm điểm, theo dõi tiến độ học viên.
- **Assistant:** Trợ giảng hỗ trợ trả lời câu hỏi, chấm bài phụ.
- **User:** Học viên bình thường.

### Thương mại hóa & Nền tảng
- **Thanh toán Thực tế (VNPay):** Tích hợp cổng thanh toán Sandbox VNPay, cho phép mua khóa học và nạp Xu an toàn qua mã hóa HMAC SHA512 (có hỗ trợ IPN Webhook).
- **Hỗ trợ đa nền tảng (Web & Mobile App):** PWA và ứng dụng Native Android/iOS thông qua Capacitor.

## 🛠 Công nghệ Sử dụng

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** & Lucide Icons (Giao diện UI/UX)
- **React Router v6** (Điều hướng)
- **Axios** (Call API)
- **Capacitor** (Đóng gói ứng dụng Android/iOS)

### Backend
- **Python / FastAPI**
- **SQLAlchemy** (ORM) & **SQLite** (Cơ sở dữ liệu mặc định)
- **JWT (JSON Web Token)** (Xác thực và phân quyền)
- **VNPay API** (Thanh toán)

---

## 🚀 Hướng dẫn Cài đặt & Chạy Local

### 1. Cấu hình Môi trường (.env)
Trước khi chạy Backend, bạn cần cấu hình các khóa bảo mật và API tích hợp. Tạo một file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Google Gemini AI (Dùng cho các tính năng Trợ lý thông minh)
# Lấy key tại: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSy... 

# VNPay Sandbox (Dùng cho thanh toán khóa học)
VNPAY_TMN_CODE=TEST_TMN_CODE
VNPAY_HASH_SECRET=TEST_HASH_SECRET
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment-return
```

### 2. Khởi động Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Kích hoạt venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 --no-access-log
```
*Backend sẽ chạy tại: `http://localhost:8000` (Truy cập `http://localhost:8000/docs` để xem API Swagger).*

### 3. Khởi động Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend sẽ chạy tại: `http://localhost:5173`.*

### 4. Đóng gói Ứng dụng Di động (Android)
Đảm bảo bạn đã cài đặt sẵn **Android Studio**.
```bash
cd frontend
npm run build:mobile   # Tự động build ra bản web và đồng bộ (sync) với Capacitor
npm run open:android   # Mở dự án trong Android Studio
```

---

## 🔒 Tài khoản Mặc định

- **Admin Account:**
  - Username: `admin`
  - Password: `password123`

- **Tài khoản Học viên thử nghiệm:**
  - Có thể tạo mới qua tính năng **Register** hoặc dùng **Guest Login**.

## 📝 Roadmap Phát triển (Giai đoạn tiếp theo)

- **AI Writing & Speaking Assistant:** Tích hợp Gemini/ChatGPT để chấm điểm, sửa lỗi ngữ pháp và nhận xét phát âm.
- **Adaptive Testing:** Đề thi thông minh tự động thay đổi độ khó dựa vào trình độ của người dùng.
- **Community:** Diễn đàn thảo luận và kết bạn.
