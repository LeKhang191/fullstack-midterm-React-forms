export const CATEGORY_OPTIONS = [
  { value: 'study', label: 'Study' },
  { value: 'project', label: 'Project' },
  { value: 'personal', label: 'Personal' },
];

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

// DTO from backend -> state of controlled form.
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

  if (!title) errors.title = 'Title is required.';
  else if (title.length > 120) errors.title = 'Title must be at most 120 characters.';

  if (!content) errors.content = 'Content is required.';
  else if (content.length > 2000) errors.content = 'Content must be at most 2,000 characters.';

  if (!CATEGORY_OPTIONS.some((option) => option.value === form.category)) {
    errors.category = 'Please select a valid category.';
  }
  if (!STATUS_OPTIONS.some((option) => option.value === form.status)) {
    errors.status = 'Please select a valid status.';
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
