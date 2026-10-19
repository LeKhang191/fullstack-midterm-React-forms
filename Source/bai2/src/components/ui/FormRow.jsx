/** Responsive horizontal grouping; on small screens, fields stack automatically. */
export default function FormRow({ children, columns = 2, className = '' }) {
  return (
    <div className={`form-row ${columns === 2 ? 'field-grid' : 'form-row--single'} ${className}`.trim()}>
      {children}
    </div>
  );
}
