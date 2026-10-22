# TV2 — React Forms, Bài tập 2 (Edit Page)

> **Phạm vi:** Toàn bộ code do TV2 thực hiện nằm trong `Source/bai2/`. Không cần chỉnh sửa `Source/bai1/`, `Source/bai3/`, `Source/mini-app/` của nhóm. Dự án có thể chạy **ngay cả khi Django mới có endpoint /health**.

## 1. Đề bài và cách đáp ứng

| Đề bài | Nơi thực hiện |
|---|---|
| Edit bản ghi theo ID | React route `/notes/:id/edit`, `src/pages/EditNotePage.jsx` |
| Khi mở trang gọi GET detail, dữ liệu điền sẵn | `useEffect` và `getNote`, controlled React state |
| Tối thiểu 4 trường | `title`, `content`, `category`, `status` |
| Validate không rỗng 2 trường | `validateNote`: `title`, `content`; kèm độ dài/option |
| Loading/error/404 | Các trạng thái `loading`, `error`, `ready`, nút thử lại |
| Submit cập nhật | `updateNote`: **HTTP PUT** `/api/notes/:id/` |
| Thông báo kết quả và cập nhật UI | `setForm`, `setOriginal`, thông báo thành công |
| UI Components tái sử dụng | `src/components/ui/` có InputField, TextareaField, SelectField, Button, FormRow; đã dùng trong Edit Page và trang demo |

## 2. Chạy trên Windows trong VS Code (không cần Django)

Yêu cầu: **Node.js 20+** cùng npm (khuyến nghị bản LTS).

1. Giải nén ZIP, mở VS Code tại thư mục gốc dự án (`fullstack-midterm-django-notes`).
2. Chọn **Terminal > New Terminal** và chạy:

   ```powershell
   cd Source\bai2
   npm install
   npm run dev
   ```

3. Mở URL Vite thông báo trong terminal, thông thường **http://127.0.0.1:5173/**; ứng dụng điều hướng tới `/notes/1/edit`.
4. **Mặc định sử dụng HTTP mock REST API** tại chính cổng của Vite, KHÔNG cần bật Django hay chạy Python.
5. Các bản ghi mẫu có **ID 1, 2, 3**. Gõ ID **999** để minh họa lỗi HTTP 404.

> Chỉ cần giải nén **gói bổ sung TV2** vào root repository là đủ. Nếu tải **gói cả project**, mở tại `Source/bai2` như trên.

## 3. GET/PUT thật qua HTTP trong chế độ demo

Vite cài đặt một middleware mock cho endpoint:

| Method | URL | Kết quả |
|---|---|---|
| GET | `/api/notes/1/` | 200 + JSON chi tiết ghi chú |
| GET | `/api/notes/999/` | 404 + JSON lỗi |
| PUT | `/api/notes/1/` | 200 + bản ghi sau khi cập nhật |
| PUT | `/api/notes/1/` (thiếu title/content) | 400 + lỗi từng trường |

Trong trình duyệt nhấn **F12 > Network > Fetch/XHR** để kiểm tra request **GET**, **PUT**, response và HTTP status.

Middleware demo: `mock-api/notesMiddleware.js` chạy trong Vite. Dữ liệu được lưu tại **`Source/bai2/.mock-data/notes.json`** (tự tạo khi chạy). Nhờ vậy **refresh trình duyệt vẫn thấy dữ liệu PUT đã lưu**. Muốn khôi phục 3 bản ghi mẫu: dừng Vite, xóa thư mục `.mock-data`, rồi chạy `npm run dev` lại.

**Lưu ý trung thực khi thuyết trình:** Các request GET/PUT trong demo là HTTP thật, nhưng server nhận request **là mock API của Vite, không phải backend Django**. Django của nhóm hiện chưa có endpoint notes.

## 4. Chuyển sang Django khi backend hoàn thiện

Khi nhóm đã thực sự xây dựng Django API và có dữ liệu mẫu, tạo `Source/bai2/.env.local` (bên cạnh `package.json`):

```env
VITE_API_MODE=django
```

Chạy Django tại `http://127.0.0.1:8000`, khởi động lại Vite. Lúc này Vite **tắt mock API** và chuyển mọi request `/api/*` sang cổng 8000.

Yêu cầu giao kèo dữ liệu để TV1/TV3 phối hợp:

- `GET /api/notes/<id>/` trả HTTP 200 + object JSON `id`, `title`, `content`, `category`, `status`, tùy chọn `updated_at`.
- `PUT /api/notes/<id>/` nhận object gồm đúng 4 trường trên, trả HTTP 200 + bản ghi đã cập nhật.
- ID không tồn tại trả 404 JSON `{ "detail": "..." }`.
- Form lỗi trả 400 JSON có khóa `title` hoặc `content` chứa chuỗi hoặc mảng message (DRF format).
- `title`: không rỗng, <=120 ký tự; `content`: không rỗng, <=2000 ký tự.
- `category`: `study`, `project`, `personal`; `status`: `draft`, `in_progress`, `done`.

Ví dụ response:

```json
{
  "id": 1,
  "title": "Chuẩn bị seminar React Forms",
  "content": "Hoàn thiện trang Edit",
  "category": "study",
  "status": "in_progress",
  "updated_at": "2026-10-19T09:30:00Z"
}
```

Nếu nhóm quyết định dùng các tên trường/giá trị khác, cập nhật `src/utils/noteForm.js` và API contract với Django. Nếu Django yêu cầu CSRF/session authentication, team backend cần thống nhất cookie/header/xác thực; proxy **không** tự giải quyết CSRF. Khi chưa có API, bật mode django sẽ gây lỗi 404/không kết nối, không có nghĩa frontend bị hỏng.

## 5. Đường dẫn và trách nhiệm file

```text
Source/bai2/
├── .env.example                   # Mẫu cấu hình backend
├── .gitignore                     # Bỏ qua build, node_modules, mock data
├── README.md                      # File này + hướng dẫn TV2
├── index.html                     # Root element cho React
├── package.json                   # Scripts + React/Vite deps
├── vite.config.js                 # Proxy Django hoặc mount mock API
├── mock-api/
│   └── notesMiddleware.js         # REST GET/PUT mock chạy HTTP
├── src/
│   ├── main.jsx                   # Mount React, BrowserRouter
│   ├── App.jsx                    # Route /notes/:id/edit
│   ├── styles.css                 # CSS responsive
│   ├── components/ui/              # InputField, SelectField, Button, FormRow + TextareaField
│   ├── components/FormControls.jsx # Cầu nối tương thích cho code TV2 cũ
│   ├── data/demoNotes.js          # 3 bản ghi mặc định
│   ├── pages/EditNotePage.jsx     # useEffect/load/validate/PUT/UI
│   ├── pages/UiComponentsDemoPage.jsx # Minh họa reuse cho form lọc
│   ├── services/notesApi.js       # Fetch HTTP + xử lý error/status
│   └── utils/noteForm.js          # Normalize, validation, PUT payload
└── tests/
    ├── noteForm.test.js           # Validation & payload test
    └── mockApiHttp.test.js        # GET/PUT 200, 400, 404, 405
```

## 6. Kiểm thử và kịch bản demo

```powershell
npm test
npm run build
```

| Demo | Thao tác | Kết quả mong đợi |
|---|---|---|
| 1. GET và load | Mở `/notes/1/edit`, bật tab Network | GET trả 200; 4 trường có dữ liệu |
| 2. Validate | Xóa `title`, `content`, bấm Lưu | Hiện 2 thông báo không được để trống, không gọi PUT |
| 3. Submit | Điền lại, đổi danh mục/trạng thái, bấm Lưu | PUT trả 200; thông báo thành công |
| 4. Persistence | Refresh trang | GET trả dữ liệu đã cập nhật từ file JSON |
| 5. 404 | Mở ID 999 | GET trả 404 và màn hình lỗi |
| 6. Undo | Sửa form, chọn Hoàn tác | Quay về giá trị đã lưu trước đó |

## 7. Cách giải thích khi vấn đáp

- **Controlled form:** `value={form.title}` và `onChange` cập nhật state bằng `setForm`.
- **GET tại sao trong `useEffect`:** chạy khi `id` thay đổi, tránh gọi API sau mỗi lần render; `AbortController` ngăn kết quả fetch cũ ghi đè khi chuyển ID nhanh.
- **Tại sao validate cả frontend và backend:** frontend giúp người dùng sửa ngay, backend phải bảo vệ dữ liệu và trả HTTP 400 nếu request sai.
- **Tại sao PUT:** cập nhật bản ghi đầy đủ 4 trường. Nếu API của nhóm hỗ trợ PATCH thì thay method theo contract thực tế.
- **`original` và `form`:** `original` giữ dữ liệu sau GET/PUT; `form` thay đổi theo thao tác, dùng cho nút Hoàn tác.
- **Mock khác backend thật:** mock server dùng HTTP nhưng lưu JSON nội bộ; khi Django được hoàn thiện, thay cấu hình để thử tích hợp thực tế.

## 8. TV2 đã tự hoàn thành phần UI đang chờ TV3

Không còn phụ thuộc vào TV3 để chạy Bài 2: TV2 hiện có bộ components dùng chung tại `src/components/ui/`:

- **InputField**: label, controlled text input, hint, validation/error, disabled, aria-describedby.
- **TextareaField**: form nhiều dòng, reuse cùng field shell và label/error.
- **SelectField**: controlled dropdown, options qua props, validation/error.
- **Button**: `type`, `variant`, trạng thái `disabled`/`loading`; mặc định `type=button` tránh submit nhầm.
- **FormRow**: layout 2 cột responsive, trên mobile tự thu thành 1 cột.

**Trang Edit** đang dùng cả 5 components trên; **trang minh họa Filter Form** tại `http://127.0.0.1:5173/ui-demo` dùng lại InputField + SelectField + Button + FormRow, có state, submit/reset tại local; đây **chỉ là minh họa khả năng tái sử dụng**, không phải Bài 1 hoàn chỉnh của TV1 (chưa có GET List/filter thực tế). Tài liệu props, ví dụ copy cho TV1: `src/components/ui/README.md`.

Mọi file mới và thay đổi vẫn chỉ nằm trong `Source/bai2`. Chưa tạo app UI chung cho cả nhóm, cũng chưa chỉnh thư mục TV3. Khi TV3 xuất bản bộ UI nhóm, chỉ cần thống nhất interface props hoặc chuyển `ui/` sang frontend tích hợp và sửa import.

## 9. Demo bộ UI và chụp ảnh báo cáo

1. Trang `/notes/1/edit`: chụp GET data + 4 trường controlled component, lỗi validate sau khi xóa 2 trường, request PUT 200 trong Network và thông báo lưu thành công.
2. Trang `/ui-demo`: chụp form demo filter dùng lại 4 UI components: nhập keyword, đổi status, Áp dụng / Xóa lọc và khung hiển thị state.
3. Chụp responsive bằng DevTools (F12 > Toggle device toolbar), width 375px: 2 selects xếp dọc, buttons vẫn tương tác được.
4. Mở `src/components/ui/` trong VS Code để giảng viên thấy props và API reusable. Nói rõ TV2 chủ động thêm để bỏ phụ thuộc TV3.

### Lưu ý về kiểm thử

`npm test` chạy **Node.js unit + mock HTTP integration tests** (không cần npm install). Kiểm tra cấu trúc JSX đã làm riêng trước khi đóng gói, nhưng **chưa chạy được `npm run build` và kiểm thử UI trên trình duyệt ở môi trường tạo gói** vì không truy cập được registry npm. Bạn cần `npm install`, `npm run build` trên máy và kiểm tra UI thủ công. Không tuyên bố là đã tích hợp với Django khi backend nhóm chưa triển khai API Notes.
