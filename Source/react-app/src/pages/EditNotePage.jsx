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
      setFetchError('ID must be a positive integer (e.g., 1).');
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
      setSuccess('Note updated successfully! Data has been saved.');
    } catch (error) {
      if (activeIdRef.current !== id) return;
      if (error.fieldErrors && Object.keys(error.fieldErrors).length) {
        setErrors(error.fieldErrors);
      }
      setSubmitError(error.message || 'Failed to save note. Please try again.');
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
      setLookupError('ID must be a positive integer.');
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
              <span className="brand-subtitle">REACT FORMS · EX 2</span>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/ui-demo" className="ui-demo-link">View the shared UI kit →</Link>
            <span className={`mode-pill ${apiMode === 'mock' ? 'mode-pill--mock' : ''}`}>
              <span className="mode-dot" /> {apiMode === 'mock' ? 'Mock REST API' : 'Django API'}
            </span>
          </div>
        </header>

        <main>
          <div className="breadcrumb">Note App<span>/</span>Edit Note</div>
          <div className="page-title-row">
            <div>
              <div className="eyebrow">NOTE MANAGEMENT</div>
              <h1>Edit Note <span className="heading-id">#{id}</span></h1>
              <p className="page-description">Load data by ID, edit with a controlled form, and save via API.</p>
            </div>
            <div className="method-group"><span>GET</span><span>PUT</span></div>
          </div>

          <div className="content-layout">
            <section className="form-card" aria-labelledby="edit-heading">
              <div className="card-heading">
                <div>
                  <h2 id="edit-heading">Note Information</h2>
                  <p>Fields with <span className="required">*</span> are required.</p>
                </div>
                {fetchState === 'ready' && <div className="record-status"><span className="status-dot" /> Data loaded</div>}
              </div>

              {fetchState === 'loading' && (
                <div role="status" className="state-panel">
                  <div className="spinner" aria-hidden="true" />
                  <h3>Loading note...</h3>
                  <p>Calling GET /api/notes/{id}/</p>
                </div>
              )}

              {fetchState === 'error' && (
                <div role="alert" className="state-panel error-panel">
                  <div className="state-icon">!</div>
                  <h3>Cannot load data</h3>
                  <p>{fetchError}</p>
                  <Button variant="secondary" onClick={() => setRetry((current) => current + 1)}>Try again</Button>
                </div>
              )}

              {fetchState === 'ready' && (
                <form onSubmit={handleSave} noValidate>
                  {success && <div role="status" className="alert alert-success">✓ {success}</div>}
                  {submitError && <div role="alert" className="alert alert-error">{submitError}</div>}
                  <InputField label="Title" name="title" value={form.title}
                    onChange={changeField} error={errors.title} disabled={saving} required
                    maxLength={121} placeholder="Enter note title"
                    hint="Short and concise, maximum 120 characters." />
                  <TextareaField label="Content" name="content" value={form.content}
                    onChange={changeField} error={errors.content} disabled={saving} required
                    maxLength={2001} placeholder="Enter note content" rows={6}
                    hint="Must not be empty, maximum 2,000 characters." />
                  <FormRow columns={2}>
                    <SelectField label="Category" name="category" value={form.category}
                      onChange={changeField} error={errors.category} disabled={saving}
                      options={CATEGORY_OPTIONS} />
                    <SelectField label="Status" name="status" value={form.status}
                      onChange={changeField} error={errors.status} disabled={saving}
                      options={STATUS_OPTIONS} />
                  </FormRow>
                  <div className="form-footer">
                    <div className="save-note">{isDirty ? '● There are unsaved changes' : '✓ No unsaved changes'}</div>
                    <div className="button-row">
                      <Button variant="secondary" disabled={saving || !isDirty} onClick={resetForm}>Revert</Button>
                      <Button type="submit" loading={saving} loadingText="Saving...">Save Changes</Button>
                    </div>
                  </div>
                </form>
              )}
            </section>

            <aside className="sidebar">
              <div className="side-card">
                <div className="side-icon">↗</div>
                <h3>Move to record</h3>
                <p>Enter the ID of the note you want to edit.</p>
                <form className="lookup-form" onSubmit={handleNavigate} noValidate>
                  <InputField label="Note ID" name="lookupId" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="e.g., 2" value={lookupId} disabled={saving}
                    onChange={(event) => { setLookupId(event.target.value); setLookupError(''); }} error={lookupError} />
                  <Button type="submit" disabled={saving}>Open</Button>
                </form>
                {apiMode === 'mock' && <p className="example-ids">Sample data: <Button variant="link" disabled={saving} onClick={() => navigate('/notes/1/edit')}>#1</Button> <Button variant="link" disabled={saving} onClick={() => navigate('/notes/2/edit')}>#2</Button> <Button variant="link" disabled={saving} onClick={() => navigate('/notes/3/edit')}>#3</Button></p>}
              </div>
              <div className="side-card">
                <h3>Operation Process</h3>
                <ol className="steps-list">
                  <li><span>01</span> GET data by ID</li>
                  <li><span>02</span> Fill data into form</li>
                  <li><span>03</span> Validate title &amp; content</li>
                  <li><span>04</span> PUT update via API</li>
                  <li><span>05</span> Display result</li>
                </ol>
              </div>
              <div className="side-tip">
                <strong>Connection Information</strong>
                <span>{apiMode === 'mock' ? 'Using HTTP Mock REST API, saving sample data to .mock-data/notes.json.' : 'Vite proxy forwards /api/* to Django on port 8000.'}</span>
                {updatedAt && <span>Last updated: {new Date(updatedAt).toLocaleString('vi-VN')}</span>}
              </div>
            </aside>
          </div>
        </main>
        <footer className="site-footer">SEMINAR · REACT FORMS</footer>
      </div>
    </div>
  );
}
