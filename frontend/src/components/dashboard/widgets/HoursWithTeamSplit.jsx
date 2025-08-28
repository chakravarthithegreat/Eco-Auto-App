import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Hourglass } from 'lucide-react';
import { useHours, useTeamSplit } from '../../../hooks/useDashboardData';
import { User, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TrendPill = ({ delta }) => {
  const up = (delta ?? 0) >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
      up ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
    }`}>
      {`${up ? '+' : ''}${Math.abs(delta ?? 0)}%`}<Icon className="w-3.5 h-3.5" />
    </span>
  );
};

const HoursWithTeamSplit = () => {
  // Hours data (dot matrix)
  const gridRef = useRef(null);
  const [cell, setCell] = useState(12);
  const { data: hoursData } = useHours();
  const { data: splitData } = useTeamSplit();

  const series = (hoursData && hoursData.series) ? hoursData.series : [];
  const [displaySeries, setDisplaySeries] = useState(series);
  const maxHours = series.length ? Math.max(10, ...series.map((s) => s.hours || 0)) : 10;
  const minHours = 0;
  const rows = 5;
  const normalized = displaySeries.map((s) => Math.round(((s.hours - minHours) / (maxHours - minHours || 1)) * rows));

  const dotStyle = (hours, filled) => {
    const t = Math.max(0, Math.min(1, (hours - minHours) / (maxHours - minHours || 1)));
    const palette = ['hsl(205 55% 82%)', 'hsl(205 55% 70%)', 'hsl(205 55% 58%)', 'hsl(205 55% 46%)'];
    const idx = Math.min(3, Math.floor(t * 4));
    const color = palette[idx];
    const size = cell;
    return { width: `${size}px`, height: `${size}px`, background: filled ? color : 'rgba(148,163,184,.25)', borderRadius: '9999px' };
  };

  useEffect(() => {
    const recalc = () => {
      const el = gridRef.current;
      if (!el) return;
      const containerWidth = el.clientWidth || el.parentElement?.clientWidth || 0; // width of left area only
      const gap = 6; // restore gutters
      // Auto-fit columns within cell size bounds
      const minCell = 10;
      const maxCell = 18;
      const maxColsForMin = Math.max(1, Math.floor((containerWidth + gap) / (minCell + gap)));
      const targetCols = Math.min(series.length, maxColsForMin);
      const cellSize = Math.floor((containerWidth - (targetCols - 1) * gap) / targetCols);
      setCell(Math.max(minCell, Math.min(maxCell, cellSize)));
      // Downsample/aggregate series into targetCols bins (average hours)
      if (targetCols > 0) {
        const binSize = Math.ceil(series.length / targetCols);
        const reduced = Array.from({ length: targetCols }).map((_, i) => {
          const start = i * binSize;
          const end = Math.min(series.length, start + binSize);
          const slice = series.slice(start, end);
          const avg = slice.length ? (slice.reduce((s, a) => s + (a.hours || 0), 0) / slice.length) : 0;
          return { hours: avg };
        });
        setDisplaySeries(reduced);
      } else {
        setDisplaySeries(series);
      }
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [series]);

  return (
    <Card className="rounded-2xl bg-white dark:bg-dark-surface border border-light-bg-secondary dark:border-dark-bg-secondary shadow-glass-sm overflow-hidden">
      <div className="flex items-start p-4 gap-4">
        {/* Left: Hours header and matrix */}
        <div className="flex-1 min-w-0">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--light-secondary)]/15">
                <Hourglass className="w-4 h-4 text-[var(--light-secondary)]" />
              </span>
              <span className="text-3xl font-extrabold tracking-tight">{hoursData?.average ?? 0}</span>
              <span className="ml-1 text-xs text-light-text-tertiary">avg hours / weeks</span>
              <span className="ml-auto"><TrendPill delta={hoursData?.deltaPct ?? 0} /></span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div ref={gridRef} className="grid w-full overflow-hidden"
              style={{ gridTemplateColumns: `repeat(${displaySeries.length}, ${cell}px)`, gridTemplateRows: `repeat(${rows}, ${cell}px)`, gap: '6px' }}>
              {Array.from({ length: rows }).map((_, r) => {
                const rowIndex = rows - 1 - r;
                return displaySeries.map((s, c) => {
                  const filled = normalized[c] > rowIndex;
                  return <span key={`r${rowIndex}c${c}`} style={dotStyle(s.hours, filled)} />;
                });
              })}
            </div>
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
        </div>

        {/* Right: Embedded Team Split */}
        <div className="w-[220px]">
          <div className="rounded-3xl overflow-hidden shadow-glass-sm">
            <div className="bg-[#4C7895] text-white p-4">
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/15">
                  <User className="w-4 h-4" />
                </span>
                <TrendPill delta={splitData?.onsite?.deltaPct ?? 0} />
              </div>
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-extrabold leading-none">{splitData?.onsite?.pct ?? 0}%</div>
                <div className="text-white/85 text-base">Onsite team</div>
              </div>
            </div>
            <div className="bg-[#4C7895] p-3">
              <div className="rounded-2xl bg-white p-4 border-2 border-[#3D6C86]">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#E9EEF2]">
                    <Globe className="w-4 h-4 text-[#3D6C86]" />
                  </span>
                  <TrendPill delta={splitData?.remote?.deltaPct ?? 0} />
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-extrabold leading-none text-slate-900">{splitData?.remote?.pct ?? 0}%</div>
                  <div className="text-slate-600 text-base">Remote team</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HoursWithTeamSplit;


