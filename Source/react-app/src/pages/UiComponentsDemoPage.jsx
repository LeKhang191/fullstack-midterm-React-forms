import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputField, TextareaField, SelectField, Button, FormRow } from '../components/ui/index.js';
import { CATEGORY_OPTIONS, STATUS_OPTIONS, validateNote } from '../utils/noteForm.js';

const FILTER_STATUSES = [{ value: 'all', label: 'Tất cả trạng thái' }, ...STATUS_OPTIONS];
const EMPTY_FILTER = { keyword: '', status: 'all' };
const SAMPLE_NOTE = { title: 'Kiểm thử Django API', content: 'Viết test cho endpoint notes.', category: 'study', status: 'draft' };

const BEFORE = `<div className="field">
  <label htmlFor="title">Tiêu đề *</label>
  <input id="title" name="title" value={form.title}
    onChange={onChange} aria-invalid={!!errors.title}
    aria-describedby="title-error" />
  {errors.title && (
    <small id="title-error" role="alert"
      className="field-error">{errors.title}</small>
  )}
</div>
{/* ...lặp lại cho từng ô, ở cả form lọc lẫn form edit */}`;
const AFTER = `<InputField label="Tiêu đề" name="title"
  value={form.title} onChange={onChange}
  error={errors.title} required />`;
const lines = (s) => s.split('\n').length;

const COMPONENTS = {
  input: { name: 'InputField', label: 'Tiêu đề', Tag: InputField },
  textarea: { name: 'TextareaField', label: 'Nội dung', Tag: TextareaField },
  select: { name: 'SelectField', label: 'Trạng thái', Tag: SelectField },
  button: { name: 'Button', label: 'Lưu thay đổi', Tag: Button },
};

const PROPS = [
  ['InputField', [
    ['label', 'string', 'có', '—', '"Tiêu đề"'], ['name', 'string', 'có', '—', '"title"'],
    ['value', 'string', 'có', '—', 'form.title'], ['onChange', 'function(event)', 'có', '—', 'onChange'],
    ['type', 'string', 'không', '"text"', '"email"'], ['error', 'string', 'không', '""', 'errors.title'],
    ['hint', 'string', 'không', '""', '"Tối đa 120 ký tự"'], ['required / disabled', 'boolean', 'không', 'false', 'required'],
  ]],
  ['TextareaField', [
    ['(như InputField)', '—', '—', '—', 'label, name, value, onChange, error, hint'], ['rows', 'number', 'không', '5', 'rows={6}'],
  ]],
  ['SelectField', [
    ['options', '{ value, label, disabled? }[]', 'có', '[]', 'STATUS_OPTIONS'], ['(như InputField)', '—', '—', '—', 'label, name, value, onChange, error'],
  ]],
  ['Button', [
    ['type', '"button" | "submit"', 'không', '"button"', 'type="submit"'], ['variant', '"primary" | "secondary" | "link"', 'không', '"primary"', 'variant="secondary"'],
    ['loading / loadingText', 'boolean / string', 'không', 'false / "Đang xử lý..."', 'loading={saving}'], ['disabled, onClick', 'boolean, function', 'không', 'false', 'disabled'],
  ]],
  ['FormRow', [['columns', '1 | 2', 'không', '2', 'columns={2}'], ['children', 'node', 'có', '—', '<InputField /> <SelectField />']]],
];

const WHY = [
  ['Controlled component', 'value nằm trong useState của component cha, onChange cập nhật state. Component con chỉ hiển thị, nên cha luôn biết giá trị hiện tại để validate hoặc gửi API.'],
  ['FieldBase dùng chung', 'Input, Textarea và Select chỉ khác thẻ HTML. Nhãn, hint, lỗi và aria nằm một chỗ trong FieldBase, sửa một lần là cả bộ cùng đổi.'],
  ['onChange nhận DOM event', 'Cha dùng event.target.name và event.target.value, nên một hàm xử lý được cho mọi ô. Form lọc và form edit dùng cùng cách viết.'],
  ['Button mặc định type="button"', 'Nút trong thẻ form mà không khai báo type sẽ tự submit. Mặc định là button, muốn gửi form thì truyền type="submit" một cách có chủ đích.'],
];

function Tagged({ name, children }) {
  return <div className="tagged"><span className="comp-tag">{name}</span>{children}</div>;
}

function Playground() {
  const [kind, setKind] = useState('input');
  const [flags, setFlags] = useState({ error: false, disabled: false, required: false, hint: false, loading: false });
  const [values, setValues] = useState({ input: '', textarea: '', select: 'draft' });
  const { name, label, Tag } = COMPONENTS[kind];
  const toggle = (key) => setFlags((f) => ({ ...f, [key]: !f[key] }));
  const available = kind === 'button' ? ['disabled', 'loading'] : ['error', 'disabled', 'required', 'hint'];

  const props = kind === 'button' ? {} : { label, name: 'demo' };
  const code = [`<${name}`, `  label="${label}"`];
  if (kind === 'button') {
    if (flags.loading) code.push('  loading loadingText="Đang lưu..."');
    if (flags.disabled) code.push('  disabled');
    code.push('>', `  ${label}`, `</${name}>`);
  } else {
    Object.assign(props, {
      value: values[kind], onChange: (e) => setValues((v) => ({ ...v, [kind]: e.target.value })),
      disabled: flags.disabled, required: flags.required,
      error: flags.error ? 'Trường này không hợp lệ.' : '', hint: flags.hint ? 'Đây là dòng gợi ý.' : '',
    });
    code.push('  name="demo"', '  value={value} onChange={onChange}');
    if (kind === 'select') { props.options = STATUS_OPTIONS; code.push('  options={STATUS_OPTIONS}'); }
    if (kind === 'textarea') props.rows = 3;
    if (flags.error) code.push('  error="Trường này không hợp lệ."');
    if (flags.hint) code.push('  hint="Đây là dòng gợi ý."');
    if (flags.required) code.push('  required');
    if (flags.disabled) code.push('  disabled');
    code.push('/>');
  }
  if (kind === 'button') Object.assign(props, { disabled: flags.disabled, loading: flags.loading, loadingText: 'Đang lưu...' });

  return (
    <section className="form-card state-card" aria-label="Playground">
      <div className="pg-tabs" role="tablist">
        {Object.entries(COMPONENTS).map(([key, c]) => (
          <button key={key} role="tab" aria-selected={kind === key} type="button"
            className={`pg-tab ${kind === key ? 'pg-tab--on' : ''}`} onClick={() => setKind(key)}>{c.name}</button>
        ))}
      </div>
      <div className="pg-body">
        <div>
          <div className="pg-toggles">
            {available.map((key) => (
              <label key={key} className="pg-toggle"><input type="checkbox" checked={flags[key]} onChange={() => toggle(key)} /> {key}</label>
            ))}
          </div>
          <div className="pg-preview"><Tag {...props}>{kind === 'button' ? label : undefined}</Tag></div>
          <p className="demo-hint">Gõ hoặc chọn thật trong ô xem trước; bật/tắt props để xem component phản ứng.</p>
        </div>
        <pre className="code-block" aria-label="Mã JSX tương ứng">{code.join('\n')}</pre>
      </div>
    </section>
  );
}

export default function UiComponentsDemoPage() {
  const [filters, setFilters] = useState(EMPTY_FILTER);
  const [applied, setApplied] = useState(null);
  const [note, setNote] = useState(SAMPLE_NOTE);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [mobile, setMobile] = useState(false);

  const onFilterChange = (e) => setFilters((old) => ({ ...old, [e.target.name]: e.target.value }));
  const onNoteChange = (e) => {
    const { name, value } = e.target;
    setNote((old) => ({ ...old, [name]: value }));
    setErrors((old) => ({ ...old, [name]: undefined }));
    setSaved('');
  };
  const submitFilter = (e) => { e.preventDefault(); setApplied({ ...filters, keyword: filters.keyword.trim() }); };
  const resetFilter = () => { setFilters(EMPTY_FILTER); setApplied(null); };
  function submitNote(e) {
    e.preventDefault();
    const found = validateNote(note);
    setErrors(found);
    setSaved('');
    if (Object.keys(found).length) return;
    setSaving(true); // simulated request: this page never calls an API
    setTimeout(() => { setSaving(false); setSaved('Dữ liệu hợp lệ, đã giả lập lưu thành công.'); }, 700);
  }

  return (
    <div className="app-shell">
      <div className="page-container">
        <header className="site-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">UI</span>
            <div><span className="brand-name">Bộ UI dùng chung</span><span className="brand-subtitle">REACT FORMS · BÀI 3 · TÁI SỬ DỤNG COMPONENTS</span></div>
          </div>
          <Link className="ui-demo-link" to="/notes/1/edit">← Quay lại Edit Page</Link>
        </header>
        <main>
          <div className="breadcrumb">Bài 3 <span>/</span> UI Components Showcase</div>
          <div className="page-title-row"><div>
            <div className="eyebrow">COMPONENT LIBRARY</div>
            <h1>Tách component, dùng lại ở nhiều form</h1>
            <p className="page-description">Thay vì mỗi form tự viết nhãn, ô nhập, thông báo lỗi và nút, nhóm gom phần lặp lại vào 5 component. Form lọc và form edit dùng chung bộ này.</p>
          </div></div>

          <div className="flow" aria-label="Sơ đồ tái sử dụng">
            <div className="flow-kit">{['InputField', 'TextareaField', 'SelectField', 'Button', 'FormRow'].map((c) => <span key={c} className="comp-tag">{c}</span>)}</div>
            <span className="flow-arrow" aria-hidden="true">→</span>
            <div className="flow-targets"><span>Form lọc</span><span>Form edit</span></div>
          </div>

          <h2 className="showcase-title">1. Playground: thử từng component</h2>
          <Playground />

          <div className="title-row">
            <h2 className="showcase-title">2. Hai form chạy thật bằng cùng một bộ component</h2>
            <div className="pg-tabs" role="group" aria-label="Kích thước khung">
              <button type="button" className={`pg-tab ${!mobile ? 'pg-tab--on' : ''}`} onClick={() => setMobile(false)}>Desktop</button>
              <button type="button" className={`pg-tab ${mobile ? 'pg-tab--on' : ''}`} onClick={() => setMobile(true)}>Mobile</button>
            </div>
          </div>
          <div className={`demo-frame ${mobile ? 'demo-frame--mobile' : ''}`}>
            <div className="showcase-grid">
              <section className="form-card" aria-labelledby="filter-title">
                <div className="card-heading"><div><h2 id="filter-title">Form lọc</h2><p>Không gọi API; chỉ hiện giá trị submit.</p></div></div>
                <form onSubmit={submitFilter}>
                  <FormRow columns={2}>
                    <Tagged name="InputField"><InputField label="Từ khóa" name="keyword" value={filters.keyword} onChange={onFilterChange} placeholder="Tìm ghi chú..." /></Tagged>
                    <Tagged name="SelectField"><SelectField label="Trạng thái" name="status" value={filters.status} onChange={onFilterChange} options={FILTER_STATUSES} /></Tagged>
                  </FormRow>
                  <div className="button-row demo-actions">
                    <Button type="submit">Áp dụng</Button>
                    <Button variant="secondary" onClick={resetFilter}>Reset</Button>
                  </div>
                  <div className="demo-result" role="status">
                    <strong>State hiện tại:</strong><pre>{JSON.stringify(filters, null, 2)}</pre>
                    <strong>Đã áp dụng:</strong>
                    {applied ? <pre>{JSON.stringify(applied, null, 2)}</pre> : <p>Chưa bấm Áp dụng.</p>}
                  </div>
                </form>
              </section>
              <section className="form-card" aria-labelledby="edit-demo-title">
                <div className="card-heading"><div><h2 id="edit-demo-title">Form edit</h2><p>Validate title và content, giả lập lưu.</p></div></div>
                <form onSubmit={submitNote} noValidate>
                  {saved && <div role="status" className="alert alert-success">✓ {saved}</div>}
                  <Tagged name="InputField"><InputField label="Tiêu đề" name="title" value={note.title} onChange={onNoteChange} error={errors.title} disabled={saving} required /></Tagged>
                  <Tagged name="TextareaField"><TextareaField label="Nội dung" name="content" rows={3} value={note.content} onChange={onNoteChange} error={errors.content} disabled={saving} required /></Tagged>
                  <FormRow columns={2}>
                    <Tagged name="SelectField"><SelectField label="Danh mục" name="category" value={note.category} onChange={onNoteChange} options={CATEGORY_OPTIONS} disabled={saving} /></Tagged>
                    <Tagged name="SelectField"><SelectField label="Trạng thái" name="status" value={note.status} onChange={onNoteChange} options={STATUS_OPTIONS} disabled={saving} /></Tagged>
                  </FormRow>
                  <div className="button-row demo-actions">
                    <Button variant="secondary" disabled={saving} onClick={() => { setNote(SAMPLE_NOTE); setErrors({}); setSaved(''); }}>Đặt lại</Button>
                    <Button type="submit" loading={saving} loadingText="Đang lưu...">Lưu thay đổi</Button>
                  </div>
                  <div className="demo-result" role="status">
                    <strong>validateNote() ngay lúc này:</strong><pre>{JSON.stringify(validateNote(note), null, 2)}</pre>
                  </div>
                </form>
              </section>
            </div>
          </div>

          <h2 className="showcase-title">3. Trước và sau khi tách</h2>
          <div className="showcase-grid">
            <section className="form-card state-card"><h3 className="state-label">Trước: viết thô ({lines(BEFORE)} dòng cho 1 ô)</h3><pre className="code-block">{BEFORE}</pre></section>
            <section className="form-card state-card"><h3 className="state-label">Sau: dùng component ({lines(AFTER)} dòng cho 1 ô)</h3><pre className="code-block">{AFTER}</pre>
              <p className="props-note">Form edit có 4 trường, form lọc có 2 ô; nếu viết thô, đoạn code thứ nhất phải lặp lại 6 lần. Logic hiển thị lỗi và aria chỉ còn nằm ở <code>FieldBase.jsx</code>.</p></section>
          </div>

          <h2 className="showcase-title">4. Props của từng component</h2>
          <section className="form-card props-card" aria-label="Bảng props"><div className="props-scroll">
            <table className="props-table">
              <thead><tr><th>Component</th><th>Prop</th><th>Kiểu</th><th>Bắt buộc</th><th>Mặc định</th><th>Ví dụ</th></tr></thead>
              <tbody>{PROPS.flatMap(([comp, rows]) => rows.map((r, i) => (
                <tr key={comp + r[0]}>{i === 0 ? <td rowSpan={rows.length}><code>{comp}</code></td> : null}
                  <td><code>{r[0]}</code></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td></tr>
              )))}</tbody>
            </table></div>
          </section>

          <h2 className="showcase-title">5. Vì sao thiết kế như vậy</h2>
          <div className="why-grid">{WHY.map(([title, text]) => <section key={title} className="side-card"><h3>{title}</h3><p>{text}</p></section>)}</div>
        </main>
        <footer className="site-footer">SEMINAR · REACT FORMS · BÀI 3 / COMPONENT SHOWCASE</footer>
      </div>
    </div>
  );
}
