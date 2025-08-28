import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Clock } from 'lucide-react';

const WorkHoursMatrix = ({ data = {} }) => {
  const hours = data.hours || 46.5;
  const trend = data.trend || "+0.5%";
  const dots = data.dots || Array(30).fill(0).map(() => Math.random() > 0.2);
  
  return (
    <Card className="rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800">Working Hours</h3>
          <div className="p-2 rounded-full bg-blue-100">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold">{hours}</span>
          <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded mb-1">
            {trend}
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-1">avg hours / weeks</p>
        
        <div className="mt-4 grid grid-cols-10 gap-1">
          {dots.map((active, i) => (
            <div 
              key={i}
              className={`w-5 h-5 rounded-full ${active ? 'bg-blue-600/80' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkHoursMatrix;