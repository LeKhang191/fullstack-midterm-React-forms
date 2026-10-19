import FieldBase from './FieldBase.jsx';

/** Options: [{value: string, label: string, disabled?: boolean}]. */
export default function SelectField({ options = [], ...props }) {
  return <FieldBase as="select" options={options} {...props} />;
}
