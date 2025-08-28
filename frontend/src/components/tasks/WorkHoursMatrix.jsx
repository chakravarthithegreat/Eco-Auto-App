import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Clock, TrendingUp, Zap, Info } from 'lucide-react';

const WorkHoursMatrix = ({ data = {} }) => {
  const hours = data.hours || 0;
  const trend = data.trend || "+0%";
  const dots = data.dots || Array(30).fill(false);
  const insights = data.insights || [
    "Peak productivity: 10AM-3PM",
    "Team collaboration highest: 2PM-4PM",
    "Recommended meeting slots: 11AM, 3PM"
  ];
  
  const [showInsights, setShowInsights] = useState(false);

  // Generate heatmap data (simulating productivity by time)
  const generateHeatmapData = () => {
    return Array(24).fill(0).map((_, hour) => {
      // Simulate productivity pattern with peaks during work hours
      const isWorkHour = hour >= 9 && hour <= 18;
      const isPeakHour = hour >= 10 && hour <= 15;
      const productivity = isPeakHour ? 90 : isWorkHour ? 70 : 30;
      return { hour, productivity };
    });
  };

  const heatmapData = generateHeatmapData();

  return (
    <Card variant="glass">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-slate-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Working Hours</h3>
          </div>
          <button 
            onClick={() => setShowInsights(!showInsights)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-slate-900">{hours}</span>
          <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
            {trend}
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-4">avg hours / weeks</p>
        
        {/* Enhanced Heatmap Visualization */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
          </div>
          <div className="grid grid-cols-5 gap-1 mb-3">
            {dots.map((active, i) => (
              <div 
                key={i}
                className={`h-2 rounded-sm ${active ? 'bg-slate-600' : 'bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
        
        {/* Productivity Heatmap */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-slate-700 mb-2">Productivity by Hour</h4>
          <div className="grid grid-cols-12 gap-0.5">
            {heatmapData.map((hourData, index) => {
              let bgColor = 'bg-gray-200';
              if (hourData.productivity >= 80) bgColor = 'bg-green-500';
              else if (hourData.productivity >= 60) bgColor = 'bg-green-400';
              else if (hourData.productivity >= 40) bgColor = 'bg-yellow-400';
              else if (hourData.productivity >= 20) bgColor = 'bg-orange-300';
              
              return (
                <div 
                  key={index}
                  className={`h-3 rounded-sm ${bgColor}`}
                  title={`${hourData.hour}:00 - Productivity: ${hourData.productivity}%`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>9AM</span>
            <span>12PM</span>
            <span>3PM</span>
            <span>6PM</span>
          </div>
        </div>
        
        {/* Insights Panel */}
        {showInsights && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Team Insights
            </h4>
            <ul className="space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between mt-3 text-xs text-slate-500">
          <span>2 Hours</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-1 bg-slate-300 rounded-full"></span>
            <span className="w-2 h-1 bg-slate-300 rounded-full"></span>
            <span className="w-2 h-1 bg-slate-300 rounded-full"></span>
            <span className="w-2 h-1 bg-slate-600 rounded-full"></span>
          </div>
          <span>10 Hours</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkHoursMatrix;