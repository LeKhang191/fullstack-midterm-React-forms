# Báo cáo Bài 2: Trang Chỉnh sửa (Edit Page) và Xử lý Form trong React

### 1. Mục tiêu bài tập
Xây dựng trang Edit cho một bản ghi theo `id` từ URL, thực hiện đầy đủ luồng:
**Load dữ liệu ban đầu $\rightarrow$ Chỉnh sửa $\rightarrow$ Validate $\rightarrow$ Gọi API cập nhật $\rightarrow$ Cập nhật UI & thông báo.**

---

### 2. Chi tiết triển khai kỹ thuật

#### a. Tải dữ liệu ban đầu (Load Data)
- **Định tuyến:** Lấy tham số `id` từ URL bằng hook `useParams()` theo route `/notes/:id/edit`.
- **Kiểm tra hợp lệ ID:** Dùng regex `/^[1-9]\d*$/` để đảm bảo ID là số nguyên dương trước khi gửi request.
- **Quản lý trạng thái tải (`fetchState`):**
  - `'loading'`: Hiển thị spinner cùng thông báo `Đang gọi GET /api/notes/:id/`.
  - `'error'`: Hiển thị thông báo lỗi `fetchError` nếu bản ghi không tồn tại hoặc mất mạng; hỗ trợ nút "Thử tải lại" (`setRetry`).
  - `'ready'`: Nạp dữ liệu qua hàm `normalizeNote(note)` vào state `form` và `original`.
- **Hủy request cũ:** Sử dụng `AbortController` để hủy API call dở dang khi chuyển ID liên tục hoặc component unmount.

#### b. Form chỉnh sửa (Tối thiểu 4 trường dữ liệu)
Toàn bộ form là **Controlled Component** quản lý bởi state `form`, sử dụng UI Components từ Bài 3:
1. **Tiêu đề (`title`)**: Sử dụng `InputField`, bắt buộc nhập, giới hạn tối đa 120 ký tự.
2. **Nội dung (`content`)**: Sử dụng `TextareaField`, bắt buộc nhập, giới hạn tối đa 2.000 ký tự.
3. **Danh mục (`category`)**: Sử dụng `SelectField` với `CATEGORY_OPTIONS` (`study`, `project`, `personal`).
4. **Trạng thái (`status`)**: Sử dụng `SelectField` với `STATUS_OPTIONS` (`draft`, `in_progress`, `done`).

#### c. Validation dữ liệu (`utils/noteForm.js`)
- Hàm `validateNote(form)` kiểm tra các quy tắc:
  - Bắt buộc "không rỗng" sau khi `.trim()` cho 2 trường `title` và `content`.
  - Giới hạn độ dài chuỗi ký tự.
  - Kiểm tra tính hợp lệ của `category` và `status` so với danh sách cho phép.
- Trả về object lỗi `errors`, hiển thị thông báo lỗi đỏ ngay dưới từng trường tương ứng.

#### d. Gửi dữ liệu cập nhật (API Integration)
- Xử lý qua hàm `handleSave`:
  - Chuyển `saving = true` để disable toàn bộ ô nhập và hiển thị trạng thái nút `"Đang cập nhật..."`.
  - Chuẩn hóa payload bằng hàm `toUpdatePayload(form)`.
  - Gọi API `updateNote(id, payload)` (phương thức `PUT`).
  - Sử dụng `activeIdRef` để tránh ghi đè dữ liệu nếu người dùng đổi URL trong lúc request đang gửi.
  - **Thành công:** Cập nhật lại state `original`, hiển thị thông báo alert xanh: `"Cập nhật ghi chú thành công!"`.
  - **Lỗi:** Bắt lỗi qua `try...catch`, ánh xạ `fieldErrors` từ server trả về form.

#### e. Tính năng phụ trợ
- **Nhận diện thay đổi (`isDirty`):** Tự động phát hiện khi form có thay đổi so với bản gốc để bật/tắt nút "Hoàn tác" (`resetForm`).
- **Sidebar chuyển bản ghi:** Hỗ trợ form nhập nhanh ID để chuyển sang ghi chú khác ngay trên giao diện.

---

### 3. Tái sử dụng UI Components (Bài 3)
Trang Edit import trực tiếp các component dùng chung từ `components/ui/index.js`:
- `InputField`, `TextareaField`, `SelectField`, `Button`, `FormRow`.