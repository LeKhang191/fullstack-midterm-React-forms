import { useId } from 'react';

/**
 * Shared accessible field shell. Its value belongs to the parent (controlled input).
 * Internal IDs link label, help text and errors without hard-coded duplicate IDs.
 */
export default function FieldBase({
  as = 'input', id, label, name, value, onChange, required = false,
  error = '', hint = '', disabled = false, placeholder = '', className = '',
  options = [], children, ...controlProps
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  const attrs = {
    ...controlProps,
    id: inputId,
    name,
    value,
    onChange,
    disabled,
    required,
    placeholder,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
  };

  let control;
  if (as === 'textarea') {
    control = <textarea {...attrs} />;
  } else if (as === 'select') {
    // Options are supplied by the consumer (TV1, TV2, or the shared app).
    const { placeholder: unusedPlaceholder, ...selectAttrs } = attrs;
    void unusedPlaceholder;
    control = (
      <select {...selectAttrs}>
        {options.map((item) => (
          <option key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </select>
    );
  } else {
    control = <input {...attrs} />;
  }

  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={inputId}>
        {label}{required && <span className="required" aria-hidden="true"> *</span>}
      </label>
      {control}
      {hint && <small id={hintId} className="hint">{hint}</small>}
      {error && <small role="alert" id={errorId} className="field-error">{error}</small>}
      {children}
    </div>
  );
}
