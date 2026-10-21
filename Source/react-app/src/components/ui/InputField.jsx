import FieldBase from './FieldBase.jsx';

/** Native onChange(event); parent owns the value (React controlled component). */
export default function InputField({ type = 'text', ...props }) {
  return <FieldBase as="input" type={type} {...props} />;
}
