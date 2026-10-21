import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNotesMiddleware } from '../mock-api/notesMiddleware.js';

async function withServer(run) {
  const directory = mkdtempSync(join(tmpdir(), 'tv2-mock-rest-'));
  const server = createServer(createNotesMiddleware({ dataFile: join(directory, 'notes.json'), latencyMs: 0 }));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;
  try {
    await run(base);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    rmSync(directory, { recursive: true, force: true });
  }
}

const validNote = {
  title: 'Đã cập nhật', content: 'Nội dung chỉnh sửa', category: 'project', status: 'done',
};

test('GET /api/notes/1/ trả 200 và 4 trường', async () => withServer(async (base) => {
  const response = await fetch(`${base}/api/notes/1/`);
  assert.equal(response.status, 200);
  const note = await response.json();
  assert.equal(note.id, 1);
  for (const field of ['title', 'content', 'category', 'status']) assert.ok(note[field]);
}));

test('PUT trả 200 và GET lần sau phản ánh dữ liệu đã lưu', async () => withServer(async (base) => {
  const updated = await fetch(`${base}/api/notes/2/`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(validNote),
  });
  assert.equal(updated.status, 200);
  assert.equal((await updated.json()).title, validNote.title);
  const next = await fetch(`${base}/api/notes/2/`);
  const note = await next.json();
  assert.equal(note.content, validNote.content);
  assert.equal(note.status, 'done');
}));

test('GET ID không tồn tại -> 404', async () => withServer(async (base) => {
  const response = await fetch(`${base}/api/notes/999/`);
  assert.equal(response.status, 404);
  assert.ok((await response.json()).detail);
}));

test('PUT thiếu title/content -> 400 với lỗi từng trường', async () => withServer(async (base) => {
  const response = await fetch(`${base}/api/notes/1/`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...validNote, title: ' ', content: '' }),
  });
  assert.equal(response.status, 400);
  const data = await response.json();
  assert.ok(data.title[0]);
  assert.ok(data.content[0]);
}));

test('PUT body không phải JSON -> 400', async () => withServer(async (base) => {
  const response = await fetch(`${base}/api/notes/1/`, { method: 'PUT', body: '{invalid}' });
  assert.equal(response.status, 400);
}));

test('POST /api/notes/1/ -> 405', async () => withServer(async (base) => {
  const response = await fetch(`${base}/api/notes/1/`, { method: 'POST' });
  assert.equal(response.status, 405);
}));
