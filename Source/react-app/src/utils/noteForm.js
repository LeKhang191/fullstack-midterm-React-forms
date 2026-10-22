export const CATEGORY_OPTIONS = [
  { value: 'study', label: 'Học tập' },
  { value: 'project', label: 'Dự án' },
  { value: 'personal', label: 'Cá nhân' },
];

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Bản nháp' },
  { value: 'in_progress', label: 'Đang thực hiện' },
  { value: 'done', label: 'Hoàn thành' },
];

// DTO tu backend -> state cua controlled form.
export function normalizeNote(note = {}) {
  return {
    title: String(note.title ?? ''),
    content: String(note.content ?? ''),
    category: String(note.category ?? 'study'),
    status: String(note.status ?? 'draft'),
  };
}

export function validateNote(form) {
  const errors = {};
  const title = form.title?.trim() ?? '';
  const content = form.content?.trim() ?? '';

  if (!title) errors.title = 'Tiêu đề không được để trống.';
  else if (title.length > 120) errors.title = 'Tiêu đề tối đa 120 ký tự.';

  if (!content) errors.content = 'Nội dung không được để trống.';
  else if (content.length > 2000) errors.content = 'Nội dung tối đa 2.000 ký tự.';

  if (!CATEGORY_OPTIONS.some((option) => option.value === form.category)) {
    errors.category = 'Vui lòng chọn danh mục hợp lệ.';
  }
  if (!STATUS_OPTIONS.some((option) => option.value === form.status)) {
    errors.status = 'Vui lòng chọn trạng thái hợp lệ.';
  }

  return errors;
}

export function toUpdatePayload(form) {
  return {
    title: form.title.trim(),
    content: form.content.trim(),
    category: form.category,
    status: form.status,
  };
}
