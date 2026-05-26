# Frontend Folder Structure (React + Vite)

Ứng dụng React sẽ được tổ chức theo kiến trúc tập trung vào Component và Feature (Feature-based).

## Cấu trúc tổng quan (`src/`)

```bash
src/
├── assets/                  # Hình ảnh tĩnh, fonts, css toàn cục
├── components/              # Các UI Components dùng chung (Button, Modal, ProgressBar)
├── features/                # Chia nhỏ theo chức năng
│   ├── auth/                # Chức năng Fake Login
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── image-generation/    # Chức năng tạo ảnh (GEN_IMAGE / GEN_ASSET)
│   │   ├── components/      # Form nhập prompt, upload ảnh
│   │   └── hooks/           # Gọi API POST /api/jobs
│   │
│   └── dashboard/           # Dashboard theo dõi Job (Real-time tracking)
│       ├── components/      # Job Card, Job List
│       └── hooks/           # Gọi API GET /api/jobs/me & Polling
│
├── services/                # [API Layer]
│   └── api.js               # Cấu hình axios/fetch (tự động inject x-username)
│
├── hooks/                   # Custom Hooks dùng chung toàn cục (nếu có)
├── utils/                   # Các hàm helper (format date, handle lỗi)
├── App.jsx                  # Root Component (Chứa Layout & Route đơn giản)
└── main.jsx                 # Entry Point của Vite React
```

## Giải thích kiến trúc
1. **Feature-based (`features/`)**: Thay vì gom tất cả components vào 1 chỗ, chúng ta chia theo chức năng (auth, generation, dashboard). Điều này giúp dễ quản lý khi dự án lớn lên.
2. **Components (`components/`)**: Chỉ chứa các UI "ngu" (Dumb Components) dùng đi dùng lại nhiều nơi như các UI kit (Button, Input, Alert).
3. **Services (`services/api.js`)**: Tập trung logic gọi API để các components không bị dính chặt với Fetch/Axios.
