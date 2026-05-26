# Architecture & Design

## 1. Clean Architecture in NestJS
The project follows Clean Architecture, decoupling business logic from framework and infrastructure.

### Layers

#### 1. Domain (`src/domain`)
- Contains enterprise-wide logic and types.
- Entities: `Job`
- Interfaces: `IJobRepository`

#### 2. Use Cases / Application (`src/application`)
- Contains application-specific business rules.
- Services: `JobService` (Create Job, Get Job, Get User Jobs)

#### 3. Infrastructure (`src/infrastructure`)
- Implementation of external systems.
- **Redis**: Implements `IJobRepository` to store job metadata using Hashes and Lists.
- **BullMQ**: Implements the Queue logic.
- **ComfyUI**: Service to communicate with ComfyUI via HTTP/WebSockets.

#### 4. Delivery / Presentation (`src/delivery`)
- Handles incoming requests.
- Controllers: `JobController` (HTTP REST).

## 2. Redis Strategy (No SQL)
Since we are using 100% Redis:
- **User Job List**: `Set` or `List` at key `user:{username}:jobs` containing job IDs.
- **Job Details**: `Hash` at key `job:{jobId}` storing `type`, `status`, `progress`, `resultUrl`.
- **Queue**: Managed automatically by BullMQ under the hood using Redis.
