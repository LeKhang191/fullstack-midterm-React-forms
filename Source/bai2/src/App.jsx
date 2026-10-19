import { Navigate, Route, Routes } from 'react-router-dom';
import EditNotePage from './pages/EditNotePage.jsx';
import UiComponentsDemoPage from './pages/UiComponentsDemoPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notes/1/edit" replace />} />
      <Route path="/notes/:id/edit" element={<EditNotePage />} />
      <Route path="/ui-demo" element={<UiComponentsDemoPage />} />
      <Route path="*" element={<Navigate to="/notes/1/edit" replace />} />
    </Routes>
  );
}
