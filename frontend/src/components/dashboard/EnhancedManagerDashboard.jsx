import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useRoadmapStore } from '../../state/roadmapStore';
import { useTaskStore } from '../../state/taskStore';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Users, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Search,
  Plus,
  Target,
  BarChart3,
  Zap,
  Award,
  Phone,
  Mail,
  Globe,
  Filter,
  Download,
  Share2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Flag,
  Eye,
  Lock,
  UserCheck,
  Bell,
  UserPlus,
  Send,
  ArrowUp,
  Settings,
  Monitor,
  Volume2,
  Contrast
} from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import WorkHoursMatrix from '../tasks/WorkHoursMatrix';
import CollapsibleSection from '../ui/CollapsibleSection';
import TeamDistributionCard from './TeamDistributionCard';
import ResponsibilityMatrix from './ResponsibilityMatrix';
import RoadmapBoard from '../roadmaps/RoadmapBoard';

const EnhancedManagerDashboard = () => {
  const { user } = useAuthStore();
  const { roadmaps, getReadyStages, getBlockedStages } = useRoadmapStore();
  const { tasks, getTaskStatistics, updateStage } = useTaskStore();
  const [teamActivities, setTeamActivities] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    teamPerformance: true,
    quickActions: true,
    teamDistribution: true,
    projects: true,
    notifications: true
  });
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [selectedStages, setSelectedStages] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [density, setDensity] = useState('comfortable');
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    reducedMotion: false,
    fontSize: 'normal'
  });

  // Get ready stages
  const readyStages = getReadyStages();

  // Toggle stage selection
  const toggleStageSelection = (stageId) => {
    setSelectedStages(prev => {
      if (prev.includes(stageId)) {
        return prev.filter(id => id !== stageId);
      } else {
        return [...prev, stageId];
      }
    });
  };

  // Select all ready stages
  const selectAllStages = () => {
    if (selectedStages.length === readyStages.length) {
      setSelectedStages([]);
    } else {
      setSelectedStages(readyStages.map(stage => stage.id));
    }
  };

  // Bulk assign stages
  const bulkAssign = (userId) => {
    selectedStages.forEach(stageId => {
      updateStage(roadmaps[0].id, stageId, { 
        assignedUserId: userId,
        status: 'IN_PROGRESS'
      });
    });
    setSelectedStages([]);
    setShowBulkActions(false);
  };

  // Bulk nudge stages
  const bulkNudge = () => {
    console.log('Nudging stages:', selectedStages);
    // In a real implementation, this would send notifications to assignees
    setSelectedStages([]);
    setShowBulkActions(false);
  };

  // Bulk escalate stages
  const bulkEscalate = () => {
    console.log('Escalating stages:', selectedStages);
    // In a real implementation, this would escalate to higher management
    selectedStages.forEach(stageId => {
      updateStage(roadmaps[0].id, stageId, { 
        status: 'BLOCKED',
        blockedReason: 'Escalated to management'
      });
    });
    setSelectedStages([]);
    setShowBulkActions(false);
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

  // Initialize with mock data
  useEffect(() => {
    // Mock team activities
    setTeamActivities([
      { id: 1, user: 'Sarah Johnson', action: 'completed project', target: 'Website Redesign', time: '2 hours ago', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', type: 'success' },
      { id: 2, user: 'Michael Chen', action: 'earned', target: '50 stars', time: '4 hours ago', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', type: 'reward' },
      { id: 3, user: 'Emma Davis', action: 'submitted', target: 'Quarterly Report', time: '1 day ago', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', type: 'document' },
      { id: 4, user: 'David Wilson', action: 'completed', target: 'API Integration', time: '1 day ago', avatar: 'https://randomuser.me/api/portraits/men/51.jpg', type: 'success' },
      { id: 5, user: 'Priya Patel', action: 'needs approval', target: 'Leave Request', time: '30 mins ago', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', type: 'pending' }
    ]);

    // Mock user achievements
    setUserAchievements([
      { id: 1, title: 'Team Builder', description: 'Built a team of 10+ members', icon: '👥', earned: true, progress: 100 },
      { id: 2, title: 'Efficiency Master', description: 'Maintained 90%+ team efficiency', icon: '⚡', earned: true, progress: 100 },
      { id: 3, title: 'Mentor', description: 'Mentored 5 team members to promotion', icon: '🎓', earned: true, progress: 100 },
      { id: 4, title: 'Innovator', description: 'Implemented 3 process improvements', icon: '💡', earned: false, progress: 60 }
    ]);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get task statistics
  const taskStats = getTaskStatistics().allStats;

  // Enhanced KPI data with predictive insights and psychology-based design
  const kpiData = [
    { 
      title: "Team Members", 
      value: "12", 
      trend: "+2", 
      icon: <Users className="w-6 h-6" />, 
      iconBgColor: "bg-light-secondary/10 dark:bg-dark-secondary/20", 
      iconColor: "text-light-secondary dark:text-dark-secondary",
      insight: "Optimal team size for current projects",
      prediction: "Projected growth: +3 in Q3",
      description: "Healthy team expansion trajectory"
    },
    { 
      title: "Active Tasks", 
      value: taskStats.doing + taskStats.review, 
      trend: "+" + (taskStats.doing + taskStats.review - 5), 
      icon: <CheckSquare className="w-6 h-6" />, 
      iconBgColor: "bg-light-success/10 dark:bg-dark-success/20", 
      iconColor: "text-light-success dark:text-dark-success",
      insight: `${Math.round(((taskStats.done) / (taskStats.total || 1)) * 100)}% task completion rate`,
      prediction: "Peak productivity hours: 10AM-2PM",
      description: "Consistent task throughput maintained"
    },
    { 
      title: "Pending Approvals", 
      value: taskStats.review, 
      trend: "+" + (taskStats.review - 2), 
      icon: <Clock className="w-6 h-6" />, 
      iconBgColor: "bg-light-warning/10 dark:bg-dark-warning/20", 
      iconColor: "text-light-warning dark:text-dark-warning",
      insight: "Avg. approval time: 2.3 hours",
      prediction: "Automate 60% with new workflow rules",
      description: "Streamlining approval processes"
    },
    { 
      title: "Avg Efficiency", 
      value: "87%", 
      trend: "+3%", 
      icon: <TrendingUp className="w-6 h-6" />, 
      iconBgColor: "bg-light-accent/10 dark:bg-dark-accent/20", 
      iconColor: "text-light-accent dark:text-dark-accent",
      insight: "Top performing team this quarter",
      prediction: "Potential to reach 92% with current trends",
      description: "Exceptional team performance metrics"
    }
  ];

  // Team distribution data
  const teamDistribution = {
    onsite: { percentage: 65, count: 8, trend: "+2%" },
    remote: { percentage: 35, count: 4, trend: "-2%" }
  };

  // Working hours data with enhanced insights
  const workingHoursData = {
    hours: 46.5,
    trend: "+0.5%",
    dots: Array(30).fill(0).map(() => Math.random() > 0.3),
    insights: [
      "Peak productivity: 10AM-3PM",
      "Team collaboration highest: 2PM-4PM",
      "Recommended meeting slots: 11AM, 3PM"
    ]
  };

  // Get status icon and color for roadmap stages
  const getStatusConfig = (status) => {
    switch (status) {
      case 'LOCKED':
        return { icon: Lock, color: 'text-light-text-tertiary dark:text-dark-text-tertiary', bg: 'bg-light-bg-secondary dark:bg-dark-bg-secondary' };
      case 'READY':
        return { icon: Play, color: 'text-light-secondary dark:text-dark-secondary', bg: 'bg-light-secondary/10 dark:bg-dark-secondary/10' };
      case 'IN_PROGRESS':
        return { icon: Clock, color: 'text-light-warning dark:text-dark-warning', bg: 'bg-light-warning/10 dark:bg-dark-warning/10' };
      case 'REVIEW':
        return { icon: Eye, color: 'text-light-accent dark:text-dark-accent', bg: 'bg-light-accent/10 dark:bg-dark-accent/10' };
      case 'DONE':
        return { icon: CheckSquare, color: 'text-light-success dark:text-dark-success', bg: 'bg-light-success/10 dark:bg-dark-success/10' };
      case 'BLOCKED':
        return { icon: AlertCircle, color: 'text-light-danger dark:text-dark-danger', bg: 'bg-light-danger/10 dark:bg-dark-danger/10' };
      default:
        return { icon: Lock, color: 'text-light-text-tertiary dark:text-dark-text-tertiary', bg: 'bg-light-bg-secondary dark:bg-dark-bg-secondary' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Personalized Header with Achievements */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {getGreeting()}, {user?.name || 'Manager'}!
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {userAchievements.filter(ach => ach.earned).slice(0, 3).map(achievement => (
              <div key={achievement.id} className="flex items-center gap-1 bg-light-secondary/10 dark:bg-dark-secondary/10 text-light-secondary dark:text-dark-secondary px-2 py-1 rounded-full text-xs border border-light-secondary/20 dark:border-dark-secondary/20">
                <span>{achievement.icon}</span>
                <span className="font-medium">{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary rounded-xl hover:shadow-glass-sm transition-all duration-200" data-action-id="manager.settings">
            <Settings className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
            <span className="text-sm font-medium text-light-text dark:text-dark-text">Settings</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary rounded-xl hover:shadow-glass-sm transition-all duration-200" data-action-id="manager.filter">
            <Calendar className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
            <span className="text-sm font-medium text-light-text dark:text-dark-text">Filter</span>
          </button>
          <button className="p-2 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary rounded-xl hover:shadow-glass-sm transition-all duration-200" data-action-id="manager.search">
            <Search className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards with Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="relative group">
            <StatsCard 
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              icon={kpi.icon}
              iconBgColor={kpi.iconBgColor}
              iconColor={kpi.iconColor}
            />
            <div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text" data-action-id={`manager.kpi-options-${index}`}>
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1 text-xs text-light-text-secondary dark:text-dark-text-secondary pl-1">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-light-accent dark:text-dark-accent" />
                <span>{kpi.insight}</span>
              </div>
              <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                {kpi.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Performance Insights Section */}
        <CollapsibleSection 
          title="Team Performance Insights" 
          defaultOpen={expandedSections.teamPerformance}
          icon={BarChart3}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Enhanced Working Hours */}
            <div className="md:col-span-2">
              <WorkHoursMatrix data={workingHoursData} />
            </div>
            
            {/* Team Distribution - Updated to use the enhanced component */}
            <div className="md:col-span-1">
              <TeamDistributionCard data={{
                onsitePercentage: teamDistribution.onsite.percentage,
                remotePercentage: teamDistribution.remote.percentage,
                onsiteCount: teamDistribution.onsite.count,
                remoteCount: teamDistribution.remote.count,
                onsiteTrend: teamDistribution.onsite.trend,
                remoteTrend: teamDistribution.remote.trend
              }} />
            </div>
          </div>
        </CollapsibleSection>

        {/* Projects Overview */}
        <CollapsibleSection 
          title="Projects & Roadmaps" 
          defaultOpen={expandedSections.projects}
          icon={Target}
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Project Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmaps.slice(0, 3).map((roadmap) => {
                const roadmapWithMetrics = useRoadmapStore.getState().getRoadmapWithMetrics(roadmap.id);
                return (
                  <Card key={roadmap.id} className="rounded-2xl bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-light-bg-secondary dark:border-dark-bg-secondary shadow-glass-sm hover:shadow-glass-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-light-text dark:text-dark-text">{roadmap.name}</h3>
                        <button 
                          className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text"
                          onClick={() => setSelectedRoadmap(roadmap.id)}
                          data-action-id="manager.view-roadmap-board"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-light-text-secondary dark:text-dark-text-secondary">Progress</span>
                          <span className="font-medium text-light-text dark:text-dark-text">{roadmapWithMetrics.progress}%</span>
                        </div>
                        <div className="w-full bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-light-secondary to-light-accent h-2 rounded-full" 
                            style={{ width: `${roadmapWithMetrics.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-light-text-secondary dark:text-dark-text-secondary">
                          <Flag className="w-4 h-4" />
                          <span>{roadmapWithMetrics.completedStages}/{roadmapWithMetrics.totalStages} stages</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setSelectedRoadmap(roadmap.id)}>
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default EnhancedManagerDashboard;