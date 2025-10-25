interface OptionType {
  value: string | number;
  label: string;
}

interface FormInputType {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  as?: 'input' | 'select';
  options?: OptionType[];
  inputRef?: (el: HTMLInputElement | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const FormInput = ({ label, name, type = 'text', placeholder = '', as = 'input', options = [], inputRef, onBlur, error }: FormInputType) => {
  // Use DaisyUI input-error for error state
  const inputClass = `input font-secondary h-6 max-w-[375px] w-full bg-[#001a33] text-white border border-gray-600 ${error ? 'input-error border-error' : ''}`;
  return (
    <fieldset className="fieldset my-1 ">
      <legend className="fieldset-legend text-white">{label}</legend>
      {as === 'select' ? (
        <select name={name} className={inputClass}>
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          className={inputClass}
          placeholder={placeholder}
          ref={inputRef}
          onBlur={onBlur}
        />
      )}
      {/* <p className="label">Optional</p> */}
    </fieldset>
  );
};
export default FormInput;
