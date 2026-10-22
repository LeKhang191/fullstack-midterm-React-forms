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
            <div><span className="brand-name">Shared UI Components</span><span className="brand-subtitle">REACT FORMS · REUSE COMPONENTS</span></div>
          </div>
          <Link className="ui-demo-link" to="/notes/1/edit">← Return to Edit Page</Link>
        </header>
        <main>
          <div className="breadcrumb">Member 2 <span>/</span> Demo: Reusing Components</div>
          <div className="page-title-row">
            <div>
              <div className="eyebrow">COMPONENT LIBRARY</div>
              <h1>InputField · SelectField · Button · FormRow</h1>
              <p className="page-description">This is a demo of using shared UI components for a filter form. This is not the first exercise page.</p>
            </div>
          </div>
          <div className="demo-grid">
            <section className="form-card" aria-labelledby="demo-title">
              <div className="card-heading"><div><h2 id="demo-title">Demo: Filter Form Interface</h2><p>This only demonstrates reusing components, it doesn't call the API to fetch the list.</p></div></div>
              <form onSubmit={handleSubmit}>
                <FormRow columns={2}>
                  <InputField label="Keyword" name="keyword" value={filters.keyword} onChange={handleChange} placeholder="Search notes..." hint="Controlled input với state của React." />
                  <SelectField label="Status" name="status" value={filters.status} onChange={handleChange} options={FILTER_STATUSES} hint="Controlled select dùng options truyền qua props." />
                </FormRow>
                <div className="button-row demo-actions">
                  <Button type="submit">Apply</Button>
                  <Button variant="secondary" onClick={handleClear}>Clear Filter</Button>
                </div>
                <div className="demo-result" role="status">
                  <strong>Submit Status:</strong>
                  {applied ? (
                    <pre>{JSON.stringify(applied, null, 2)}</pre>
                  ) : <p>No filter applied. Please enter a keyword and click Apply.</p>}
                </div>
              </form>
            </section>
            <aside className="side-card demo-explainer">
              <h3>Same component, different use cases</h3>
              <p><strong>Edit Page</strong> uses InputField, TextareaField, SelectField, Button, and FormRow to load/adjust data via GET/PUT.</p>
              <p><strong>Filter Form</strong> can import the same components, but needs to add the filtering API, URL synchronization, and debounce functionality as required.</p>
              <p>No code in the directories of mem1 or mem3 has been modified.</p>
              <Link to="/notes/1/edit" className="ui-demo-link">View complete Edit page →</Link>
            </aside>
          </div>
        </main>
        <footer className="site-footer">SEMINAR · REACT FORMS</footer>
      </div>
    </div>
  );
}
