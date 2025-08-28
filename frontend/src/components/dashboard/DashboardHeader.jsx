import React from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Plus, Calendar, FilePlus2, Search } from 'lucide-react';

const DashboardHeader = ({ onOpenGallery }) => {
  return (
    <div className="w-full">
      <Card className="bg-white/90 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary">
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-5 flex items-center gap-2">
              <div className="h-9 flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-tertiary dark:text-dark-text-tertiary" />
                <input
                  className="w-full h-9 pl-9 pr-3 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm outline-none focus:ring-2 focus:ring-light-secondary"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="sm:col-span-4 flex items-center justify-start sm:justify-center gap-2">
              <button className="h-9 px-3 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                18 – 22 November
              </button>
            </div>
            <div className="sm:col-span-3 flex items-center justify-end gap-2">
              <Button
                onClick={onOpenGallery}
                className="h-9 rounded-full bg-brand-gradient text-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add widget
              </Button>
              <Button className="h-9 rounded-full bg-brand-gradient text-white">
                <FilePlus2 className="w-4 h-4 mr-1" /> Add report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;


