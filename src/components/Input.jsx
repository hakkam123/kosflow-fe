import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    type = 'text',
    placeholder,
    className = '',
    inputClassName = '',
    required = false,
    disabled = false,
    ...props
}, ref) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-danger ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`
            block w-full rounded-lg border
            ${error ? 'border-danger' : 'border-gray-300'}
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            text-gray-900 placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${inputClassName}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-danger">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
