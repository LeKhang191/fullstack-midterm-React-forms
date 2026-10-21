import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { initialNotes } from '../src/data/demoNotes.js';

describe('Bài 1: Kiểm thử logic lọc danh sách và debounce', () => {
  test('Lọc theo keyword: tìm kiếm không phân biệt hoa thường trong title và content', () => {
    const keyword = 'react';
    const filtered = initialNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(keyword.toLowerCase()) ||
        n.content.toLowerCase().includes(keyword.toLowerCase())
    );

    assert.ok(filtered.length > 0, 'Phải tìm thấy ít nhất 1 ghi chú chứa chữ react');
    filtered.forEach((item) => {
      const match =
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword);
      assert.strictEqual(match, true);
    });
  });

  test('Lọc theo status: chỉ trả về các bản ghi đúng trạng thái', () => {
    const targetStatus = 'done';
    const filtered = initialNotes.filter((n) => n.status === targetStatus);

    assert.ok(filtered.length > 0, 'Phải có bản ghi mang trạng thái done');
    filtered.forEach((item) => {
      assert.strictEqual(item.status, targetStatus);
    });
  });

  test('Lọc kết hợp đồng thời cả keyword và status', () => {
    const keyword = 'bài tập';
    const status = 'done';

    const filtered = initialNotes.filter((n) => {
      const matchKw =
        n.title.toLowerCase().includes(keyword.toLowerCase()) ||
        n.content.toLowerCase().includes(keyword.toLowerCase());
      const matchStatus = n.status === status;
      return matchKw && matchStatus;
    });

    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].id, 3);
  });

  test('Logic Debounce: hàm setTimeout chỉ kích hoạt sau đúng khoảng thời gian trễ', async () => {
    let callCount = 0;
    const delay = 100;

    const simulateDebounce = (callback) => {
      return setTimeout(callback, delay);
    };

    let timerId = simulateDebounce(() => {
      callCount++;
    });

    // Giả lập gõ phím tiếp trước khi hết thời gian: xóa timer cũ, đặt timer mới
    clearTimeout(timerId);
    timerId = simulateDebounce(() => {
      callCount++;
    });

    // Đợi 150ms để timer hoàn tất
    await new Promise((resolve) => setTimeout(resolve, 150));

    assert.strictEqual(callCount, 1, 'Debounce chỉ được gọi đúng 1 lần sau khi người dùng ngừng gõ');
  });
});