# Backend Folder Structure (Feature-Driven Clean Architecture)

Để đảm bảo source code dễ maintain và scale (như yêu cầu chia theo feature, chia nhỏ file, và Redis là 1 module riêng), hệ thống Backend (NestJS) sẽ được thiết kế theo **Feature-Driven Clean Architecture**.

## Cấu trúc tổng quan (`src/`)

```bash
src/
├── core/                          # [Core] Các thành phần dùng chung toàn cục
│   ├── config/                    # Module cấu hình (Env variables)
│   ├── exceptions/                # Các class xử lý lỗi chung (Custom Exceptions, Filters)
│   └── utils/                     # Các hàm tiện ích (Helpers)
│
├── infrastructure/                # [Infrastructure] Các module giao tiếp với bên ngoài
│   ├── redis/                     # Redis Module (Chia nhỏ)
│   │   ├── redis.module.ts        # Setup Redis Module
│   │   ├── redis.service.ts       # Cung cấp các hàm get/set/hset cơ bản
│   │   ├── redis.constants.ts     # Các key prefix (ví dụ: 'user:', 'job:')
│   │   └── interfaces/            # Interface riêng của module Redis
│   │
│   └── bullmq/                    # Queue Module chung
│       └── queue.module.ts
│
└── modules/                       # [Modules] Các Feature Modules (Nghiệp vụ lõi)
    └── image-job/                 # Tính năng chính: Quản lý Job tạo ảnh
        ├── image-job.module.ts    # Khởi tạo module
        │
        ├── domain/                # 1. Domain Layer (Thực thể & Giao diện chuẩn)
        │   ├── entities/
        │   │   └── job.entity.ts  # Định nghĩa Job struct
        │   └── repositories/
        │       └── job.repository.interface.ts # Interface chuẩn (không phụ thuộc DB nào)
        │
        ├── application/           # 2. Application Layer (Use Cases - Business Rules)
        │   ├── use-cases/         # Chia nhỏ từng Use Case ra file riêng
        │   │   ├── create-job.usecase.ts
        │   │   ├── get-user-jobs.usecase.ts
        │   │   └── get-job-status.usecase.ts
        │   └── dtos/              # Dữ liệu truyền vào Use Case (không phải của HTTP)
        │
        ├── infrastructure/        # 3. Infrastructure Layer (Implementation cụ thể cho Feature)
        │   ├── repositories/
        │   │   └── redis-job.repository.ts # Cài đặt `job.repository.interface.ts` gọi vào `redis.service.ts`
        │   └── producers/
        │       └── job-queue.producer.ts   # Đẩy job vào BullMQ
        │
        └── delivery/              # 4. Delivery Layer (Tiếp nhận request)
            └── http/
                ├── job.controller.ts       # Controller xử lý HTTP requests
                └── dtos/                   # HTTP DTOs (Data Transfer Object từ Client)
                    ├── create-job.dto.ts
                    └── job-response.dto.ts
```

## Tại sao cấu trúc này tối ưu?

1. **Chia theo Feature (`modules/image-job`)**: Nếu tương lai có thêm feature (như `billing`, `user-profile`), ta chỉ cần tạo thêm folder trong `modules/`, không bị trộn lẫn code.
2. **Redis là một Module riêng biệt (`infrastructure/redis`)**: `redis.service.ts` chỉ đảm nhiệm kết nối và xử lý thao tác db thuần (get/set). Nghiệp vụ (như lưu job ra sao) sẽ nằm ở `redis-job.repository.ts` thuộc feature `image-job`.
3. **Chia nhỏ Use Cases (`application/use-cases`)**: Mỗi API / Nghiệp vụ là 1 file Use Case riêng biệt (ví dụ `create-job.usecase.ts`). Code không bị nhồi nhét vào 1 file Service khổng lồ.
4. **Clean Architecture Chuẩn**: Controller (Delivery) -> Use Case (Application) -> Interface (Domain) <- Repository (Infrastructure). Code nghiệp vụ hoàn toàn không biết nó đang lưu bằng Redis.
