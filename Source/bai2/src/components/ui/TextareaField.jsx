import FieldBase from './FieldBase.jsx';

export default function TextareaField({ rows = 5, ...props }) {
  return <FieldBase as="textarea" rows={rows} {...props} />;
}
