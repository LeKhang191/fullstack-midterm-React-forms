# Báo cáo Bài 1: Filter Form trong React

### 1. Mục tiêu và Kỹ thuật sử dụng
- **Controlled Components**: Form lọc dữ liệu gồm 2 trường (`keyword` và `status`), toàn bộ giá trị và sự kiện thay đổi được quản lý thông qua React State `filters`.
- **Custom Hook `useDebounce`**: Làm trễ quá trình kích hoạt tìm kiếm khi người dùng gõ từ khóa (delay 400ms), tránh việc re-render hoặc gửi request liên tục lên server.
- **Đồng bộ bộ lọc với URL (URLSearchParams)**: Sử dụng hook `useSearchParams` từ `react-router-dom` để đồng bộ trạng thái filter lên query string của trình duyệt (ví dụ: `/?keyword=react&status=in_progress`). Khi người dùng F5 hoặc chia sẻ đường dẫn, bộ lọc vẫn được giữ nguyên.
- **Hành động Submit & Reset**: Nút "Tìm kiếm" kích hoạt tìm kiếm tức thì; nút "Đặt lại (Reset)" xóa toàn bộ filter và đưa danh sách về mặc định.

### 2. Tái sử dụng UI Components (Bài 3)
Form lọc đã tái sử dụng trực tiếp các components từ `src/components/ui`:
- `InputField`: Ô nhập text từ khóa tìm kiếm.
- `SelectField`: Dropdown lựa chọn trạng thái (`draft`, `in_progress`, `done`).
- `Button` và `FormRow`: Định dạng bố cục và nút thao tác.