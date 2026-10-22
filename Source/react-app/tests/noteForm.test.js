import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNote, toUpdatePayload, validateNote } from '../src/utils/noteForm.js';

const validNote = { title: 'Một ghi chú', content: 'Nội dung', category: 'study', status: 'draft' };

test('Dữ liệu hợp lệ có 0 lỗi', () => {
  assert.deepEqual(validateNote(validNote), {});
});

test('Hai trường bắt buộc title/content không được rỗng hoặc toàn dấu cách', () => {
  const errors = validateNote({ ...validNote, title: '  ', content: '' });
  assert.match(errors.title, /không được để trống/);
  assert.match(errors.content, /không được để trống/);
});

test('Tiêu đề vượt 120 ký tự bị báo lỗi', () => {
  assert.ok(validateNote({ ...validNote, title: 'x'.repeat(121) }).title);
});

test('Danh mục và trạng thái không hợp lệ bị báo lỗi', () => {
  const errors = validateNote({ ...validNote, category: 'other', status: 'unknown' });
  assert.ok(errors.category);
  assert.ok(errors.status);
});

test('normalizeNote trả đủ 4 trường, dùng mặc định khi API thiếu field', () => {
  assert.deepEqual(normalizeNote({ title: 'A', content: 'B' }), {
    title: 'A', content: 'B', category: 'study', status: 'draft',
  });
});

test('payload PUT loại khoảng trắng ở đầu/cuối title và content', () => {
  assert.deepEqual(toUpdatePayload({ ...validNote, title: ' A ', content: ' B ' }), {
    title: 'A', content: 'B', category: 'study', status: 'draft',
  });
});
