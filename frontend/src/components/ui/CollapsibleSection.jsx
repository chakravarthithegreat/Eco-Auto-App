import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Card } from './Card';

const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = false, 
  icon: Icon,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className={className} variant="glass">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-8 w-8 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary flex items-center justify-center">
              <Icon className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
            </div>
          )}
          <h3 className="text-sm font-semibold text-light-text dark:text-dark-text">{title}</h3>
        </div>
        <ChevronRight 
          className={`w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 border-t border-light-bg-secondary dark:border-dark-bg-secondary">
          {children}
        </div>
      </div>
    </Card>
  );
};

export default CollapsibleSection;