# HƯỚNG DẪN TV2 — EDIT PAGE + UI COMPONENTS HOÀN CHỈNH

## 1. Phạm vi làm việc

- Chỉ cần thư mục **`Source/bai2`**.
- Không cần chờ TV3: bộ InputField, TextareaField, SelectField, Button, FormRow đã có trong `src/components/ui/`.
- Không sửa code `Source/bai1`, `Source/bai3` và `Source/mini-app`.
- Bài 2 dùng HTTP **Mock REST API**, backend Django thật của nhóm hiện **chưa có** `/api/notes/:id/`.

## 2. Chạy trên Windows

Mở Terminal tại thư mục gốc repository và thực hiện:

```powershell
cd Source\bai2
node -v
npm install
npm run dev
```

Truy cập:

- Trang bài 2: http://127.0.0.1:5173/notes/1/edit
- Trang demo tái sử dụng UI: http://127.0.0.1:5173/ui-demo

`npm test`: unit test validation + mock HTTP API. `npm run build`: build React/Vite.

## 3. Các file thuộc TV2

| File | Mục đích |
| --- | --- |
| `src/pages/EditNotePage.jsx` | Get note, controlled form, state loading/error, validate, PUT, success |
| `src/services/notesApi.js` | GET, PUT bằng fetch; xử lý lỗi API |
| `src/utils/noteForm.js` | `validateNote`, `normalizeNote`, `toUpdatePayload` |
| `src/components/ui/FieldBase.jsx` | Nhãn, hint, error, aria cho các trường |
| `src/components/ui/InputField.jsx` | Trường text controlled |
| `src/components/ui/TextareaField.jsx` | Nhập nội dung nhiều dòng |
| `src/components/ui/SelectField.jsx` | Select có options qua props |
| `src/components/ui/Button.jsx` | Submit, undo, retry, disabled/loading |
| `src/components/ui/FormRow.jsx` | 2 cột responsive |
| `src/pages/UiComponentsDemoPage.jsx` | Demo **reuse** cùng bộ UI trong một form lọc minh họa (không thay bài TV1) |
| `mock-api/notesMiddleware.js` | GET/PUT HTTP mock khi Django chưa có API Notes |
| `README.md` | Hướng dẫn API contract, test, tích hợp backend |

## 4. Kịch bản demo 7 phút

1. (1 phút) Nêu yêu cầu Bài 2: Edit theo ID, GET, 4 trường, validate 2 trường, PUT, xử lý lỗi.
2. (1 phút) Mở `/notes/1/edit`: GET 200, dữ liệu đổ vào 4 input, giải thích `useEffect` + `useState`.
3. (1 phút) Xóa Tiêu đề/Nội dung và submit: 2 error, không gửi PUT.
4. (1 phút) Nhập lại và lưu: Network có PUT 200, UI hiển thị thành công và refresh vẫn lưu.
5. (1 phút) Mở `/notes/999/edit`: trạng thái 404; bấm retry; nhập lại ID 2.
6. (1 phút) Vào `/ui-demo`: chứng minh InputField, SelectField, Button và FormRow tái sử dụng với một form lọc minh họa.
7. (1 phút) Mở 5 file trong `components/ui`, giải thích props và cơ chế controlled components; kết thúc bằng giới hạn mock vs Django.

## 5. Checklist trước khi nộp

- [ ] `npm install` chạy thành công trên máy của bạn.
- [ ] `npm test` tất cả test pass.
- [ ] `npm run build` không báo lỗi.
- [ ] GET ID 1 điền sẵn 4 trường, Network GET 200.
- [ ] Xóa 2 trường bắt buộc -> thấy 2 lỗi, không có PUT.
- [ ] PUT cập nhật ID 1 thành công; reload còn dữ liệu đã lưu.
- [ ] GET ID 999 -> lỗi 404; nhấn Thử tải lại.
- [ ] `ui-demo` có 2 tiêu chí keyword/status và nút Áp dụng/Xóa lọc.
- [ ] Chụp ảnh Desktop và Mobile, chụp Network GET/PUT, code UI props.
- [ ] Phần trình bày nêu rõ đây là mock API, chưa tích hợp Django thực tế.

## 6. Lý thuyết TV2 cần giải thích

- **Controlled components:** `value` phụ thuộc `useState`; khi gõ `onChange` gọi `setForm`, React render lại input.
- **GET lúc mở trang:** `useEffect` gọi `getNote(id)`; state `loading/error/ready` quyết định UI.
- **Validate:** `validateNote(form)` kiểm tra `title`, `content` rỗng và options hợp lệ trước khi gọi API.
- **PUT:** `updateNote(id, toUpdatePayload(form))` gửi JSON, mock/Django trả kết quả rồi cập nhật state.
- **Component reuse:** mỗi field nhận `label/name/value/onChange/error`; logic nằm ở trang cha, UI chung là thành phần trình bày. `FormRow` chịu trách nhiệm layout responsive, `Button` gói variants/loading.
- **Khác nhau Mock API và Django:** cả hai dùng HTTP GET/PUT, nhưng mock Vite lưu JSON để demo; Django là API backend thật, cần thống nhất schema và auth/CSRF.

## 7. Chuyển sang Django sau khi nhóm làm xong

Tạo `.env.local` trong `Source/bai2`:

```env
VITE_API_MODE=django
```

Chạy Django trên `localhost:8000`, khởi động lại `npm run dev`. Backend phải cung cấp `GET /api/notes/<id>/`, `PUT /api/notes/<id>/` và các trường `title`, `content`, `category`, `status`. Django chưa có API này thì chế độ django sẽ trả 404, không phải lỗi của UI Components.
