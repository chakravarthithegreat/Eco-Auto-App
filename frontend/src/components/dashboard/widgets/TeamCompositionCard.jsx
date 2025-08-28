import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { useTeamComposition } from '../../../hooks/useDashboardData';

const Loading = () => (
  <Card className="rounded-2xl">
    <CardHeader>
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded" />
    </CardContent>
  </Card>
);

const ErrorState = ({ message }) => (
  <Card className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-900/20">
    <CardContent className="p-4 text-sm text-red-700 dark:text-red-300">{message || 'Failed to load team composition'}</CardContent>
  </Card>
);

const TeamCompositionCard = () => {
  const { data, isLoading, isError, error } = useTeamComposition();
  if (isLoading) return <Loading />;
  if (isError) return <ErrorState message={error?.message} />;

  const total = data.reduce((s, r) => s + r.count, 0);
  const palette = ['#48C38B', '#2F6F9E', '#A3BFD4'];

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle>Track your team</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          {/* Semi-donut gauge */}
          <svg width="112" height="80" viewBox="0 0 112 80" className="shrink-0">
            <defs>
              <linearGradient id="seg1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={palette[0]} />
                <stop offset="100%" stopColor={palette[0]} />
              </linearGradient>
              <linearGradient id="seg2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={palette[1]} />
                <stop offset="100%" stopColor={palette[1]} />
              </linearGradient>
              <linearGradient id="seg3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={palette[2]} />
                <stop offset="100%" stopColor={palette[2]} />
              </linearGradient>
            </defs>
            {/* background arc */}
            <path d="M8,72 A48,48 0 0 1 104,72" fill="none" stroke="#E5EAF1" strokeWidth="18" strokeLinecap="round" />
            {/* segments (proportional rough) */}
            <path d="M12,72 A44,44 0 0 1 52,32" fill="none" stroke="url(#seg1)" strokeWidth="18" strokeLinecap="round" />
            <path d="M52,32 A44,44 0 0 1 84,44" fill="none" stroke="url(#seg2)" strokeWidth="18" strokeLinecap="round" />
            <path d="M84,44 A44,44 0 0 1 100,72" fill="none" stroke="url(#seg3)" strokeWidth="18" strokeLinecap="round" />
          </svg>
          <div>
            <div className="text-3xl font-extrabold leading-tight">{total}</div>
            <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">Total members</div>
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          {data.map((r, i) => (
            <div key={r.role} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: palette[i % palette.length] }} />
                {r.role}
              </span>
              <span className="text-light-text-secondary dark:text-dark-text-secondary">{r.count} members</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCompositionCard;


