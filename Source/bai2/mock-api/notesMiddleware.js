/**
 * Mock REST API for TV2 only. Uses a JSON file on disk for demo persistence.
 * It is mounted by Vite in DEV/PREVIEW mode and does not modify Django.
 * Supported endpoints: GET, PUT /api/notes/:id/
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { initialNotes } from '../src/data/demoNotes.js';
import { validateNote } from '../src/utils/noteForm.js';

function sendJson(response, statusCode, data, extraHeaders = {}) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  response.end(JSON.stringify(data));
}

function readNotes(dataFile) {
  try {
    const stored = JSON.parse(readFileSync(dataFile, 'utf8'));
    if (Array.isArray(stored)) return stored;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  // Seed once: restarting Vite will not erase the previous demo update.
  const seeded = structuredClone(initialNotes);
  saveNotes(dataFile, seeded);
  return seeded;
}

function saveNotes(dataFile, notes) {
  mkdirSync(dirname(dataFile), { recursive: true });
  writeFileSync(dataFile, JSON.stringify(notes, null, 2) + '\n', 'utf8');
}

async function readJsonBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk.toString('utf8');
    if (Buffer.byteLength(body, 'utf8') > 64 * 1024) {
      const error = new Error('Dữ liệu gửi lên quá lớn.');
      error.status = 413;
      throw error;
    }
  }
  try {
    const result = JSON.parse(body);
    if (!result || Array.isArray(result) || typeof result !== 'object') throw Error();
    return result;
  } catch {
    const error = new Error('JSON không hợp lệ.');
    error.status = 400;
    throw error;
  }
}

export function createNotesMiddleware({ dataFile, latencyMs = 200 }) {
  if (!dataFile) throw new Error('dataFile is required');

  return async function notesMiddleware(request, response, next = () => {}) {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const match = /^\/api\/notes\/([1-9]\d*)\/?$/.exec(pathname);
    if (!match) return next();

    if (request.method !== 'GET' && request.method !== 'PUT') {
      return sendJson(response, 405, { detail: 'Chỉ hỗ trợ GET và PUT.' }, { Allow: 'GET, PUT' });
    }

    try {
      if (latencyMs > 0) await new Promise((resolve) => setTimeout(resolve, latencyMs));
      const notes = readNotes(dataFile);
      const index = notes.findIndex((note) => String(note.id) === match[1]);
      if (index === -1) {
        return sendJson(response, 404, { detail: `Không tìm thấy ghi chú ID ${match[1]}.` });
      }

      if (request.method === 'GET') {
        return sendJson(response, 200, notes[index]);
      }

      const payload = await readJsonBody(request);
      const fieldErrors = validateNote(payload);
      if (Object.keys(fieldErrors).length) {
        const errors = Object.fromEntries(
          Object.entries(fieldErrors).map(([field, message]) => [field, [message]]),
        );
        return sendJson(response, 400, { detail: 'Dữ liệu không hợp lệ.', ...errors });
      }

      const updatedNote = {
        ...notes[index],
        title: payload.title.trim(),
        content: payload.content.trim(),
        category: payload.category,
        status: payload.status,
        updated_at: new Date().toISOString(),
      };
      notes[index] = updatedNote;
      saveNotes(dataFile, notes);
      return sendJson(response, 200, updatedNote);
    } catch (error) {
      const status = error.status || 500;
      return sendJson(response, status, {
        detail: status === 500 ? 'Lỗi máy chủ mock API.' : error.message,
      });
    }
  };
}
