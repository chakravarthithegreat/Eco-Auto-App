import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Hourglass } from 'lucide-react';
import { useHours } from '../../../hooks/useDashboardData';

const Loading = () => (
  <Card className="rounded-2xl">
    <CardHeader>
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-100 dark:bg-gray-800 rounded" />
        ))}
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ message }) => (
  <Card className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-900/20">
    <CardContent className="p-4 text-sm text-red-700 dark:text-red-300">{message || 'Failed to load data'}</CardContent>
  </Card>
);

const AverageHoursCard = () => {
  const gridRef = useRef(null);
  const [cell, setCell] = useState(12);
  const { data, isLoading, isError, error } = useHours();

  const series = (data && data.series) ? data.series : [];
  const maxHours = series.length ? Math.max(10, ...series.map((s) => s.hours || 0)) : 10;
  const minHours = 0;
  const rows = 5;

  const normalized = series.map((s) => Math.round(((s.hours - minHours) / (maxHours - minHours || 1)) * rows));

  const dotStyle = (hours, filled) => {
    const t = Math.max(0, Math.min(1, (hours - minHours) / (maxHours - minHours || 1)));
    const palette = ['hsl(205 55% 82%)', 'hsl(205 55% 70%)', 'hsl(205 55% 58%)', 'hsl(205 55% 46%)'];
    const idx = Math.min(3, Math.floor(t * 4));
    const color = palette[idx];
    const size = cell;
    return {
      width: `${size}px`,
      height: `${size}px`,
      background: filled ? color : 'rgba(148,163,184,.25)',
      borderRadius: '9999px',
      boxShadow: 'none',
    };
  };

  useEffect(() => {
    const recalc = () => {
      const el = gridRef.current;
      if (!el) return;
      const containerWidth = el.clientWidth || el.parentElement?.clientWidth || 0;
      const gap = 4;
      const count = Math.max(1, series.length);
      const size = Math.floor((containerWidth - (count - 1) * gap) / count);
      setCell(Math.max(6, Math.min(14, size)));
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [series.length]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState message={error?.message} />;

  return (
    <Card className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20">
            <Hourglass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </span>
          <span className="text-3xl font-extrabold tracking-tight">{data.average}</span>
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">avg hours / weeks</span>
          <span className="ml-auto inline-flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">+{data.deltaPct}%</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-3 px-4">
        {/* Dot Matrix */}
        <div
          ref={gridRef}
          className="grid w-full overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${series.length}, ${cell}px)`,
            gridTemplateRows: `repeat(${rows}, ${cell}px)`,
            gap: '4px'
          }}
        >
          {Array.from({ length: rows }).map((_, r) => {
            const rowIndex = rows - 1 - r;
            return series.map((s, c) => {
              const filled = normalized[c] > rowIndex;
              return (
                <span key={`r${rowIndex}c${c}`} style={dotStyle(s.hours, filled)} />
              );
            });
          })}
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-between text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
          <span>2 Hours</span>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded" style={{ width: 12, height: 12, background: 'hsl(205 55% 82%)' }} />
            <span className="inline-block rounded" style={{ width: 12, height: 12, background: 'hsl(205 55% 70%)' }} />
            <span className="inline-block rounded" style={{ width: 12, height: 12, background: 'hsl(205 55% 58%)' }} />
            <span className="inline-block rounded" style={{ width: 12, height: 12, background: 'hsl(205 55% 46%)' }} />
          </div>
          <span>10 Hours</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AverageHoursCard;
