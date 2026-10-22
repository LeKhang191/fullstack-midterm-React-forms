import FieldBase from './FieldBase.jsx';

export default function SelectField({ options = [], ...props }) {
  return <FieldBase as="select" options={options} {...props} />;
}
