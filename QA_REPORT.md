# Báo Cáo Phân Tích Mã Nguồn & Kiểm Thử (QA/Testing Report)
**Dự án:** Interactive English Learning Platform
**Đánh giá bởi:** Senior QA/Software Tester

## 1. Đánh giá rủi ro (Risk Assessment)

Tổng quan, mã nguồn được cấu trúc khá chuẩn theo mô hình FastAPI, có phân chia module rõ ràng. Tuy nhiên, hệ thống đang đối mặt với các rủi ro đáng kể sau:

*   **Rủi ro Gamification (Cao):** Hệ thống "Khiên bảo vệ" (Streak Shield) và tính toán "Chuỗi ngày học" (Streak) đang bị **xung đột logic nghiêm trọng** giữa các API. Điều này dẫn đến việc người dùng bỏ tiền ảo mua khiên nhưng vật phẩm mất tác dụng, hoặc bị lạm dụng để giữ streak một cách vô lý.
*   **Rủi ro Hiệu năng (Đỏ/Critical):** API Bảng xếp hạng (Leaderboard) được viết theo kiểu vòng lặp N+1 Query kinh điển. Nếu hệ thống scale lên 10,000 học viên, server Database sẽ lập tức sập hoặc nghẽn do quá tải truy vấn.
*   **Rủi ro Múi giờ (Medium):** Các mốc reset nhiệm vụ và streak đang dùng `datetime.utcnow().date()`. Với người dùng ở Việt Nam (UTC+7), "ngày mới" sẽ bắt đầu vào lúc 7h sáng thay vì 0h đêm, gây bối rối về trải nghiệm (UX).
*   **Rủi ro Bảo mật (Medium):** JWT Secret Key đang bị hardcode trong `auth.py`. Thời hạn Access Token lên tới 7 ngày là quá rủi ro nếu token bị lộ. Lệnh `bcrypt` tự động cắt xén (truncate) mật khẩu dài quá 72 bytes mà không có cơ chế cảnh báo.

---

## 2. Danh sách Kịch bản kiểm thử (Test Cases)

| ID | Mô tả kịch bản (Scenario) | Dữ liệu đầu vào (Input/Pre-condition) | Kết quả mong đợi (Expected Result) |
| :--- | :--- | :--- | :--- |
| **TC_01** | [Luồng chuẩn] Đăng nhập hợp lệ | Email, Password hợp lệ. | HTTP 200, trả về Access Token. |
| **TC_02** | [Negative] Đăng nhập với mật khẩu siêu dài | Password > 72 ký tự. | Hệ thống bắt lỗi Validation từ đầu, không được âm thầm truncate mật khẩu. |
| **TC_03** | [Luồng chuẩn] Mua Khiên bảo vệ Streak | User có đủ số lượng Coins (>= 100). | Trừ đúng số Coin, `streak_shields` + 1. |
| **TC_04** | [Negative] Lạm dụng nghỉ học nhiều ngày | User có 1 Khiên, nghỉ học 10 ngày. Ngày 11 vào làm bài tập. | **Bắt buộc mất Streak**, reset streak = 1 (do 1 khiên không thể đỡ cho 10 ngày). |
| **TC_05** | [Gamification] Đăng nhập lại sau khi nghỉ | User có 5 Khiên, nghỉ học 2 ngày. Login lại app. | Streak không bị reset, hệ thống trừ đi 2 khiên để giữ chuỗi ngày học. |
| **TC_06** | [Edge Case] Nộp bài khi đề thi bị rỗng | Lesson có bài test, nhưng Admin chưa tạo Question nào. Nộp bài trắc nghiệm. | HTTP 400 (Lỗi: Đề thi chưa hoàn thiện). Không lưu trạng thái "Trượt" (is_passed=False) cho học viên. |
| **TC_07** | [Performance] Tải Bảng Xếp Hạng với lượng data lớn | DB chứa 10,000 Users và 50,000 Records tiến trình học. | API phản hồi < 500ms, Memory ổn định. |
| **TC_08** | [Timezone] Reset nhiệm vụ ngày tại Việt Nam | Đồng hồ hệ thống máy học viên qua mốc 00:01 sáng. | Nhiệm vụ ngày cũ biến mất, load 3 nhiệm vụ của ngày mới. |

---

## 3. Báo cáo Bug chi tiết (Bug Reports)

Dưới đây là các lỗi logic (Logic Flaws) được phát hiện từ mã nguồn `main.py` và `auth.py`:

### 🐞 Bug 01: Lỗi sập hệ thống (N+1 Query) tại API Leaderboard
*   **Mức độ (Severity):** Critical
*   **Các bước tái hiện:** Tạo 10,000 records User, gọi API `GET /users/leaderboard`.
*   **Kết quả thực tế:** Tại `main.py`, đoạn code `users = db.query(models.User).all()` kết hợp vòng lặp `for user in users:` thực hiện **2 câu lệnh SQL riêng biệt cho mỗi user** để tính điểm và đếm từ vựng. Với 10,000 user, hệ thống đẩy **20,001 truy vấn** cùng lúc vào database, gây Timeout.
*   **Đề xuất sửa:** Giao phó việc tính toán cho Database. Dùng SQLAlchemy `JOIN` và `GROUP_BY` để lấy thẳng top 10 ra từ DB mà không cần lặp qua toàn bộ bảng User.

### 🐞 Bug 02: Bất đồng bộ logic Streak gây vô hiệu hóa "Khiên bảo vệ"
*   **Mức độ:** High
*   **Các bước tái hiện:** 
    1. Học viên mua 2 Khiên bảo vệ.
    2. Tắt app, nghỉ học 2 ngày. Token hết hạn.
    3. Ngày thứ 3, học viên mở app và đăng nhập lại (gọi API `POST /login`).
*   **Kết quả thực tế:** Code tại API `/login` tự viết lại logic tính streak: `elif last_date < today - timedelta(days=1): user.streak_count = 1`. **Nó reset thẳng tay Streak của user về 1 mà hoàn toàn bỏ qua việc check xem user có Khiên bảo vệ hay không!** 
*   **Đề xuất sửa:** Xóa khối lệnh tính streak thừa thãi trong API `/login`. Chuyển sang import và gọi hàm `check_and_update_streak(user, db)` (hàm này đã có sẵn logic xử lý Khiên).

### 🐞 Bug 03: Hổng logic trừ Khiên - Nghỉ 1 tháng chỉ tốn 1 Khiên
*   **Mức độ:** High
*   **Các bước tái hiện:** Người dùng có 1 Khiên bảo vệ, nghỉ học 15 ngày, sau đó vào làm một bài tập từ vựng.
*   **Kết quả thực tế:** Trong hàm `check_and_update_streak`, điều kiện `elif delta_days > 1` (Nghỉ > 1 ngày) sẽ check xem có khiên không. Nếu có (`streak_shields > 0`), nó chỉ trừ đúng **1 Khiên** (`user.streak_shields -= 1`) và vẫn cập nhật `last_activity_date = now` để cứu Streak. Hậu quả là nghỉ 15 ngày chỉ tốn 1 khiên để duy trì chuỗi!
*   **Đề xuất sửa:** Tính toán số ngày vắng mặt.
    ```python
    missed_days = delta_days - 1
    if user.streak_shields >= missed_days:
        user.streak_shields -= missed_days
        user.last_activity_date = now # Cứu Streak
    else:
        user.streak_count = 1         # Mất Streak
        user.streak_shields = 0
        user.last_activity_date = now
    ```

### 🐞 Bug 04: Đánh trượt học viên oan uổng do lỗi Zero Division Check
*   **Mức độ:** Medium
*   **Các bước tái hiện:** Admin tạo Đề thi nhưng vô tình quên nhập câu hỏi (Bảng Question rỗng). Học viên bấm Nộp bài.
*   **Kết quả thực tế:** Tại API `POST /lessons/{lesson_id}/submit-test`, code xử lý: `score = (correct_count / len(questions)) * 100 if questions else 0`. Nếu mảng rỗng, `score` bị ép về 0. Sau đó `is_passed = 0 >= 80` => Đánh rớt học viên và lưu lịch sử điểm kém vào Database.
*   **Đề xuất sửa:** Đánh chặn ngay từ đầu.
    ```python
    if not questions:
        raise HTTPException(status_code=400, detail="Đề thi chưa khả dụng (Chưa có câu hỏi).")
    ```

### 🐞 Bug 05: Treo ứng dụng khi khởi động (Block Event Loop)
*   **Mức độ:** Low
*   **Mô tả:** Lệnh `os.system("python -m textblob.download_corpora")` đặt thẳng ở global scope file `main.py`. Nó là mã chạy đồng bộ. Khi server khởi động, nó sẽ chặn luồng (block thread) để gọi I/O mạng tải file. Nếu đứt cáp hoặc mạng chậm, ứng dụng FastAPI sẽ đứng hình, không thể serve bất kỳ request nào.
*   **Đề xuất sửa:** Chuyển câu lệnh này vào file bash `startup.sh` hoặc quá trình build Docker (`RUN python -m textblob.download_corpora`) thay vì để nó chạy mỗi lần app khởi động.
