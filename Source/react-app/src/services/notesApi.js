import { initialNotes } from '../data/demoNotes.js';

export const apiMode = import.meta.env.VITE_API_MODE === 'django' ? 'django' : 'mock';

export class ApiError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function requestNote(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Không kết nối được API. Kiểm tra server và cấu hình VITE_API_MODE.');
  }

  let data = {};
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError('API không trả về JSON hợp lệ. Kiểm tra URL backend.', response.status);
    }
  }

  if (!response.ok) {
    const fieldErrors = {};
    for (const field of ['title', 'content', 'category', 'status']) {
      if (data[field]) {
        fieldErrors[field] = Array.isArray(data[field]) ? data[field].join(' ') : String(data[field]);
      }
    }
    const detail =
      data.detail ||
      data.message ||
      (response.status === 404 ? 'Không tìm thấy bản ghi.' : `HTTP ${response.status}.`);
    throw new ApiError(String(detail), response.status, fieldErrors);
  }
  return data;
}

export function getNote(id, { signal } = {}) {
  return requestNote(`/api/notes/${encodeURIComponent(id)}/`, { signal });
}

export function updateNote(id, payload) {
  return requestNote(`/api/notes/${encodeURIComponent(id)}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getNotes(filters = {}, { signal } = {}) {
  const query = new URLSearchParams();
  if (filters.keyword) query.set('keyword', filters.keyword);
  if (filters.status) query.set('status', filters.status);

  const queryString = query.toString() ? `?${query.toString()}` : '';

  try {
    return await requestNote(`/api/notes/${queryString}`, { signal });
  } catch (error) {
    let notes = [...initialNotes];
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      notes = notes.filter(
        (n) => n.title.toLowerCase().includes(kw) || n.content.toLowerCase().includes(kw)
      );
    }
    if (filters.status) {
      notes = notes.filter((n) => n.status === filters.status);
    }
    return notes;
  }
}