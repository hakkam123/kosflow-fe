import React from 'react';

const Card = ({
    children,
    className = '',
    padding = 'default',
    hover = false,
    onClick,
    ...props
}) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''}
        ${className}
      `}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

// Sub-components for structured card layouts
Card.Header = ({ children, className = '' }) => (
    <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>
        {children}
    </div>
);

Card.Title = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
    </h3>
);

Card.Body = ({ children, className = '' }) => (
    <div className={className}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
    <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>
        {children}
    </div>
);

export default Card;
