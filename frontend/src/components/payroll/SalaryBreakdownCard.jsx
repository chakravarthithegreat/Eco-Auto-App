import React from 'react';
import { Card, CardContent } from '../ui/Card';

const SalaryBreakdownCard = ({ salaryData = {} }) => {
  const basicSalary = salaryData.basicSalary || 2040;
  const performance = salaryData.performance || 300;
  const gift = salaryData.gift || 200;
  const total = salaryData.total || 2540;
  
  return (
    <Card className="rounded-3xl overflow-hidden bg-blue-600 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="bg-green-400/50 text-white rounded-full px-6 py-3 flex items-center justify-between">
            <span>Basic salary</span>
            <span className="font-semibold">${basicSalary}</span>
          </div>
          
          <div className="bg-white text-gray-800 rounded-full px-6 py-3 flex items-center justify-between">
            <span>Perform</span>
            <span className="font-semibold">${performance}</span>
          </div>
          
          <div className="bg-white/20 text-white rounded-full px-6 py-3 flex items-center justify-between">
            <span>Gift</span>
            <span className="font-semibold">${gift}</span>
          </div>
        </div>
        
        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-white/80 text-sm">Take home pay</div>
            <div className="text-3xl font-bold mt-1">${total.toFixed(2)}</div>
          </div>
          <div className="text-3xl font-bold">100%</div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white">📄</span>
          </div>
          <div className="w-8 h-8 bg-green-400/50 rounded-full flex items-center justify-center relative">
            <span className="text-white">💬</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-blue-600 text-xs flex items-center justify-center font-bold">2</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryBreakdownCard;