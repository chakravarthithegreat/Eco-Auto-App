import React from 'react';
import { Card, CardHeader, CardContent } from '../../ui/Card';
import { useTeamSplit } from '../../../hooks/useDashboardData';
import { User, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Loading = () => (
  <Card className="rounded-2xl">
    <CardHeader>
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ message }) => (
  <Card className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-900/20">
    <CardContent className="p-4 text-sm text-red-700 dark:text-red-300">{message || 'Failed to load team split'}</CardContent>
  </Card>
);

const TrendPill = ({ delta }) => {
  const up = (delta ?? 0) >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
      up ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
    }`}>
      {`${up ? '+' : ''}${Math.abs(delta ?? 0)}%`}
      <Icon className="w-3.5 h-3.5" />
    </span>
  );
};

const TeamSplitCard = () => {
  const { data, isLoading, isError, error } = useTeamSplit();
  if (isLoading) return <Loading />;
  if (isError) return <ErrorState message={error?.message} />;

  return (
    <Card className="rounded-2xl overflow-hidden">
      {/* Top section (teal) */}
      <div className="bg-[#4C7895] text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/15">
            <User className="w-4 h-4" />
          </span>
          <TrendPill delta={data?.onsite?.deltaPct ?? 0} />
        </div>
        <div className="flex items-baseline gap-3">
          <div className="text-5xl font-extrabold leading-none">{data?.onsite?.pct ?? 0}%</div>
          <div className="text-white/85 text-base">Onsite team</div>
        </div>
      </div>

      {/* Bottom inset section */}
      <div className="bg-[#4C7895] p-3">
        <div className="rounded-2xl bg-white p-4 border-2 border-[#3D6C86]">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#E9EEF2]">
              <Globe className="w-4 h-4 text-[#3D6C86]" />
            </span>
            <TrendPill delta={data?.remote?.deltaPct ?? 0} />
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-4xl font-extrabold leading-none text-slate-900">{data?.remote?.pct ?? 0}%</div>
            <div className="text-slate-600 text-base">Remote team</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeamSplitCard;


