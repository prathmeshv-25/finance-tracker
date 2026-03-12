import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="label">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`input-field ${icon ? "pl-10" : ""} ${
              error ? "border-expense" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-expense text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
