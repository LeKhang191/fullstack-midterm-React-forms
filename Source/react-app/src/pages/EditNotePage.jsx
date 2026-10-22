import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiMode, getNote, updateNote } from '../services/notesApi.js';
import { InputField, TextareaField, SelectField, Button, FormRow } from '../components/ui/index.js';
import {
  CATEGORY_OPTIONS, STATUS_OPTIONS, normalizeNote,
  toUpdatePayload, validateNote,
} from '../utils/noteForm.js';

const EMPTY_FORM = { title: '', content: '', category: 'study', status: 'draft' };

export default function EditNotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lookupId, setLookupId] = useState(id || '');
  const [lookupError, setLookupError] = useState('');
  const activeIdRef = useRef(id);
  const [form, setForm] = useState(EMPTY_FORM);
  const [original, setOriginal] = useState(EMPTY_FORM);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [errors, setErrors] = useState({});
  const [fetchState, setFetchState] = useState('loading');
  const [fetchError, setFetchError] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');
  const [retry, setRetry] = useState(0);

  const idIsValid = /^[1-9]\d*$/.test(id);
  const isDirty = JSON.stringify(form) !== JSON.stringify(original);

  useEffect(() => { setLookupId(id || ''); setLookupError(''); activeIdRef.current = id; }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    setFetchState('loading');
    setFetchError('');
    setSuccess('');
    setSubmitError('');
    setErrors({});
    setSaving(false);

    if (!idIsValid) {
      setFetchError('ID phải là số nguyên dương (ví dụ: 1).');
      setFetchState('error');
      return () => controller.abort();
    }

    getNote(id, { signal: controller.signal })
      .then((note) => {
        if (controller.signal.aborted) return;
        const normalized = normalizeNote(note);
        setForm(normalized);
        setOriginal(normalized);
        setUpdatedAt(note.updated_at || null);
        setFetchState('ready');
      })
      .catch((error) => {
        if (controller.signal.aborted || error.name === 'AbortError') return;
        setFetchError(error.message);
        setFetchState('error');
      });

    return () => controller.abort();
  }, [id, retry, idIsValid]);

  function changeField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSuccess('');
    setSubmitError('');
  }

  function resetForm() {
    setForm({ ...original });
    setErrors({});
    setSuccess('');
    setSubmitError('');
  }

  async function handleSave(event) {
    event.preventDefault();
    if (fetchState !== 'ready' || saving) return;
    setSuccess('');
    setSubmitError('');
    const validationErrors = validateNote(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    try {
      const result = await updateNote(id, toUpdatePayload(form));
      if (activeIdRef.current !== id) return; 
      const normalized = normalizeNote(result);
      setForm(normalized);
      setOriginal(normalized);
      setUpdatedAt(result.updated_at || null);
      setErrors({});
      setSuccess('Cập nhật ghi chú thành công! Dữ liệu đã được lưu.');
    } catch (error) {
      if (activeIdRef.current !== id) return;
      if (error.fieldErrors && Object.keys(error.fieldErrors).length) {
        setErrors(error.fieldErrors);
      }
      setSubmitError(error.message || 'Không lưu được ghi chú. Vui lòng thử lại.');
    } finally {
      if (activeIdRef.current === id) setSaving(false);
    }
  }

  function handleNavigate(event) {
    event.preventDefault();
    const next = lookupId.trim();
    if (saving) return;
    if (/^[1-9]\d*$/.test(next)) {
      setLookupError('');
      navigate(`/notes/${next}/edit`);
    } else {
      setLookupError('ID phải là số nguyên dương.');
    }
  }

  return (
    <div className="app-shell">
      <div className="page-container">
        <header className="site-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">N</span>
            <div>
              <span className="brand-name">Notes Workspace</span>
              <span className="brand-subtitle">REACT FORMS · BÀI TẬP 02</span>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/ui-demo" className="ui-demo-link">Xem bộ UI dùng chung →</Link>
            <span className={`mode-pill ${apiMode === 'mock' ? 'mode-pill--mock' : ''}`}>
              <span className="mode-dot" /> {apiMode === 'mock' ? 'Mock REST API' : 'Django API'}
            </span>
          </div>
        </header>

        <main>
          <div className="breadcrumb">Ứng dụng ghi chú <span>/</span> Chỉnh sửa ghi chú</div>
          <div className="page-title-row">
            <div>
              <div className="eyebrow">QUẢN LÝ GHI CHÚ</div>
              <h1>Chỉnh sửa ghi chú <span className="heading-id">#{id}</span></h1>
              <p className="page-description">Tải dữ liệu theo ID, chỉnh sửa bằng controlled form và lưu qua API.</p>
            </div>
            <div className="method-group"><span>GET</span><span>PUT</span></div>
          </div>

          <div className="content-layout">
            <section className="form-card" aria-labelledby="edit-heading">
              <div className="card-heading">
                <div>
                  <h2 id="edit-heading">Thông tin ghi chú</h2>
                  <p>Trường có dấu <span className="required">*</span> là bắt buộc.</p>
                </div>
                {fetchState === 'ready' && <div className="record-status"><span className="status-dot" /> Đã tải dữ liệu</div>}
              </div>

              {fetchState === 'loading' && (
                <div role="status" className="state-panel">
                  <div className="spinner" aria-hidden="true" />
                  <h3>Đang tải ghi chú...</h3>
                  <p>Đang gọi GET /api/notes/{id}/</p>
                </div>
              )}

              {fetchState === 'error' && (
                <div role="alert" className="state-panel error-panel">
                  <div className="state-icon">!</div>
                  <h3>Không thể tải dữ liệu</h3>
                  <p>{fetchError}</p>
                  <Button variant="secondary" onClick={() => setRetry((current) => current + 1)}>Thử tải lại</Button>
                </div>
              )}

              {fetchState === 'ready' && (
                <form onSubmit={handleSave} noValidate>
                  {success && <div role="status" className="alert alert-success">✓ {success}</div>}
                  {submitError && <div role="alert" className="alert alert-error">{submitError}</div>}
                  <InputField label="Tiêu đề" name="title" value={form.title}
                    onChange={changeField} error={errors.title} disabled={saving} required
                    maxLength={121} placeholder="Nhập tiêu đề ghi chú"
                    hint="Tiêu đề ngắn gọn, tối đa 120 ký tự." />
                  <TextareaField label="Nội dung" name="content" value={form.content}
                    onChange={changeField} error={errors.content} disabled={saving} required
                    maxLength={2001} placeholder="Nhập nội dung ghi chú" rows={6}
                    hint="Không được để trống, tối đa 2.000 ký tự." />
                  <FormRow columns={2}>
                    <SelectField label="Danh mục" name="category" value={form.category}
                      onChange={changeField} error={errors.category} disabled={saving}
                      options={CATEGORY_OPTIONS} />
                    <SelectField label="Trạng thái" name="status" value={form.status}
                      onChange={changeField} error={errors.status} disabled={saving}
                      options={STATUS_OPTIONS} />
                  </FormRow>
                  <div className="form-footer">
                    <div className="save-note">{isDirty ? '● Có thay đổi chưa lưu' : '✓ Không có thay đổi chưa lưu'}</div>
                    <div className="button-row">
                      <Button variant="secondary" disabled={saving || !isDirty} onClick={resetForm}>Hoàn tác</Button>
                      <Button type="submit" loading={saving} loadingText="Đang cập nhật...">Lưu thay đổi</Button>
                    </div>
                  </div>
                </form>
              )}
            </section>

            <aside className="sidebar">
              <div className="side-card">
                <div className="side-icon">↗</div>
                <h3>Chuyển đến bản ghi</h3>
                <p>Nhập ID của ghi chú bạn muốn chỉnh sửa.</p>
                <form className="lookup-form" onSubmit={handleNavigate} noValidate>
                  <InputField label="ID ghi chú" name="lookupId" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Ví dụ: 2" value={lookupId} disabled={saving}
                    onChange={(event) => { setLookupId(event.target.value); setLookupError(''); }} error={lookupError} />
                  <Button type="submit" disabled={saving}>Mở</Button>
                </form>
                {apiMode === 'mock' && <p className="example-ids">Dữ liệu mẫu: <Button variant="link" disabled={saving} onClick={() => navigate('/notes/1/edit')}>#1</Button> <Button variant="link" disabled={saving} onClick={() => navigate('/notes/2/edit')}>#2</Button> <Button variant="link" disabled={saving} onClick={() => navigate('/notes/3/edit')}>#3</Button></p>}
              </div>
              <div className="side-card">
                <h3>Quy trình hoạt động</h3>
                <ol className="steps-list">
                  <li><span>01</span> GET dữ liệu theo ID</li>
                  <li><span>02</span> Điền dữ liệu vào form</li>
                  <li><span>03</span> Validate title &amp; content</li>
                  <li><span>04</span> PUT cập nhật qua API</li>
                  <li><span>05</span> Hiển thị kết quả</li>
                </ol>
              </div>
              <div className="side-tip">
                <strong>Thông tin kết nối</strong>
                <span>{apiMode === 'mock' ? 'Đang dùng HTTP Mock REST API, lưu dữ liệu mẫu vào .mock-data/notes.json.' : 'Vite proxy chuyển /api/* đến Django cổng 8000.'}</span>
                {updatedAt && <span>Cập nhật lần cuối: {new Date(updatedAt).toLocaleString('vi-VN')}</span>}
              </div>
            </aside>
          </div>
        </main>
        <footer className="site-footer">SEMINAR · REACT FORMS · TV2 / EDIT PAGE</footer>
      </div>
    </div>
  );
}
