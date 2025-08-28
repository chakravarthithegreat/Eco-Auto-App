import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useRoadmapStore } from '../../state/roadmapStore';
import { useTaskStore } from '../../state/taskStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Target, 
  Play, 
  CheckCircle, 
  Clock, 
  User, 
  Award, 
  Zap, 
  TrendingUp, 
  Star,
  Medal,
  Crown,
  Trophy,
  Flag,
  Bell,
  Calendar,
  Timer,
  Heart,
  Pause,
  RotateCcw,
  Coffee,
  BarChart,
  PieChart,
  Users,
  Plus,
  MoreHorizontal,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroProfileCard from './HeroProfileCard';

const TeamMemberDashboard = () => {
  const { user } = useAuthStore();
  const { getStagesByUser, getRoadmap } = useRoadmapStore();
  const { getTasksByUser, startTask, completeTask } = useTaskStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmap');
  const [userAchievements, setUserAchievements] = useState([]);
  const [pomodoroState, setPomodoroState] = useState({
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    mode: 'work' // 'work' or 'break'
  });
  const [showReward, setShowReward] = useState(false);

  // Get user's assigned stages and tasks
  const userStages = getStagesByUser(user?.id);
  const userTasks = getTasksByUser(user?.id);

  // Initialize with mock achievements
  useEffect(() => {
    setUserAchievements([
      { id: 1, title: 'Quick Starter', description: 'Completed first task in under 2 hours', icon: '⚡', earned: true, progress: 100 },
      { id: 2, title: 'Consistent Performer', description: 'Completed 5 tasks this week', icon: '🏆', earned: true, progress: 100 },
      { id: 3, title: 'Team Player', description: 'Helped 3 colleagues with their tasks', icon: '🤝', earned: true, progress: 100 },
      { id: 4, title: 'Perfectionist', description: 'Maintained 100% quality score', icon: '💎', earned: false, progress: 80 },
      { id: 5, title: 'Early Bird', description: 'Submitted 10 tasks ahead of schedule', icon: '🌅', earned: false, progress: 60 }
    ]);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Handle task start with Pomodoro integration
  const handleStartTask = async (taskId) => {
    const result = await startTask(taskId);
    if (result.success) {
      // Start Pomodoro timer
      setPomodoroState(prev => ({
        ...prev,
        isRunning: true,
        timeLeft: 25 * 60
      }));
    }
  };

  // Handle task completion with reward
  const handleCompleteTask = async (taskId) => {
    const result = await completeTask(taskId);
    if (result.success) {
      // Show confetti for task completion
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Show reward animation
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  };

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch (status) {
      case 'TODO':
        return { icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
      case 'DOING':
        return { icon: Play, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' };
      case 'REVIEW':
        return { icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' };
      case 'DONE':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
      case 'BLOCKED':
        return { icon: Flag, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
      default:
        return { icon: Target, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-700' };
    }
  };

  // Get game level for tasks
  const getTaskLevel = (index) => {
    const levels = [
      { name: 'Bronze', icon: Medal, color: 'text-amber-600' },
      { name: 'Silver', icon: Medal, color: 'text-gray-400' },
      { name: 'Gold', icon: Medal, color: 'text-yellow-500' },
      { name: 'Platinum', icon: Trophy, color: 'text-blue-400' },
      { name: 'Diamond', icon: Crown, color: 'text-purple-500' }
    ];
    
    return levels[index % levels.length] || levels[0];
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const priorities = {
      'LOW': { label: 'Low', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
      'MEDIUM': { label: 'Medium', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      'HIGH': { label: 'High', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
      'CRITICAL': { label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
    };
    
    return priorities[priority] || priorities.MEDIUM;
  };

  // Calculate metrics for the dashboard
  const activeTasksCount = userTasks.filter(t => t.status === 'DOING').length;
  const completedTodayCount = userTasks.filter(t => t.status === 'DONE' && new Date(t.updatedAt).toDateString() === new Date().toDateString()).length;
  const streakCount = 7; // This would come from user data in a real implementation
  const achievementsCount = userAchievements.filter(a => a.earned).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <Award className="w-5 h-5" />
            <span>Task Completed!</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <Star className="w-6 h-6" />
            <span className="font-bold">+50 Points!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {user?.name || 'Team Member'}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's your personal roadmap stream
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Metrics Cards - Wireframe Structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Active Tasks</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {activeTasksCount}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-800/50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Completed Today</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {completedTodayCount}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Streak</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{streakCount} days</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Achievements</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {achievementsCount}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'overview'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'roadmap'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('roadmap')}
        >
          My Roadmap
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          My Tasks
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>My Tasks</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userTasks.length > 0 ? (
                  <div className="space-y-3">
                    {userTasks.slice(0, 5).map((task, index) => {
                      const StatusIcon = getStatusConfig(task.status).icon;
                      const statusColor = getStatusConfig(task.status).color;
                      const statusBg = getStatusConfig(task.status).bg;
                      const level = getTaskLevel(index);
                      const LevelIcon = level.icon;
                      const priority = getPriorityBadge(task.priority);
                      
                      return (
                        <div 
                          key={task.id} 
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusBg}`}>
                              <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">
                                {task.title}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${priority.color}`}>
                                  {priority.label}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                  <Timer className="w-3 h-3" />
                                  <span>{task.estHours}h est</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <LevelIcon className={`w-3 h-3 ${level.color}`} />
                              <span>{level.name}</span>
                            </div>
                            {task.status === 'TODO' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStartTask(task.id)}
                                className="flex items-center gap-1"
                              >
                                <Play className="w-3 h-3" />
                                Start
                              </Button>
                            )}
                            {task.status === 'DOING' && (
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleCompleteTask(task.id)}
                                  className="flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Complete
                                </Button>
                              </div>
                            )}
                            {task.status === 'DONE' && (
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                      No tasks assigned
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      You don't have any tasks assigned to you right now.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile and Activity */}
          <div className="space-y-4">
            {/* Hero Profile Card */}
            <HeroProfileCard />
            
            {/* Recent Activity */}
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, user: 'You', action: 'completed', target: 'UI Design Mockups', time: '2 hours ago', type: 'success' },
                    { id: 2, user: 'You', action: 'started', target: 'API Integration', time: '4 hours ago', type: 'info' },
                    { id: 3, user: 'Alex Johnson', action: 'commented', target: 'Project Roadmap', time: '1 day ago', type: 'secondary' },
                    { id: 4, user: 'Taylor Kim', action: 'assigned', target: 'Database Schema', time: '1 day ago', type: 'primary' }
                  ].map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {activity.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'roadmap' && (
        // ... existing roadmap content ...
        <div className="space-y-6">
          {/* Personal Roadmap Stream */}
          <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Personal Roadmap Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userStages.length > 0 ? (
                <div className="space-y-4">
                  {userStages.map((stage) => {
                    const roadmap = getRoadmap(stage.roadmapId);
                    const stageTasks = userTasks.filter(task => task.stageId === stage.id);
                    
                    return (
                      <div key={stage.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">{stage.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{roadmap?.name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusConfig(stage.status).bg} ${getStatusConfig(stage.status).color}`}>
                              {stage.status}
                            </span>
                          </div>
                        </div>
                        
                        {stageTasks.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Tasks in this stage:</h4>
                            {stageTasks.map((task, index) => {
                              const StatusIcon = getStatusConfig(task.status).icon;
                              const statusColor = getStatusConfig(task.status).color;
                              const statusBg = getStatusConfig(task.status).bg;
                              const level = getTaskLevel(index);
                              const LevelIcon = level.icon;
                              const priority = getPriorityBadge(task.priority);
                              
                              return (
                                <div 
                                  key={task.id} 
                                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusBg}`}>
                                      <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-900 dark:text-white text-sm">
                                        {task.title}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${priority.color}`}>
                                          {priority.label}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                          <Timer className="w-3 h-3" />
                                          <span>{task.estHours}h est</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                      <LevelIcon className={`w-3 h-3 ${level.color}`} />
                                      <span>{level.name}</span>
                                    </div>
                                    {task.status === 'TODO' && (
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleStartTask(task.id)}
                                      >
                                        Start
                                      </Button>
                                    )}
                                    {task.status === 'DOING' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => handleCompleteTask(task.id)}
                                      >
                                        Complete
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                    No assigned stages
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    You don't have any stages assigned to you right now.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'tasks' && (
        // ... existing tasks content ...
        <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              My Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userTasks.length > 0 ? (
              <div className="space-y-3">
                {userTasks.map((task, index) => {
                  const StatusIcon = getStatusConfig(task.status).icon;
                  const statusColor = getStatusConfig(task.status).color;
                  const statusBg = getStatusConfig(task.status).bg;
                  const level = getTaskLevel(index);
                  const LevelIcon = level.icon;
                  const priority = getPriorityBadge(task.priority);
                  
                  return (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusBg}`}>
                          <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {task.title}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {task.desc}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${priority.color}`}>
                              {priority.label}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Timer className="w-3 h-3" />
                              <span>{task.estHours}h est</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {new Date(task.dueAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <LevelIcon className={`w-3 h-3 ${level.color}`} />
                          <span>{level.name}</span>
                        </div>
                        {task.status === 'TODO' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleStartTask(task.id)}
                            className="flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Start
                          </Button>
                        )}
                        {task.status === 'DOING' && (
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCompleteTask(task.id)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Complete
                            </Button>
                          </div>
                        )}
                        {task.status === 'DONE' && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  No tasks assigned
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  You don't have any tasks assigned to you right now.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamMemberDashboard;