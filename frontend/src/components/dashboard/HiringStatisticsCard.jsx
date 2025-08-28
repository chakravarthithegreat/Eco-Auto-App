import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Video } from 'lucide-react';

const HiringStatisticsCard = ({ data = {} }) => {
  const matchedCount = data.matchedCount || 120;
  const notMatchCount = data.notMatchCount || 80;
  const total = Math.max(1, matchedCount + notMatchCount);
  const totalBars = 20;
  const greenBars = Math.round((matchedCount / total) * totalBars);

  return (
    <Card className="h-full" variant="glass">
      <CardContent className="p-3 sm:p-4">
        <div className="mb-2">
          <h3 className="text-sm font-medium text-slate-700">Hiring statistics</h3>
        </div>

        <div>
          <h4 className="text-xs font-medium text-slate-600 mb-2">Talent recruitment</h4>
          <div className="flex items-center gap-1.5 mb-1.5">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Talent" className="w-8 h-8 rounded-lg object-cover" />
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Talent" className="w-8 h-8 rounded-lg object-cover" />
            <div className="w-14 h-12 rounded-lg bg-slate-600 flex flex-col items-center justify-center">
              <Video className="w-4 h-4 text-white mb-0.5" />
              <span className="text-[10px] text-white leading-none">Join call</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
            <span>{matchedCount} Talent</span>
            <span>{notMatchCount} Talent</span>
          </div>

          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: totalBars }).map((_, i) => (
              <div
                key={i}
                className={`h-3 w-1.5 rounded-sm ${i < greenBars ? 'bg-green-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              <span>Matched</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              <span>Not match</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HiringStatisticsCard;