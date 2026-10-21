import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { InputField, SelectField, Button } from '../components/ui/index.js';

describe('Bài 3: Auto-Test UI Components tái sử dụng', () => {
  it('InputField render đúng nhãn label, placeholder và hiển thị lỗi màu đỏ', () => {
    render(
      <InputField
        label="Tiêu đề"
        name="title"
        value=""
        onChange={() => {}}
        placeholder="Nhập ghi chú"
        error="Tiêu đề không được để trống."
      />
    );

    // Kiểm tra label và placeholder
    expect(screen.getByText('Tiêu đề')).toBeDefined();
    expect(screen.getByPlaceholderText('Nhập ghi chú')).toBeDefined();

    // Kiểm tra thông báo lỗi validation
    expect(screen.getByText('Tiêu đề không được để trống.')).toBeDefined();
  });

  it('SelectField render đủ danh sách options truyền qua props', () => {
    const options = [
      { value: 'draft', label: 'Bản nháp' },
      { value: 'done', label: 'Hoàn thành' },
    ];

    render(
      <SelectField
        label="Trạng thái"
        name="status"
        value="draft"
        onChange={() => {}}
        options={options}
      />
    );

    expect(screen.getByText('Bản nháp')).toBeDefined();
    expect(screen.getByText('Hoàn thành')).toBeDefined();
  });

  it('Button hiển thị trạng thái loading text và disabled khi submitting', () => {
    render(
      <Button loading={true} loadingText="Đang lưu dữ liệu...">
        Lưu thay đổi
      </Button>
    );

    expect(screen.getByText('Đang lưu dữ liệu...')).toBeDefined();
    const btn = screen.getByRole('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });
});