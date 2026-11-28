/**
 * COMPONENT : FormInput
 * PURPOSE   : Reusable labeled input with an optional field-level error.
 */
export default function FormInput({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
  inputMode,
  minLength,
  min,
  required = true,
  disabled = false,
}) {
  const inputId = id || name;
  const errorId = `${inputId}-error`;

  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={name}
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        minLength={minLength}
        min={min}
        required={required}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p className="field-err" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
