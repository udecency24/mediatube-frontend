import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder = "",
      value,
      onChange,
      onBlur,
      error,
      icon = null,
      helperText = "",
      disabled = false,
      className = "",
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={name}
            className="block text-gray-700 mb-1 font-medium"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}

          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            ref={ref}
            className={`
              w-full 
              ${icon ? "pl-10" : "pl-3"} 
              pr-3 
              py-2 
              border 
              rounded-md 
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500
              ${error ? "border-red-500" : "border-gray-300"}
              ${disabled ? "bg-gray-100 text-gray-500" : ""}
            `}
            required={required}
            {...props}
          />
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
