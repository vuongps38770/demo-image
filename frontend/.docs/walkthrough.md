# AI Creative Studio - KALA Style Walkthrough (Updated)

Chúng ta đã tiến hành cập nhật thêm tính năng **So sánh trước/sau khi sinh ảnh bằng di chuột (Hover-to-compare Slider)**, định nghĩa lại khuôn mẫu sản phẩm thành **Mẫu trưng bày đã gen (Showcase Samples)**, và hỗ trợ **Nền caro khử đục (Checkerboard transparency grid)**.

---

## 1. Mẫu Trưng Bày Đã Gen (Showcase Presets)

Trong mục cài đặt vật phẩm game (Asset Change), các preset đại diện cho các sản phẩm **Showcase mẫu đã gen thành công**:
1.  `Wooden Sword` (Kiếm gỗ): Ảnh thanh kiếm sắt -> Ảnh kiếm khắc gỗ cổ.
2.  `Golden Shield` (Khiên vàng): Ảnh khiên sắt đơn giản -> Ảnh khiên vàng hoàng gia tỏa sáng.
3.  `Pixel Chest` (Rương Pixel): Ảnh rương báu tả thực -> Ảnh rương 8-bit retro.

### Tương tác khi click mẫu:
*   **Tự điền Prompt**: Tự động điền đầy đủ câu Prompt mô tả phong cách biến đổi tương ứng vào khung nhập liệu bên trái.
*   **Kích hoạt Studio so sánh**: Ngay lập tức load dữ liệu của mẫu đó vào **Live Showcase Studio** ở trên đầu vùng làm việc bên phải.

---

## 2. Tính năng So sánh bằng Di chuột (Hover Compare) & Nền Caro

*   **Không cần kéo trượt (Hover to Compare)**:
    *   Cả khung so sánh của **Showcase Studio** (trên đầu trang) và các **JobCard hoàn thành** trong Lịch sử đều sử dụng cơ chế so sánh tự động theo chuột.
    *   Bạn chỉ cần **di chuyển con trỏ chuột qua lại** trong khung ảnh, ranh giới phân tách (`BEFORE` / `AFTER`) sẽ chạy bám đuổi theo tọa độ ngang (X) của chuột tức thì cực kỳ mượt mà.
*   **Phóng to so sánh (Fullscreen Maximize Modal)**:
    *   Cả vùng Showcase và Thẻ kết quả đều có nút **Maximize / Phóng to** (Eye icon).
    *   Khi click vào sẽ mở ra một cửa sổ Modal chiếm trọn màn hình, cho phép anh di chuột qua lại để soi từng chi tiết biến đổi của vật phẩm ở kích thước lớn.
*   **Checkerboard Transparency Backdrop**:
    *   Hỗ trợ nền caro xám trắng/đen (`.bg-checkered`) dưới lớp ảnh để dễ dàng nhìn thấy ranh giới cắt biên và độ trong suốt của file vật phẩm game PNG (alpha channels).

---

## 3. Khởi chạy & Kiểm thử

Vite dev server đang chạy tại:
*   **[http://localhost:5174/](http://localhost:5174/)**

### Quy trình kiểm thử:
1.  Truy cập **[http://localhost:5174/](http://localhost:5174/)**, vào Dashboard, chọn tab **Asset Change**.
2.  Mặc định mẫu `Wooden Sword` được chọn. Quan sát ở cột phải, hộp **Live Showcase Studio** hiển thị thanh kiếm gỗ.
3.  **Di chuyển chuột qua lại** trên khung ảnh kiếm gỗ để thấy đường phân cách di chuyển theo chuột, để lộ ảnh kiếm sắt ban đầu ở bên trái và kiếm gỗ ở bên phải.
4.  Bấm vào nút **Maximize** ở góc phải tiêu đề Showcase Studio để phóng to và di chuột so sánh toàn màn hình.
5.  Click chọn mẫu **Golden Shield** ở cột trái để thấy Prompt và Studio tự động cập nhật sang hình ảnh chiếc Khiên Vàng.
6.  Nếu bấm **Run Workflow**, tiến trình chạy sẽ được thêm vào danh sách Lịch sử bên dưới, khi hoàn thành cũng hỗ trợ di chuột so sánh tương tự.
