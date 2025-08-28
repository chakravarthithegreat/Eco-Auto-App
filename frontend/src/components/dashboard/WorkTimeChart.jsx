import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Clock } from 'lucide-react';

const WorkTimeChart = ({ data = {} }) => {
  const hours = data.hours || 46;
  const trend = data.trend || "+0.5%";
  
  return (
    <Card variant="glass">
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Average work time</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{hours} hours</span>
            <div className="flex items-center gap-1 text-green-700 text-xs font-medium">
              {trend}
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-700"></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-32 flex flex-col justify-between">
          <div className="grid grid-cols-4 gap-0 text-slate-400 text-xs">
            <span>10 H</span>
          </div>
          
          <div className="relative h-16 mx-3">
            {/* This would be better with a real chart library, but here's a static SVG representation */}
            <svg className="w-full h-full" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,40 C20,20 40,50 60,30 C80,10 100,40 120,30 C140,20 160,40 180,30 C200,20 220,30 240,20 C260,10 280,20 300,10" 
                stroke="#6B8AF6" 
                strokeWidth="2" 
                fill="none" />
              <circle cx="180" cy="30" r="5" fill="white" stroke="#6B8AF6" strokeWidth="2" />
              <text x="175" y="55" fill="#333" fontSize="10">8 Hours</text>
            </svg>
          </div>
          
          <div className="grid grid-cols-4 gap-0 text-slate-400 text-xs">
            <span>4 H</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Total work hours include extra hours</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkTimeChart;