import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import NoteFilterForm from '../components/NoteFilterForm.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { getNotes } from '../services/notesApi.js';

const DEFAULT_FILTERS = { keyword: '', status: '' };

export default function NoteListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
  });

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedKeyword = useDebounce(filters.keyword, 400);

  const fetchData = useCallback(async (searchFilter) => {
    setLoading(true);
    try {
      const data = await getNotes(searchFilter);
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = {};
    if (debouncedKeyword) params.keyword = debouncedKeyword;
    if (filters.status) params.status = filters.status;

    setSearchParams(params);
    fetchData({ keyword: debouncedKeyword, status: filters.status });
  }, [debouncedKeyword, filters.status, setSearchParams, fetchData]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData({ keyword: filters.keyword, status: filters.status });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '24px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2>Note List</h2>
          <p style={{ color: '#64748b', margin: '4px 0 0' }}>Filter data by keyword and status (Exercise 1)</p>
        </div>
        <Link to="/ui-demo" style={{ fontSize: '14px', color: '#2563eb' }}>
          View the shared UI kit (Exercise 3) →
        </Link>
      </div>

      <NoteFilterForm
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onSubmit={handleSubmit}
      />

      {loading ? (
        <p>Loading list...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Title</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.length > 0 ? (
              notes.map((note) => (
                <tr key={note.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px' }}>#{note.id}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{note.title}</td>
                  <td style={{ padding: '12px' }}>{note.category}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor:
                          note.status === 'done'
                            ? '#dcfce7'
                            : note.status === 'in_progress'
                            ? '#fef9c3'
                            : '#f1f5f9',
                        color:
                          note.status === 'done'
                            ? '#15803d'
                            : note.status === 'in_progress'
                            ? '#854d0e'
                            : '#475569',
                      }}
                    >
                      {note.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {/* Trỏ đúng theo route /notes/:id/edit của EditNotePage */}
                    <Link
                      to={`/notes/${note.id}/edit`}
                      style={{
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      Edit Note (Ex 2) →
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No notes found matching the filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}