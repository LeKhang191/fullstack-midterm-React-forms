# Bộ UI tái sử dụng — TV2 chủ động xây dựng để không chờ TV3

Tất cả components nằm trong `Source/bai2/src/components/ui/` và được export từ `index.js`.

| Component | Props quan trọng | Trách nhiệm |
| --- | --- | --- |
| `InputField` | `label`, `name`, `type`, `value`, `onChange`, `error`, `hint`, `required`, `disabled` | Text input có label, thông báo lỗi, `aria-*` |
| `TextareaField` | `label`, `name`, `rows`, `value`, `onChange`, `error` | Nhiều dòng (ví dụ `content`) |
| `SelectField` | `label`, `name`, `value`, `onChange`, `options`, `error` | Dropdown với options được truyền qua props |
| `Button` | `children`, `type`, `variant`, `disabled`, `loading`, `onClick` | Submit, reset, secondary/link action |
| `FormRow` | `columns`, `children`, `className` | Xếp trường trên 2 cột, tự động 1 cột trên mobile |

## Contract quan trọng

- `value` hoàn toàn do component cha quản lý qua `useState` (**controlled component**).
- `onChange` nhận **DOM change event**, sử dụng `event.target.name` / `event.target.value`; tương thích trang Edit và form lọc TV1.
- `error` phải là chuỗi, ví dụ `"Tiêu đề không được để trống."`. UI tự hiển thị lỗi gần input, có `role=alert`, `aria-invalid` và liên kết label.
- `Button` mặc định `type="button"`, nếu muốn submit thì truyền `type="submit"`.
- `SelectField` nhận `options` là mảng `{ value, label }`.

## Ví dụ copy cho form lọc TV1

```jsx
import { useState } from 'react';
import { InputField, SelectField, Button, FormRow } from '../components/ui/index.js';

export default function ExampleFilter() {
  const [filter, setFilter] = useState({ keyword: '', status: 'all' });
  const onChange = (e) => setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); /* gọi API filter của TV1 */ }}>
      <FormRow>
        <InputField label="Từ khóa" name="keyword" value={filter.keyword} onChange={onChange} />
        <SelectField label="Trạng thái" name="status" value={filter.status} onChange={onChange}
          options={[{ value: 'all', label: 'Tất cả' }, { value: 'done', label: 'Hoàn thành' }]} />
      </FormRow>
      <Button type="submit">Lọc</Button>
      <Button variant="secondary" onClick={() => setFilter({ keyword: '', status: 'all' })}>Reset</Button>
    </form>
  );
}
```

**Phạm vi:** Đây là code component do TV2 tự bổ sung **trong `bai2`**, không phải bài tập riêng của TV3. Muốn dùng chung trong app nhóm, thống nhất đường dẫn/import hoặc chuyển `ui/` sang frontend chung bằng một commit phối hợp sau này. `http://127.0.0.1:5173/ui-demo` là demo ví dụ, không phải Bài 1 hoàn thiện.
