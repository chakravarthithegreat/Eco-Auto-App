import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../utils/cn.js';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  color = 'primary',
  className 
}) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-100',
    accent: 'text-accent-600 bg-accent-100',
    warning: 'text-warning-600 bg-warning-100',
    danger: 'text-danger-600 bg-danger-100',
    info: 'text-blue-600 bg-blue-100',
    success: 'text-success-600 bg-success-100'
  };

  return (
    <Card className={cn("hover:scale-[1.02] transition-transform duration-200 rounded-3xl", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-surface-500 font-medium">{title}</p>
            <p className="text-2xl font-semibold text-surface-800 mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-surface-400 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2 text-xs">
                <span className={cn(
                  "font-medium",
                  trend === 'up' ? 'text-success-600' : 
                  trend === 'down' ? 'text-danger-600' : 'text-surface-500'
                )}>
                  {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
              colorClasses[color]
            )}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { KPICard };