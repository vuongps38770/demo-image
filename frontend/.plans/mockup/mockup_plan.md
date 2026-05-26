# Frontend Mockup Plan (Clean Architecture)

Mục tiêu của giai đoạn này là xây dựng hoàn chỉnh giao diện (React + Vite + Tailwind + Zustand) với dữ liệu giả (Mock API). Nhờ áp dụng Clean Architecture, chúng ta có thể thoải mái test UI, xem hiệu ứng Progress Bar chạy realtime. Khi Backend thật làm xong, chỉ cần "rút phích cắm" Mock API và cắm Real API vào mà **không làm thay đổi bất kỳ dòng code UI nào**.

## 1. Kiến trúc Clean Architecture cho React
Hệ thống thư mục sẽ tuân thủ nguyên tắc độc lập hoàn toàn giữa UI và Data.

```text
src/
├── core/                  # [DOMAIN & USE CASES] Không phụ thuộc React
│   ├── models/            # Các cấu trúc dữ liệu chuẩn (Job, User)
│   └── usecases/          # Các class/hàm nghiệp vụ (SubmitJob, TrackJobs)
│
├── data/                  # [DATA LAYER] Chịu trách nhiệm gọi data
│   ├── repositories/      # Chứa JobRepositoryImpl (Implement các interface của core)
│   └── api/               # Tầng API được chia nhỏ theo feature
│       ├── jobs/          # API liên quan tới Job
│       │   ├── mock.js    # Giả lập realtime bằng setTimeout
│       │   ├── real.js    # Dùng Axios gọi NestJS (sau này)
│       │   └── index.js   # Export mock hoặc real tuỳ biến môi trường
│       ├── auth/          # API liên quan tới Auth
│       │   ├── mock.js
│       │   ├── real.js
│       │   └── index.js
│       └── index.js       # Import toàn bộ từ các feature và export chung
│
├── presentation/          # [UI LAYER] Chỉ hiển thị, không chứa logic data
│   ├── store/             # Zustand (Lưu global state UI)
│   ├── components/        # Áp dụng Atomic Design (Chia cực nhỏ)
│   │   ├── atoms/         # Nút, Input, Text, Badge, ProgressBar
│   │   ├── molecules/     # Form Field, Thanh Tracking kèm Text step
│   │   └── organisms/     # Header, Modal tạo Job, Card Job
│   └── pages/             # LoginPage, DashboardPage
│
└── main.jsx
```

## 2. Phân chia Component Cực Chi Tiết (Atomic Design)
Như bạn yêu cầu, mọi thứ sẽ được chẻ nhỏ ra để tái sử dụng:
- **`atoms/Button`**: Nút bấm bo tròn hoàn toàn `rounded-full` theo design.
- **`atoms/Card`**: Thẻ nền xám nhạt (light) hoặc xám đen (dark) bo góc `rounded-2xl`.
- **`atoms/ProgressBar`**: Chạy từ 0-100%, màu gradient vàng-cam.
- **`atoms/Badge`**: Hiển thị trạng thái (Queued: Xám, Processing: Cam, Completed: Xanh).
- **`molecules/JobTracker`**: Kết hợp giữa `ProgressBar` và chữ trạng thái realtime (VD: *Processing VAE Decode...*).
- **`molecules/FormGroup`**: Bọc `Input` và Label.
- **`organisms/CreateJobForm`**: Form cho phép chuyển đổi Tab giữa "Gen Image" và "Gen Asset".
- **`organisms/JobCard`**: Hiển thị toàn bộ thông tin 1 Job (Trạng thái, Thanh tiến trình, Ảnh kết quả cuối).

## 3. Lớp API Độc Lập (Mock Phase)
Trong giai đoạn này, các file `mock.js` trong thư mục api/features sẽ mô phỏng Backend:
1. **Submit**: `api/jobs/mock.js` nhận thông tin, trả về `jobId` ngay lập tức.
2. **Websocket Simulation**: Chạy `setInterval` trong nền:
   - Giây 0-2: Trạng thái `Queued`.
   - Giây 2-10: Trạng thái `Processing`. Liên tục đẩy event `progress` (10%, 20%...) và thay đổi step text (*KSampler...*).
   - Giây 10: Trạng thái `Completed` và trả về một ảnh mẫu ngẫu nhiên (ví dụ ảnh Unsplash).

## 4. Các Bước Thực Thi
1. Chạy lệnh init Vite React template trong thư mục `frontend`.
2. Cài đặt các thư viện: `tailwindcss`, `zustand`, `lucide-react` (icon), `clsx` & `tailwind-merge` (để gộp class tailwind chuẩn).
3. Tạo cấu trúc thư mục Clean Architecture và Atomic Components.
4. Cài đặt bộ màu sắc, border radius (bo góc to `32px` và `2xl`) theo chuẩn `design.md`.
5. Code các file `mock.js` trong từng thư mục api (như `api/jobs/mock.js`) để tự động nháy tiến trình.
6. Hoàn thiện các màn hình:
   - Màn Fake Login (Nhập Username).
   - Màn Dashboard (Gồm nút bấm tạo Job, danh sách các Job đang chạy hiển thị thanh tiến trình realtime).

---
> [!IMPORTANT]
> **Yêu cầu Xác nhận từ bạn:**
> Bạn hãy xem qua cấu trúc kiến trúc và kế hoạch chia component này. Nếu bạn thấy hợp lý và sẵn sàng xem bản Mockup chạy thử (với fake progress để xem UX đúng ý không), hãy phản hồi để tôi bắt đầu **tạo project Vite và code ngay** nhé!
