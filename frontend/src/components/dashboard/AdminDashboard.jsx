import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useRoadmapStore } from '../../state/roadmapStore';
import { useTaskStore } from '../../state/taskStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Award, 
  BarChart3, 
  Target, 
  Flag, 
  UserCheck,
  Settings,
  Palette,
  Monitor,
  Contrast,
  Volume2,
  Bell,
  Globe,
  Lock,
  Shield
} from 'lucide-react';
import { Button } from '../ui/Button';
import StatsCard from '../ui/StatsCard';
import ResponsibilityMatrix from './ResponsibilityMatrix';
import DashboardHeader from './DashboardHeader';
import WidgetGallery from './WidgetGallery';
import AverageWorkTimeCard from './widgets/AverageWorkTimeCard';
import AverageHoursCard from './widgets/AverageHoursCard';
import HoursWithTeamSplit from './widgets/HoursWithTeamSplit';
import TeamSplitCard from './widgets/TeamSplitCard';
import TeamCompositionCard from './widgets/TeamCompositionCard';
import HiringStatisticsCard from './HiringStatisticsCard';
import PayrollSummaryCard from './widgets/PayrollSummaryCard';
import HeroProfileCard from './HeroProfileCard';
import RoadmapBoardGame from '../roadmaps/RoadmapBoardGame';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const { 
    roadmaps, 
    getRoadmapMetrics, 
    getSLARisks, 
    getStageAging, 
    getStageThroughput 
  } = useRoadmapStore();
  const { getTaskStatistics, getSLARisks: getTaskSLARisks } = useTaskStore();
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [density, setDensity] = useState('comfortable');
  const [themeMode, setThemeMode] = useState('system');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    slack: false
  });
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'normal'
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Get metrics
  const roadmapMetrics = getRoadmapMetrics();
  const taskStats = getTaskStatistics().allStats;
  const stageSLARisks = getSLARisks();
  const taskSLARisks = getTaskSLARisks();
  const stageAging = getStageAging();
  const stageThroughput = getStageThroughput();

  // Enhanced KPI data with psychology-based insights
  const kpiData = [
    { 
      title: "Total Projects", 
      value: roadmapMetrics.total, 
      trend: "+2", 
      icon: <Target className="w-6 h-6" />, 
      iconBgColor: "bg-light-secondary/10 dark:bg-dark-secondary/20", 
      iconColor: "text-light-secondary dark:text-dark-secondary",
      insight: "2 new projects this month",
      description: "Maintaining project portfolio growth"
    },
    { 
      title: "Active Stages", 
      value: roadmapMetrics.totalStages, 
      trend: "+5", 
      icon: <Zap className="w-6 h-6" />, 
      iconBgColor: "bg-light-accent/10 dark:bg-dark-accent/20", 
      iconColor: "text-light-accent dark:text-dark-accent",
      insight: "Avg. 3.2 stages per project",
      description: "Optimal workflow distribution"
    },
    { 
      title: "Task Completion", 
      value: `${Math.round(((taskStats.done) / (taskStats.total || 1)) * 100)}%`, 
      trend: "+3%", 
      icon: <CheckCircle className="w-6 h-6" />, 
      iconBgColor: "bg-light-success/10 dark:bg-dark-success/20", 
      iconColor: "text-light-success dark:text-dark-success",
      insight: "On track for 87% this quarter",
      description: "Sustained productivity levels"
    },
    { 
      title: "SLA Risks", 
      value: String((stageSLARisks?.length || 0) + (taskSLARisks?.length || 0) || 2), 
      trend: "-2", 
      icon: <AlertTriangle className="w-6 h-6" />, 
      iconBgColor: "bg-light-warning/10 dark:bg-dark-warning/20", 
      iconColor: "text-light-warning dark:text-dark-warning",
      insight: "2 critical risks identified",
      description: "Proactive risk management"
    }
  ];

  // Get top aging stages
  const topAgingStages = stageAging
    .sort((a, b) => b.ageInDays - a.ageInDays)
    .slice(0, 5);

  // Get throughput by responsibility
  const throughputData = Object.entries(stageThroughput)
    .map(([responsibility, data]) => ({
      responsibility,
      ...data,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    }))
    .sort((a, b) => b.completionRate - a.completionRate);

  // Get users for assignment
  const getUsers = () => {
    return [
      { id: '1', name: 'Admin User', role: 'ADMIN', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '2', name: 'Manager User', role: 'MANAGER', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '3', name: 'Team Member', role: 'TEAM_MEMBER', avatar: 'https://randomuser.me/api/portraits/men/51.jpg' }
    ];
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Handle escalation
  const handleEscalate = (riskId, type) => {
    console.log(`Escalating ${type} risk ${riskId}`);
    // In a real implementation, this would trigger an escalation workflow
  };

  // Handle assignment
  const handleAssign = (riskId, userId, type) => {
    console.log(`Assigning ${type} risk ${riskId} to user ${userId}`);
    // In a real implementation, this would assign the task/stage to the user
  };

  // Toggle notification settings
  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Toggle accessibility settings
  const toggleAccessibility = (type) => {
    setAccessibility(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Change font size
  const changeFontSize = (size) => {
    setAccessibility(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">


      {/* Header with personalized greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-light-text dark:text-dark-text truncate">
            {getGreeting()}, {user?.name || 'Admin'}!
          </h1>
          <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary break-words">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-light-bg-secondary dark:border-dark-bg-secondary bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text" data-action-id="admin.settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

            {/* Enhanced KPI Cards with psychology-based insights - TOP OF DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="relative group">
            <StatsCard 
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              icon={kpi.icon}
              iconBgColor={kpi.iconBgColor}
              iconColor={kpi.iconColor}
              insight={kpi.insight}
              description={kpi.description}
            />
            <div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text" data-action-id={`admin.kpi-options-${index}`}>
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Main layout: Left column (Profile + Work Time) | Right column (8 Hours + Team + Team Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column: Profile card only */}
        <div>
          <HeroProfileCard />
        </div>
        
        {/* Right column: 8 Hours matrix card + Track your team card + Team split card stacked */}
        <div className="space-y-4">
          <AverageHoursCard />
          <TeamCompositionCard />
          <TeamSplitCard />
        </div>
      </div>

      {/* Bottom row: remaining cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AverageWorkTimeCard />
        <HiringStatisticsCard />
        <PayrollSummaryCard />
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Risk Management */}
        <Card className="rounded-2xl bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary shadow-glass-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-light-warning dark:text-dark-warning" />
              SLA Risk Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...stageSLARisks, ...taskSLARisks].slice(0, 3).map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-light-text dark:text-dark-text">{risk.title || risk.name}</h4>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {risk.type === 'stage' ? 'Stage SLA at risk' : 'Task SLA at risk'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEscalate(index, risk.type)}>
                      Escalate
                    </Button>
                    <select 
                      className="text-sm border border-light-bg-secondary dark:border-dark-bg-secondary rounded px-2 py-1 bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text"
                      onChange={(e) => handleAssign(index, e.target.value, risk.type)}
                    >
                      <option value="">Assign to...</option>
                      {getUsers().map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card className="rounded-2xl bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary shadow-glass-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-light-accent dark:text-dark-accent" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-light-secondary dark:text-dark-secondary" />
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">Users</span>
                </div>
                <p className="text-lg font-bold text-light-text dark:text-dark-text">24</p>
              </div>
              <div className="p-3 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-light-secondary dark:text-dark-secondary" />
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">Projects</span>
                </div>
                <p className="text-lg font-bold text-light-text dark:text-dark-text">{roadmapMetrics.total}</p>
              </div>
              <div className="p-3 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-light-success dark:text-dark-success" />
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">Tasks Done</span>
                </div>
                <p className="text-lg font-bold text-light-text dark:text-dark-text">{taskStats.done}</p>
              </div>
              <div className="p-3 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-light-warning dark:text-dark-warning" />
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">Pending</span>
                </div>
                <p className="text-lg font-bold text-light-text dark:text-dark-text">{taskStats.todo + taskStats.doing + taskStats.review}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsibility Matrix */}
      <ResponsibilityMatrix />

      {/* Aging Stages */}
      <Card className="rounded-2xl bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary shadow-glass-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-light-warning dark:text-dark-warning" />
            Aging Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topAgingStages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-light-text dark:text-dark-text">{stage.title}</h4>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {stage.ageInDays} days in {stage.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  <Button size="sm" variant="outline">
                    Escalate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Throughput by Responsibility */}
      <Card className="rounded-2xl bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary shadow-glass-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-light-accent dark:text-dark-accent" />
            Throughput by Responsibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {throughputData.slice(0, 5).map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-light-bg-secondary/30 dark:bg-dark-bg-secondary/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-light-text dark:text-dark-text">{data.responsibility}</h4>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {data.completed}/{data.total} completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-light-text dark:text-dark-text">{data.completionRate}%</p>
                  <div className="w-20 h-2 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-light-success dark:bg-dark-success rounded-full"
                      style={{ width: `${data.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      <Card className="rounded-2xl bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary shadow-glass-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
            Dashboard Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notifications */}
            <div>
              <h4 className="font-medium text-light-text dark:text-dark-text mb-3">Notifications</h4>
              <div className="space-y-2">
                {Object.entries(notifications).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary capitalize">{type}</span>
                    <button
                      onClick={() => toggleNotification(type)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        enabled ? 'bg-light-success dark:bg-dark-success' : 'bg-light-bg-secondary dark:bg-dark-bg-secondary'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <div>
              <h4 className="font-medium text-light-text dark:text-dark-text mb-3">Accessibility</h4>
              <div className="space-y-2">
                {Object.entries(accessibility).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <button
                      onClick={() => toggleAccessibility(type)}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        enabled ? 'bg-light-success dark:bg-dark-success' : 'bg-light-bg-secondary dark:bg-dark-bg-secondary'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;