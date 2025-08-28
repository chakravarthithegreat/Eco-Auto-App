import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { usePayouts } from '../../../hooks/useDashboardData';

const Loading = () => (
  <Card className="rounded-2xl">
    <CardHeader>
      <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded" />
        ))}
      </div>
    </CardContent>
  </Card>
);

const chip = (status) => {
  const map = {
    Waiting: 'bg-amber-100 text-amber-700',
    Done: 'bg-emerald-100 text-emerald-700',
    Failed: 'bg-rose-100 text-rose-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const PayoutsListCard = () => {
  const { data, isLoading } = usePayouts();
  if (isLoading) return <Loading />;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Salaries and incentive</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((p) => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-light-bg-secondary overflow-hidden" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">${p.amount.toFixed(2)} · {p.date}</div>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${chip(p.status)}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayoutsListCard;


