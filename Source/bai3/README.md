# Báo cáo Bài 3: Tách và Tái sử dụng UI Components

### 1. Danh sách Components đã tách (`src/components/ui/`)
- **`InputField`**: Wrapper cho thẻ `<input>`, nhận các props `label`, `name`, `type`, `value`, `onChange`, `error`, `required`.
- **`SelectField`**: Wrapper cho thẻ `<select>`, nhận props `options` (danh sách `{ value, label }`), `value`, `onChange`, `error`.
- **`TextareaField`**: Hỗ trợ nhập liệu văn bản nhiều dòng cho form Edit.
- **`Button`**: Nút thao tác hỗ trợ các variant `primary`, `secondary`, và trạng thái loading.
- **`FormRow`**: Quản lý layout hàng ngang/dọc cho các control.

### 2. Tính tái sử dụng trong hệ thống
Các component trên đều kế thừa từ base component `FieldBase`, đảm bảo tính nhất quán về giao diện (gồm nhãn label, trường input/select, và thông báo lỗi validation màu đỏ bên dưới).
- **Áp dụng tại Bài 1**: Được sử dụng trong `NoteFilterForm.jsx` để tạo ô tìm kiếm và dropdown chọn trạng thái.
- **Áp dụng tại Bài 2**: Được sử dụng trong `EditNotePage.jsx` để hiển thị và chỉnh sửa 4 trường dữ liệu của Note.
- **Trang Demo**: Có thể truy cập route `/demo-ui` để xem toàn bộ biến thể và trạng thái của các component.