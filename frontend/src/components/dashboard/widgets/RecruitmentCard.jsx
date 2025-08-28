import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { useRecruitment } from '../../../hooks/useDashboardData';

const Loading = () => (
  <Card className="rounded-2xl">
    <CardHeader>
      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded" />
    </CardContent>
  </Card>
);

const ErrorState = ({ message }) => (
  <Card className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-900/20">
    <CardContent className="p-4 text-sm text-red-700 dark:text-red-300">{message || 'Failed to load hiring pipeline'}</CardContent>
  </Card>
);

const RecruitmentCard = () => {
  const { data, isLoading, isError, error } = useRecruitment();
  if (isLoading) return <Loading />;
  if (isError) return <ErrorState message={error?.message} />;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Talent recruitment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((s) => (
            <div key={s.stage} className="text-sm">
              <div className="flex items-center justify-between mb-1">
                <span>{s.stage}</span>
                <span className="text-light-text-tertiary dark:text-dark-text-tertiary">{s.matched} Talent</span>
              </div>
              <div className="h-2 rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary overflow-hidden">
                <div className="h-2" style={{ width: `${Math.min(100, (s.matched / (s.matched + s.notMatched || 1)) * 100)}%`, backgroundImage: 'var(--brand-gradient)' }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecruitmentCard;


