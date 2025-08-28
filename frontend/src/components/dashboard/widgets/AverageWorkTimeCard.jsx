import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { ArrowUpRight, Info } from 'lucide-react';
import { useHours } from '../../../hooks/useDashboardData';

const AverageWorkTimeCard = () => {
  const { data, isLoading, isError, error } = useHours();

  const series = Array.isArray(data?.series) ? data.series : [];
  const average = data?.average ?? 0;
  const deltaPct = data?.deltaPct ?? 0;

  const WIDTH = 360;
  const HEIGHT = 140;
  const PAD = { top: 12, right: 16, bottom: 26, left: 40 };
  const DOMAIN_MIN = 4;
  const DOMAIN_MAX = 10;

  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const points = useMemo(() => {
    if (series.length === 0) return [];
    const n = series.length - 1;
    return series.map((s, i) => {
      const x = PAD.left + (n === 0 ? plotW / 2 : (i / n) * plotW);
      const t = Math.max(0, Math.min(1, (s.hours - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)));
      const y = PAD.top + (1 - t) * plotH;
      return { x, y };
    });
  }, [series]);

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    // Smooth curve (Catmull-Rom -> cubic Bezier approximation)
    const d = [];
    for (let i = 0; i < points.length; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[Math.min(points.length - 1, i + 1)];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      if (i === 0) {
        d.push(`M ${p1.x} ${p1.y}`);
      } else {
        const smoothing = 0.2;
        const cp1x = p1.x + (p2.x - p0.x) * smoothing / 6;
        const cp1y = p1.y + (p2.y - p0.y) * smoothing / 6;
        const cp2x = p2.x - (p3.x - p1.x) * smoothing / 6;
        const cp2y = p2.y - (p3.y - p1.y) * smoothing / 6;
        d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
      }
    }
    return d.join(' ');
  }, [points]);

  if (isLoading) return (
    <Card className="rounded-2xl">
      <CardHeader className="p-4">
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded" />
      </CardContent>
    </Card>
  );

  if (isError) return (
    <Card className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-900/20">
      <CardContent className="p-4 text-sm text-red-700 dark:text-red-300">{error?.message || 'Failed to load data'}</CardContent>
    </Card>
  );

  const last = points[points.length - 1];

  return (
    <Card className="rounded-3xl bg-white/95 dark:bg-dark-surface/90 backdrop-blur-sm border border-slate-100 dark:border-dark-bg-secondary shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_rgba(31,41,55,0.06)]">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="flex items-start">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-slate-700 break-words">Average work time</div>
            <div className="mt-1 text-[32px] sm:text-[40px] leading-none font-extrabold tracking-tight text-slate-900 break-words">{Math.round(average)} hours</div>
          </div>
          <span className="ml-4 inline-flex items-center gap-1 text-green-700 text-sm font-medium flex-shrink-0">
            +{deltaPct}%
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1 pb-4 px-5">
        {/* Chart area */}
        <div className="relative h-32">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full" aria-label="Average work time chart">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Y gridlines and labels */}
            {[10, 8, 6, 4].map((h, idx) => {
              const t = (h - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN);
              const y = PAD.top + (1 - t) * plotH;
              return (
                <g key={idx}>
                  <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="6 6" />
                  <text x={PAD.left - 26} y={y + 4} fontSize="11" fill="#94a3b8">{h} H</text>
                </g>
              );
            })}
            {/* Smooth curve with soft shadow */}
            <path d={pathD} stroke="#5F7DF2" strokeWidth="2" fill="none" filter="url(#glow)" />
            {last && (
              <circle cx={last.x} cy={last.y} r="6" fill="#fff" stroke="#5F7DF2" strokeWidth="2" />
            )}
          </svg>
        </div>
        {/* Footer note */}
        <div className="mt-3 flex items-start gap-2 text-[13px] text-slate-600">
          <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200 flex-shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5 text-slate-600" />
          </span>
          <span className="break-words leading-relaxed">Total work hours include extra hours</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AverageWorkTimeCard;


