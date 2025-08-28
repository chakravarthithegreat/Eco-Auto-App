import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

// Safe, non-breaking widget gallery shell
// Props: open:boolean, onClose:fn, onAdd:(widgetId)=>void
const WIDGETS = [
  { id: 'avg-hours', name: 'Average Hours Trend', category: 'Productivity' },
  { id: 'team-split', name: 'Onsite vs Remote Split', category: 'People' },
  { id: 'team-composition', name: 'Track Your Team', category: 'People' },
  { id: 'recruitment', name: 'Talent Recruitment', category: 'Hiring' },
  { id: 'payouts', name: 'Salaries & Incentives', category: 'Finance' },
  { id: 'payroll-summary', name: 'Payroll Summary', category: 'Finance' },
];

const WidgetGallery = ({ open, onClose, onAdd }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30" role="dialog" aria-modal="true">
      <div className="w-full sm:max-w-3xl sm:rounded-2xl sm:overflow-hidden bg-light-surface dark:bg-dark-surface shadow-2xl">
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Add widget</CardTitle>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WIDGETS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => onAdd && onAdd(w.id)}
                  className="text-left p-4 rounded-xl border border-light-bg-secondary dark:border-dark-bg-secondary hover:shadow-md active:shadow-sm transition-shadow"
                >
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mb-1">{w.category}</div>
                  <div className="font-medium text-light-text dark:text-dark-text">{w.name}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={onClose}>Done</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WidgetGallery;


