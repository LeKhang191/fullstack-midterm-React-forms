import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import NoteListPage from './pages/NoteListPage.jsx';
import EditNotePage from './pages/EditNotePage.jsx';
import UiComponentsDemoPage from './pages/UiComponentsDemoPage.jsx';

export default function App() {
  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#ffffff' : '#94a3b8',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 400,
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <div>
      <nav
        style={{
          padding: '12px 24px',
          backgroundColor: '#0f172a',
          color: '#fff',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <NavLink to="/" style={navLinkStyle}>
          [Bài 1] Danh sách &amp; Lọc
        </NavLink>
        <NavLink to="/notes/1/edit" style={navLinkStyle}>
          [Bài 2] Chỉnh sửa Note (#1)
        </NavLink>
        <NavLink to="/ui-demo" style={navLinkStyle}>
          [Bài 3] UI Components Showcase
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<NoteListPage />} />
        <Route path="/notes/:id/edit" element={<EditNotePage />} />
        <Route path="/edit/:id" element={<Navigate to="/notes/:id/edit" replace />} />
        <Route path="/ui-demo" element={<UiComponentsDemoPage />} />
      </Routes>
    </div>
  );
}