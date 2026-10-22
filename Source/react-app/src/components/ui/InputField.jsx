import FieldBase from './FieldBase.jsx';

export default function InputField({ type = 'text', ...props }) {
  return <FieldBase as="input" type={type} {...props} />;
}
