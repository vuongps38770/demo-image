# Worker Folder Structure (Vanilla JS Modular)

Mặc dù Worker chạy bằng **JavaScript thuần** (Vanilla JS, Node.js), hệ thống vẫn được thiết kế theo cấu trúc **Modular** rõ ràng. Điều này giúp dễ dàng quản lý việc kết nối ComfyUI, xử lý Queue, và các API bên ngoài.

## Cấu trúc tổng quan (`src/`)

```bash
src/
├── config/                  # [Config] Các biến môi trường và thiết lập tĩnh
│   ├── env.js               # Load và parse .env
│   └── constants.js         # Các hằng số (như tên queue, prefix key)
│
├── redis/                   # [Redis] Module xử lý Redis độc lập
│   ├── connection.js        # Khởi tạo IORedis instance
│   └── job-store.js         # Các hàm helper để update status/progress vào Redis cho Backend đọc
│
├── comfy/                   # [ComfyUI] Module giao tiếp với AI Engine
│   ├── api.js               # Các hàm gọi HTTP REST (ví dụ: POST /prompt)
│   ├── websocket.js         # Lắng nghe Websocket để lấy progress (ví dụ: đang gen ở node nào)
│   └── workflows/           # Lưu các file JSON chuẩn của ComfyUI
│       ├── gen-image.json
│       └── gen-asset.json
│
├── jobs/                    # [Jobs] Module lõi xử lý hàng đợi
│   ├── handlers/            # Chia nhỏ các handler theo type của job
│   │   ├── gen-image.handler.js  # Logic map dữ liệu vào workflow GEN_IMAGE
│   │   └── gen-asset.handler.js  # Logic map dữ liệu vào workflow GEN_ASSET
│   ├── router.js            # Điều hướng job: đọc type và gọi handler tương ứng
│   └── worker.js            # Khởi tạo BullMQ Worker và lắng nghe queue
│
└── index.js                 # Entry point: boot toàn bộ hệ thống Worker
```

## Luồng hoạt động (Data Flow)

1. Khi khởi chạy, `index.js` gọi `jobs/worker.js` để boot BullMQ worker.
2. Worker nhận được Job từ Queue, đẩy sang `jobs/router.js`.
3. `router.js` kiểm tra `job.data.type`. Nếu là `GEN_IMAGE`, gọi `handlers/gen-image.handler.js`.
4. Handler sẽ load file JSON trong `comfy/workflows/`, tiêm prompt/input vào JSON.
5. Handler gọi qua `comfy/api.js` để đẩy sang ComfyUI, đồng thời dùng `comfy/websocket.js` để nghe progress.
6. Khi có progress, dùng `redis/job-store.js` để cập nhật trạng thái thẳng vào Redis. Backend và UI sẽ tự động nhận được thay đổi này.
