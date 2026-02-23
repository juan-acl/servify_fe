import { forwardRef, type InputHTMLAttributes } from "react";
import "./input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightElement, className, ...rest }, ref) => {
    return (
      <div className="input-field">
        {label && <label className="input-label">{label}</label>}
        <div className="input-wrapper">
          <input
            ref={ref}
            className={`input-base ${error ? "input-error" : ""} ${className || ""}`}
            {...rest}
          />
          {rightElement && (
            <div className="input-right-element">{rightElement}</div>
          )}
        </div>
        {error && <span className="input-error-text">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
