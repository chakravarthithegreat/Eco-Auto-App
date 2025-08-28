import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Users, Globe, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TeamDistributionCard = ({ data = {} }) => {
  const onsitePercentage = data.onsitePercentage || 65;
  const remotePercentage = data.remotePercentage || 35;
  const onsiteTrend = data.onsiteTrend || "+2.6%";
  const remoteTrend = data.remoteTrend || "+2.6%";
  const onsiteCount = data.onsiteCount || 8;
  const remoteCount = data.remoteCount || 4;
  
  const [activeSection, setActiveSection] = useState(null);

  // Determine trend values and icons
  const onsiteTrendValue = parseFloat(onsiteTrend.replace(/[+%]/g, ''));
  const remoteTrendValue = parseFloat(remoteTrend.replace(/[+%]/g, ''));
  
  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-3 h-3" />;
    if (value < 0) return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  // Determine trend color classes
  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600 bg-green-100';
    if (value < 0) return 'text-red-600 bg-red-100';
    return 'text-slate-600 bg-slate-100';
  };

  // Handle section click for detailed view
  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
    // In a real implementation, this would open a modal with detailed employee information
    console.log(`Clicked on ${section} team section`);
  };

  return (
    <Card className="h-full" variant="glass">
      {/* Title section */}
      <div className="flex items-center justify-between p-4 sm:p-5 pb-2">
        <h3 className="text-base font-medium text-slate-700">Team Distribution</h3>
      </div>
      
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Onsite Team - Blue section */}
          <div 
            className="flex-1 bg-blue-600 text-white p-4 sm:p-5 rounded-bl-2xl relative overflow-hidden cursor-pointer transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
            onClick={() => handleSectionClick('onsite')}
            aria-label={`Onsite team: ${onsitePercentage}% (${onsiteCount} members), trend: ${onsiteTrend}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('onsite')}
          >
            <div className="relative z-10">
              <div className="flex flex-col">
                <span className="text-4xl font-bold">{onsitePercentage}%</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-blue-200">Onsite team</span>
                  <span className="text-xs bg-blue-500/30 px-2 py-0.5 rounded-full">
                    {onsiteCount} members
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getTrendColor(onsiteTrendValue)}`}>
                  {getTrendIcon(onsiteTrendValue)}
                  <span>{onsiteTrend}</span>
                </div>
              </div>
            </div>
            {/* Visual background elements */}
            <div className="absolute bottom-0 right-0 opacity-20">
              <Users className="w-20 h-20 text-white" />
            </div>
          </div>

          {/* Remote Team - Light section */}
          <div 
            className="flex-1 bg-white p-4 sm:p-5 rounded-br-2xl cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
            onClick={() => handleSectionClick('remote')}
            aria-label={`Remote team: ${remotePercentage}% (${remoteCount} members), trend: ${remoteTrend}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('remote')}
          >
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-slate-800">{remotePercentage}%</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500">Remote team</span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                  {remoteCount} members
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-slate-600" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getTrendColor(remoteTrendValue)}`}>
                {getTrendIcon(remoteTrendValue)}
                <span>{remoteTrend}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional insights */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Hybrid balance score:</span>
            <span className="font-medium">
              {Math.abs(onsitePercentage - remotePercentage) <= 10 ? 'Optimal' : 
               onsitePercentage > remotePercentage ? 'Onsite-heavy' : 'Remote-heavy'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamDistributionCard;