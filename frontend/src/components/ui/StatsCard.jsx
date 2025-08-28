import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Info, TrendingUp } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  trend, 
  icon, 
  iconBgColor, 
  iconColor,
  insight,
  prediction,
  description
}) => {
  // Determine trend color using the new psychology-based color scheme
  const trendColorClass = trend && trend.startsWith('+') 
    ? 'text-light-success bg-light-success/10 dark:text-dark-success dark:bg-dark-success/10' 
    : 'text-light-danger bg-light-danger/10 dark:text-dark-danger dark:bg-dark-danger/10';
  
  return (
    <Card className="h-full" variant="glass">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary truncate flex-1 mr-2">{title}</h3>
          <div className={`h-8 w-8 rounded-full ${iconBgColor || 'bg-light-bg-secondary dark:bg-dark-bg-secondary'} flex items-center justify-center flex-shrink-0`}>
            {icon && React.cloneElement(icon, { 
              className: `w-4 h-4 ${iconColor || 'text-light-text-secondary dark:text-dark-text-secondary'}` 
            })}
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text truncate">{value}</span>
          {trend && (
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${trendColorClass} flex-shrink-0`}>{trend}</span>
          )}
        </div>
        
        {/* Enhanced Insights */}
        {(insight || prediction || description) && (
          <div className="mt-3 pt-2 border-t border-light-bg-secondary dark:border-dark-bg-secondary">
            {insight && (
              <div className="flex items-start gap-1 mb-1">
                <Info className="w-3 h-3 text-light-secondary dark:text-dark-secondary mt-0.5 flex-shrink-0" />
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary break-words leading-relaxed">{insight}</span>
              </div>
            )}
            {prediction && (
              <div className="flex items-start gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-light-accent dark:text-dark-accent mt-0.5 flex-shrink-0" />
                <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary break-words leading-relaxed">{prediction}</span>
              </div>
            )}
            {description && (
              <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1 break-words leading-relaxed">
                {description}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;