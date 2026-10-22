import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputField, SelectField, Button, FormRow } from '../components/ui/index.js';

const FILTER_STATUSES = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'in_progress', label: 'Đang thực hiện' },
  { value: 'done', label: 'Hoàn thành' },
];


export default function UiComponentsDemoPage() {
  const [filters, setFilters] = useState({ keyword: '', status: 'all' });
  const [applied, setApplied] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFilters((old) => ({ ...old, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setApplied({ ...filters, keyword: filters.keyword.trim() });
  }

  function handleClear() {
    setFilters({ keyword: '', status: 'all' });
    setApplied(null);
  }

  return (
    <div className="app-shell">
      <div className="page-container">
        <header className="site-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">UI</span>
            <div><span className="brand-name">Bộ UI dùng chung</span><span className="brand-subtitle">REACT FORMS · TÁI SỬ DỤNG COMPONENTS</span></div>
          </div>
          <Link className="ui-demo-link" to="/notes/1/edit">← Quay lại Edit Page</Link>
        </header>
        <main>
          <div className="breadcrumb">Thành viên 2 <span>/</span> Minh họa dùng lại Components</div>
          <div className="page-title-row">
            <div>
              <div className="eyebrow">COMPONENT LIBRARY</div>
              <h1>InputField · SelectField · Button · FormRow</h1>
              <p className="page-description">Đây là ví dụ sử dụng bộ UI chung cho form lọc. Đây không phải trang Bài 1 của TV1.</p>
            </div>
          </div>
          <div className="demo-grid">
            <section className="form-card" aria-labelledby="demo-title">
              <div className="card-heading"><div><h2 id="demo-title">Ví dụ: giao diện Filter Form</h2><p>Chỉ minh họa việc tái sử dụng, không gọi API danh sách.</p></div></div>
              <form onSubmit={handleSubmit}>
                <FormRow columns={2}>
                  <InputField label="Từ khóa" name="keyword" value={filters.keyword} onChange={handleChange} placeholder="Tìm ghi chú..." hint="Controlled input với state của React." />
                  <SelectField label="Trạng thái" name="status" value={filters.status} onChange={handleChange} options={FILTER_STATUSES} hint="Controlled select dùng options truyền qua props." />
                </FormRow>
                <div className="button-row demo-actions">
                  <Button type="submit">Áp dụng</Button>
                  <Button variant="secondary" onClick={handleClear}>Xóa lọc</Button>
                </div>
                <div className="demo-result" role="status">
                  <strong>Trạng thái submit:</strong>
                  {applied ? (
                    <pre>{JSON.stringify(applied, null, 2)}</pre>
                  ) : <p>Chưa có bộ lọc được gửi. Hãy nhập từ khóa và bấm Áp dụng.</p>}
                </div>
              </form>
            </section>
            <aside className="side-card demo-explainer">
              <h3>Cùng component, khác nghiệp vụ</h3>
              <p><strong>Edit Page (TV2)</strong> đang sử dụng InputField, TextareaField, SelectField, Button và FormRow để tải/điều chỉnh dữ liệu qua GET/PUT.</p>
              <p><strong>Filter Form (TV1)</strong> có thể import lại InputField, SelectField, Button và FormRow, nhưng cần tự bổ sung API lọc, URL sync và debounce theo đề.</p>
              <p>Không có code nào trong thư mục của TV1 hay TV3 bị thay đổi.</p>
              <Link to="/notes/1/edit" className="ui-demo-link">Xem trang Edit hoàn chỉnh →</Link>
            </aside>
          </div>
        </main>
        <footer className="site-footer">SEMINAR · REACT FORMS · TV2 / COMPONENT DEMO</footer>
      </div>
    </div>
  );
}
