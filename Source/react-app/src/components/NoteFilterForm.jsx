import React from 'react';
import { InputField, SelectField, Button, FormRow } from './ui/index.js';
import { STATUS_OPTIONS } from '../utils/noteForm.js';

const FILTER_STATUS_OPTIONS = [
  { value: '', label: '-- Tất cả trạng thái --' },
  ...STATUS_OPTIONS,
];

export default function NoteFilterForm({ filters, onFilterChange, onReset, onSubmit }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
      }}
    >
      <FormRow columns={2}>
        <InputField
          label="Từ khóa tìm kiếm (Tiêu đề, nội dung)"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="Nhập từ khóa cần tìm..."
        />

        <SelectField
          label="Trạng thái"
          name="status"
          value={filters.status}
          onChange={handleChange}
          options={FILTER_STATUS_OPTIONS}
        />
      </FormRow>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <Button type="submit" variant="primary">
          Tìm kiếm
        </Button>
        <Button type="button" variant="secondary" onClick={onReset}>
          Đặt lại (Reset)
        </Button>
      </div>
    </form>
  );
}