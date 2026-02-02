import React from 'react';

const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
};

const MetricCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = 'primary',
    trend,
    trendDirection,
    className = '',
}) => {
    return (
        <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
                    )}
                    {trend && (
                        <div className={`mt-2 flex items-center text-sm ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <span>{trend}</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricCard;
