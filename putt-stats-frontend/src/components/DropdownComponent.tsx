type DropdownComponentProps = {
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChangeFunction: any;
};

function DropdownComponent(props: DropdownComponentProps) {
  const { label, value, options, onChangeFunction } = props;
  return (
    <label>
      {label}
      <select
        value={value}
        onChange={onChangeFunction}
        style={{ marginTop: 10 }}
      >
        {options.map((option) => (
          <option value={option.value} key={`dropdown-option-${option.value}`}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default DropdownComponent;
