import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { usePayrollSummary } from '../../../hooks/useDashboardData';

const Loading = () => (
  <Card className="rounded-2xl">
    <CardHeader>
      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded" />
    </CardContent>
  </Card>
);

const PayrollSummaryCard = () => {
  const { data, isLoading } = usePayrollSummary();
  if (isLoading) return <Loading />;

  return (
    <Card className="rounded-2xl" variant="panelBlue">
      <CardHeader>
        <CardTitle className="text-white">Payroll summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl p-4 bg-white/10 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-90">Basic salary</div>
              <div className="text-lg font-semibold">${data.base.toFixed(0)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-90">Take home pay</div>
              <div className="text-2xl font-extrabold">${data.total.toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="bg-white/20 rounded-full px-2 py-0.5">Perform ${data.performance}</span>
            <span className="bg-white/20 rounded-full px-2 py-0.5">Gift ${data.gift}</span>
            <span className="bg-white/20 rounded-full px-2 py-0.5">Payment 100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollSummaryCard;


