# Frontend Design & UI/UX

*Tài liệu này định hình phong cách thiết kế của ứng dụng web, được trích xuất từ UI Sena Stats và mở rộng thêm Dark Mode.*

## 1. Phân tích UI Gốc (Light Mode)

Dựa trên hình ảnh tham khảo, chúng ta có các quy tắc styling cụ thể sau:

### 1.1 Bảng Màu (Color Palette)
- **Background ngoài cùng**: Xanh lá trầm (Sage Green / Olive) - khoảng `bg-[#87a06a]` hoặc tương đương.
- **Background Container chính**: Trắng hơi xám (Off-white) - `bg-[#f8f9fa]`.
- **Background Card (Thường)**: Trắng tinh `bg-white`.
- **Text Chính (Tiêu đề, Số liệu)**: Xanh đen đậm (Dark Slate) - `text-slate-800` (`#1e293b`).
- **Text Phụ (Subtitle)**: Xám nhạt - `text-slate-400`.
- **Màu Brand / Accent (SENA STATS)**: Vàng cam nổi bật - `text-amber-500`.
- **Màu Card Nổi Bật (Solid Cards)**:
  - Thẻ Xanh lá (Đang online): `bg-lime-500`
  - Thẻ Vàng (Hoàn thành): `bg-amber-400`
  - Thẻ Cam Đỏ (Tỷ lệ xong): `bg-orange-500`

### 1.2 Công thức Bo Góc (Border Radius)
Hệ thống sử dụng các đường cong rất mềm mại và hiện đại:
- **Container lớn nhất**: Bo góc rất to, khoảng `rounded-[32px]` (2rem).
- **Thẻ Card / Chart**: Bo góc vừa, khoảng `rounded-2xl` (16px).
- **Nút bấm / Badge (Live, Cấu hình)**: Bo góc tròn hoàn toàn (Pill shape) - `rounded-full`.
- **Icon Box bên trong Card**: Bo góc nhẹ hơn một chút - `rounded-xl`.

### 1.3 Đổ Bóng (Shadows)
- Bóng đổ rất mềm và rộng, đặc biệt dưới các thẻ màu. Dùng Tailwind: `shadow-xl shadow-lime-500/20` (bóng có ánh màu tương ứng với card) hoặc `shadow-sm` cho card trắng.

---

## 2. Sinh ra Dark Mode (Tự động suy luận)

Để giữ nguyên bản sắc bo góc và màu accent nhưng không gây chói mắt vào ban đêm, công thức chuyển đổi Dark Mode như sau:

### 2.1 Bảng Màu Dark Mode
- **Background ngoài cùng**: Đen sâu (Deep Black) - `bg-slate-950` (`#020617`).
- **Background Container chính**: Xám đen (Dark Slate) - `bg-slate-900` (`#0f172a`).
- **Background Card (Thường)**: Xám sáng hơn một chút để tạo độ nổi (Elevated) - `bg-slate-800` (`#1e293b`).
- **Text Chính (Tiêu đề, Số liệu)**: Trắng sáng - `text-slate-50` (`#f8fafc`).
- **Text Phụ (Subtitle)**: Xám trung tính - `text-slate-400` (`#94a3b8`).
- **Màu Brand / Accent**: Vẫn giữ Vàng cam - `text-amber-400`.
- **Màu Card Nổi Bật (Solid Cards)**:
  - *Quy tắc*: Ở Dark Mode, mảng màu quá chóe sẽ làm nhức mắt. Ta sẽ đổi các thẻ này thành **Nền xám đậm (`bg-slate-800`)** nhưng có **Border sáng màu và Chữ sáng màu**.
  - Thẻ Xanh lá: `border border-lime-500 text-lime-400`.
  - Thẻ Vàng: `border border-amber-400 text-amber-400`.
  - Thẻ Cam Đỏ: `border border-orange-500 text-orange-400`.
  - *(Hoặc tùy chọn 2: Vẫn giữ nền màu nhưng giảm Opacity xuống 20%: `bg-lime-500/20 text-lime-400`).*

### 2.2 Công thức Bo Góc & Shadow (Dark Mode)
- **Bo góc**: Giữ nguyên toàn bộ cấu trúc `rounded-[32px]`, `rounded-2xl`, `rounded-full` của Light Mode.
- **Shadow**: Bóng đổ trong Dark Mode rất khó thấy. Thay vì dùng shadow, ta sử dụng **Viền siêu mỏng (Subtle Borders)** để phân tách các lớp: `border border-slate-800` cho các thẻ bình thường.

---

## 3. Áp dụng vào Ứng dụng Image Generation

Giao diện Web App sắp tới sẽ bám sát bộ quy tắc này:
1. **Layout**: Container chính bo góc cực lớn, bọc giữa màn hình (giống iPad view).
2. **Theme Toggle**: Sử dụng Zustand lưu trạng thái `theme: 'light' | 'dark'`. 
3. **Màn hình Generate**:
   - Khung nhập Prompt hoặc vùng Upload Ảnh sẽ dùng style Card (nền Trắng/Xám đậm, bo `2xl`).
   - Nút "Generate" dùng màu Brand (Vàng/Cam) hoặc Xanh lá, bo `rounded-full`.
4. **Thanh Progress Bar (Real-time)**:
   - Màu thanh chạy: Gradient từ Vàng sang Cam `bg-gradient-to-r from-amber-400 to-orange-500`.
   - Text step chạy realtime: `text-slate-500` (Light) hoặc `text-slate-400` (Dark).
