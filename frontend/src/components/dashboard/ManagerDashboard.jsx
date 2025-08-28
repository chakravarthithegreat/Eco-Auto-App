import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useTaskStore } from '../../state/taskStore';
import { useTATStore } from '../../state/tatStore';
import { useNotificationStore } from '../../state/notificationStore';
import { usePayrollStore } from '../../state/payrollStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Award,
  Calendar,
  BarChart3,
  Bell,
  MoreHorizontal,
  Search,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import WorkHoursMatrix from '../tasks/WorkHoursMatrix';
import TeamDistributionCard from './TeamDistributionCard';
import HiringStatisticsCard from './HiringStatisticsCard';
import UserProfileCard from './UserProfileCard';
import WorkTimeChart from './WorkTimeChart';
import HeroProfileCard from './HeroProfileCard';

const ManagerDashboard = () => {
  const { user } = useAuthStore();
  const { tasks } = useTaskStore();
  const { getTATAnalytics, getTeamMemberPerformance } = useTATStore();
  const { notifications, getApprovalNotifications } = useNotificationStore();
  const { employees } = usePayrollStore();

  const [tatAnalytics, setTatAnalytics] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [approvalNotifications, setApprovalNotifications] = useState([]);

  // Get TAT analytics
  useEffect(() => {
    const analytics = getTATAnalytics();
    setTatAnalytics(analytics);
    
    const performance = getTeamMemberPerformance();
    setTeamPerformance(performance);
    
    const approvals = getApprovalNotifications().filter(
      notification => !notification.status || notification.status === 'pending'
    );
    setApprovalNotifications(approvals);
  }, [getTATAnalytics, getTeamMemberPerformance, getApprovalNotifications]);

  // Task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length
  };

  // Approval statistics
  const approvalStats = {
    pending: approvalNotifications.length,
    approved: notifications.filter(n => n.status === 'approved').length,
    rejected: notifications.filter(n => n.status === 'rejected').length
  };

  // Team statistics
  const teamStats = {
    total: employees.length,
    active: employees.filter(e => e.isActive).length,
    onLeave: employees.filter(e => !e.isActive).length
  };

  // Prepare data for charts
  const taskStatusData = [
    { name: 'Completed', value: taskStats.completed, color: 'var(--success)' },
    { name: 'In Progress', value: taskStats.inProgress, color: 'var(--info)' },
    { name: 'Pending', value: taskStats.pending, color: 'var(--warning)' }
  ];

  const approvalStatusData = [
    { name: 'Pending', value: approvalStats.pending, color: 'var(--warning)' },
    { name: 'Approved', value: approvalStats.approved, color: 'var(--success)' },
    { name: 'Rejected', value: approvalStats.rejected, color: 'var(--danger)' }
  ];

  const efficiencyData = teamPerformance.slice(0, 5).map(member => ({
    name: member.name.split(' ')[0], // First name only for chart
    efficiency: member.averageEfficiency
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manager Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">
            Welcome back, {user?.name || 'Manager'}! Here's your overview.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl hover:shadow transition-all duration-200">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filter</span>
          </button>
          <button className="p-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl hover:shadow transition-all duration-200">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-slate-500">Pending Approvals</h3>
              <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{approvalStats.pending}</span>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">+2</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-slate-500">Active Tasks</h3>
              <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{taskStats.inProgress}</span>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">+5</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-slate-500">Team Members</h3>
              <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{teamStats.active}</span>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">+2</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-slate-500">Avg Efficiency</h3>
              <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">
                {tatAnalytics?.averageEfficiency || 0}%
              </span>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">+3%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Work Hours Matrix */}
          <WorkHoursMatrix data={{
            hours: 46.5,
            trend: "+0.5%",
            dots: Array(30).fill(false).map(() => Math.random() > 0.5)
          }} />

          {/* Team Distribution */}
          <TeamDistributionCard data={{
            onsitePercentage: 65,
            remotePercentage: 35,
            onsiteTrend: "+2.6%",
            remoteTrend: "+2.6%"
          }} />

          {/* Hiring Statistics */}
          <HiringStatisticsCard data={{
            matchedCount: 120,
            notMatchCount: 80
          }} />

          {/* Team Performance Chart */}
          <Card className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-slate-700">Top Performers (Efficiency)</h3>
                <Button variant="outline" size="sm" className="text-xs px-2.5 py-1.5">
                  View Report
                </Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={efficiencyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--neutral-200)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: 'var(--neutral-500)' }} 
                    />
                    <YAxis 
                      domain={[0, 150]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: 'var(--neutral-500)' }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--neutral-200)'
                      }} 
                    />
                    <Bar 
                      dataKey="efficiency" 
                      name="Efficiency %" 
                      fill="#8B5CF6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Hero Profile Card */}
          <HeroProfileCard />

          {/* Work Time Chart */}
          <WorkTimeChart data={{
            hours: 46,
            trend: "+0.5%"
          }} />

          {/* Pending Approvals */}
          <Card className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-slate-700">Pending Work Approvals</h3>
                <Badge variant="warning" className="rounded-full text-xs">
                  {approvalStats.pending} pending
                </Badge>
              </div>
              
              {approvalNotifications.length > 0 ? (
                <div className="space-y-3">
                  {approvalNotifications.slice(0, 3).map(notification => (
                    <div 
                      key={notification.id} 
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <img 
                        src={`https://randomuser.me/api/portraits/${notification.id % 2 === 0 ? 'women' : 'men'}/${notification.id + 30}.jpg`}
                        alt={notification.userName} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-900 truncate">{notification.userName}</div>
                        <div className="text-xs text-slate-500 truncate">Completed task: {notification.taskName}</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs px-2.5 py-1.5 bg-white border-slate-200 hover:bg-slate-50"
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                  
                  {approvalNotifications.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm" className="text-xs px-2.5 py-1.5">
                        View All {approvalNotifications.length} Pending Approvals
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-slate-900 mb-1">No Pending Approvals</h3>
                  <p className="text-xs text-slate-500">
                    All work completion requests have been processed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;