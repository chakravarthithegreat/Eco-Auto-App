import { useQuery } from '@tanstack/react-query';
import { DashboardAPI } from '../services/dashboardApi';

export function useHours() {
  return useQuery({
    queryKey: ['dashboard', 'hours'],
    queryFn: DashboardAPI.getHours,
    staleTime: 60_000,
  });
}

export function useTeamSplit() {
  return useQuery({ queryKey: ['dashboard', 'team-split'], queryFn: DashboardAPI.getTeamSplit, staleTime: 60_000 });
}

export function useTeamComposition() {
  return useQuery({ queryKey: ['dashboard', 'team-composition'], queryFn: DashboardAPI.getTeamComposition, staleTime: 60_000 });
}

export function useRecruitment() {
  return useQuery({ queryKey: ['hiring', 'pipeline'], queryFn: DashboardAPI.getRecruitmentPipeline, staleTime: 60_000 });
}

export function usePayouts() {
  return useQuery({ queryKey: ['payroll', 'payouts'], queryFn: DashboardAPI.getPayouts, staleTime: 60_000 });
}

export function usePayrollSummary() {
  return useQuery({ queryKey: ['payroll', 'summary'], queryFn: DashboardAPI.getPayrollSummary, staleTime: 60_000 });
}


