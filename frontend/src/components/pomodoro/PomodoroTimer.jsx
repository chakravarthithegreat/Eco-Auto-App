import React, { useState, useEffect } from 'react';
import { usePomodoroStore } from '../../state/pomodoroStore';
import { useTaskStore } from '../../state/taskStore';
import { useAuthStore } from '../../state/authStore';
import { useRewardsStore } from '../../state/rewardsStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Play,
  Pause,
  Square,
  SkipForward,
  Target,
  Coffee,
  Star,
  Settings,
  History,
  TrendingUp,
  Award,
  Clock,
  Zap,
  BarChart2,
  Bell,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const PomodoroTimer = () => {
  const {
    isRunning,
    currentSession,
    timeRemaining,
    sessionCount,
    currentSessionData,
    todayStats,
    sessions,
    settings,
    startTimer,
    pauseTimer,
    stopTimer,
    tick,
    switchSession,
    setCurrentTask,
    setProductivity,
    updateSettings,
    formatTime,
    getProgress,
    requestNotificationPermission
  } = usePomodoroStore();
  
  const { tasks } = useTaskStore();
  const { user } = useAuthStore();
  const { addReward } = useRewardsStore();
  
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [productivityRating, setProductivityRating] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState('timer');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Get user's tasks for task selection
  const userTasks = tasks.filter(task => 
    task.assigneeId === (user?.id || 1) && 
    ['Pending', 'In Progress'].includes(task.status)
  );
  
  // Timer tick effect
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);
  
  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);
  
  // Handle task selection
  const handleTaskSelect = (taskId) => {
    const task = userTasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTaskId(taskId);
      setCurrentTask(taskId, task.title);
    }
  };
  
  // Handle start timer
  const handleStart = () => {
    if (currentSession === 'work' && selectedTaskId) {
      const task = userTasks.find(t => t.id === selectedTaskId);
      setCurrentTask(selectedTaskId, task?.title);
    }
    startTimer();
  };
  
  // Handle session completion
  const handleSessionComplete = async () => {
    // Award reward for completed work session
    if (currentSession === 'work' && productivityRating >= 4) {
      const rewardType = productivityRating === 5 ? 'star' : 'butterfly';
      await addReward(rewardType, `Pomodoro session completed with ${productivityRating}/5 rating`);
    }
    setShowCompletionModal(false);
    setProductivityRating(null);
  };
  
  // Save settings
  const handleSaveSettings = () => {
    updateSettings(localSettings);
    setShowSettings(false);
  };
  
  // Get session display info
  const getSessionInfo = () => {
    switch (currentSession) {
      case 'work':
        return {
          title: 'Focus Time',
          icon: Target,
          color: 'text-primary-600',
          bgColor: 'bg-primary-50',
          ringColor: 'text-primary-500',
          description: 'Time to focus and be productive!'
        };
      case 'shortBreak':
        return {
          title: 'Short Break',
          icon: Coffee,
          color: 'text-accent-600',
          bgColor: 'bg-accent-50',
          ringColor: 'text-accent-500',
          description: 'Take a 5-minute breather'
        };
      case 'longBreak':
        return {
          title: 'Long Break',
          icon: Coffee,
          color: 'text-info-600',
          bgColor: 'bg-info-50',
          ringColor: 'text-info-500',
          description: 'Enjoy a longer 15-minute break'
        };
      default:
        return {
          title: 'Pomodoro',
          icon: Target,
          color: 'text-surface-600',
          bgColor: 'bg-surface-50',
          ringColor: 'text-surface-500',
          description: 'Ready to start?'
        };
    }
  };
  
  const sessionInfo = getSessionInfo();
  const progress = getProgress();
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Get recent sessions
  const recentSessions = sessions.slice(-5).reverse();
  
  // Get productivity label
  const getProductivityLabel = (rating) => {
    switch (rating) {
      case 1: return 'Very Poor';
      case 2: return 'Poor';
      case 3: return 'Average';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-6 border border-red-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-amber-500 rounded-xl shadow-md">
            <Target className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
              Pomodoro Timer
            </h1>
            <p className="text-surface-600 mt-1">
              Boost your productivity with focused work sessions
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-surface-200">
        <button
          onClick={() => setActiveTab('timer')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'timer'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          Timer
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'stats'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          History
        </button>
      </div>

      {activeTab === 'timer' && (
        <div className="space-y-6">
          {/* Enhanced Main Timer Card */}
          <Card className="max-w-2xl mx-auto shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className={`p-3 rounded-full ${sessionInfo.bgColor} shadow-md`}>
                  <sessionInfo.icon className={`h-8 w-8 ${sessionInfo.color}`} />
                </div>
                <div>
                  <CardTitle className={`text-2xl ${sessionInfo.color}`}>{sessionInfo.title}</CardTitle>
                  <p className="text-surface-600 text-sm mt-1">{sessionInfo.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Enhanced Circular Progress Timer */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 256 256">
                    {/* Background circle */}
                    <circle 
                      cx="128" 
                      cy="128" 
                      r="120" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="none" 
                      className="text-surface-100" 
                    />
                    {/* Progress circle */}
                    <circle
                      cx="128" 
                      cy="128" 
                      r="120" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeLinecap="round"
                      className={sessionInfo.ringColor}
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                        transition: 'stroke-dashoffset 1s ease-in-out'
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-surface-900 mb-1">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm text-surface-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Session {sessionCount + 1}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Timer Controls */}
              <div className="flex justify-center gap-4 mb-6">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="flex items-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    disabled={currentSession === 'work' && !selectedTaskId}
                  >
                    <Play className="h-5 w-5" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={pauseTimer}
                    size="lg"
                    variant="secondary"
                    className="flex items-center gap-2 px-6 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                )}
                
                <Button 
                  onClick={stopTimer} 
                  size="lg" 
                  variant="outline" 
                  className="flex items-center gap-2 px-6 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Square className="h-5 w-5" />
                  Stop
                </Button>
                
                <Button 
                  onClick={() => setShowSettings(true)} 
                  size="lg" 
                  variant="outline" 
                  className="flex items-center gap-2 px-6 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Enhanced Session Type Selector */}
              <div className="flex justify-center gap-3 mb-6 flex-wrap">
                <Button
                  onClick={() => switchSession('work')}
                  variant={currentSession === 'work' ? 'primary' : 'outline'}
                  className={`px-4 py-2 rounded-full ${currentSession === 'work' ? 'shadow-md' : 'border-2 hover:shadow-md'}`}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Work
                </Button>
                <Button
                  onClick={() => switchSession('shortBreak')}
                  variant={currentSession === 'shortBreak' ? 'secondary' : 'outline'}
                  className={`px-4 py-2 rounded-full ${currentSession === 'shortBreak' ? 'shadow-md' : 'border-2 hover:shadow-md'}`}
                >
                  <Coffee className="h-4 w-4 mr-2" />
                  Short Break
                </Button>
                <Button
                  onClick={() => switchSession('longBreak')}
                  variant={currentSession === 'longBreak' ? 'secondary' : 'outline'}
                  className={`px-4 py-2 rounded-full ${currentSession === 'longBreak' ? 'shadow-md' : 'border-2 hover:shadow-md'}`}
                >
                  <Coffee className="h-4 w-4 mr-2" />
                  Long Break
                </Button>
              </div>
              
              {/* Enhanced Task Selection for Work Sessions */}
              {currentSession === 'work' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Select Task to Work On
                    </label>
                    <select
                      value={selectedTaskId || ''}
                      onChange={(e) => handleTaskSelect(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-sm hover:shadow-md transition-shadow"
                    >
                      <option value="">Choose a task...</option>
                      {userTasks.map(task => (
                        <option key={task.id} value={task.id}>
                          {task.title} - {task.category || 'General'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedTaskId && (
                    <div className={`p-4 ${sessionInfo.bgColor} rounded-xl border border-surface-200 shadow-sm`}>
                      <div className="flex items-center gap-2">
                        <Target className={`h-5 w-5 ${sessionInfo.color}`} />
                        <div className="font-medium text-surface-800">
                          Working on: {userTasks.find(t => t.id === selectedTaskId)?.title}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Productivity Rating */}
          {!isRunning && currentSessionData.startTime && currentSession === 'work' && (
            <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-accent-50 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-primary-800 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Rate Your Productivity
                </CardTitle>
                <p className="text-primary-700 text-sm mt-1">
                  How focused were you during this session?
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 justify-center mb-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      onClick={() => {
                        setProductivityRating(rating);
                        setProductivity(rating);
                      }}
                      variant={productivityRating === rating ? 'primary' : 'outline'}
                      size="lg"
                      className={`w-14 h-14 p-0 rounded-full text-lg ${
                        productivityRating === rating 
                          ? 'border-primary-500 shadow-lg transform scale-110' 
                          : 'border-2 hover:bg-primary-50 hover:shadow-md'
                      } transition-all duration-200`}
                    >
                      <Star className={`h-6 w-6 ${productivityRating === rating ? 'fill-current' : ''}`} />
                    </Button>
                  ))}
                </div>
                {productivityRating && (
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-primary-700">
                      {getProductivityLabel(productivityRating)}
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <Button 
                    onClick={() => setShowCompletionModal(true)} 
                    className="flex items-center gap-2 mx-auto px-6 py-3 text-lg bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    size="lg"
                    disabled={!productivityRating}
                  >
                    <TrendingUp className="h-5 w-5" />
                    Complete Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Work Sessions</h3>
                    <div className="text-3xl font-bold">{todayStats.workSessions}</div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Focus Time</h3>
                    <div className="text-3xl font-bold">
                      {Math.floor(todayStats.totalWorkTime / 60)}h {todayStats.totalWorkTime % 60}m
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Avg Rating</h3>
                    <div className="text-3xl font-bold">
                      {todayStats.productivity > 0 ? todayStats.productivity.toFixed(1) : '-'}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Tasks Worked</h3>
                    <div className="text-3xl font-bold">{todayStats.tasksWorked}</div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productivity Chart */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Productivity Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 pt-4">
                {/* Sample visualization - in a real app, this would be generated from data */}
                {[75, 85, 65, 90, 80, 70, 85, 95, 75, 80, 90, 85, 70, 95].map((height, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 group">
                    <div 
                      className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg hover:from-primary-600 hover:to-primary-500 transition-all duration-300 cursor-pointer shadow-sm group-hover:shadow-md"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-surface-600 mt-2 transform group-hover:scale-110 transition-transform">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index % 7]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-primary-500 rounded-sm"></div>
                    <span>Productivity Score</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Focus Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Zap className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-cyan-800">Peak Focus</h3>
                </div>
                <div className="text-2xl font-bold text-cyan-900 mb-1">10:00 AM - 12:00 PM</div>
                <div className="text-sm text-cyan-700">Your most productive hours</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Award className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-violet-800">Best Streak</h3>
                </div>
                <div className="text-2xl font-bold text-violet-900 mb-1">7 sessions</div>
                <div className="text-sm text-violet-700">Consecutive work sessions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-rose-800">Avg Session</h3>
                </div>
                <div className="text-2xl font-bold text-rose-900 mb-1">22 minutes</div>
                <div className="text-sm text-rose-700">Average work session length</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Recent Sessions */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-surface-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          session.type === 'work' ? 'bg-primary-100 text-primary-600' : 
                          session.type === 'shortBreak' ? 'bg-accent-100 text-accent-600' : 
                          'bg-info-100 text-info-600'
                        }`}>
                          {session.type === 'work' ? <Target className="h-5 w-5" /> : <Coffee className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-medium text-surface-900">
                            {session.type === 'work' ? 'Work Session' : 
                             session.type === 'shortBreak' ? 'Short Break' : 'Long Break'}
                          </div>
                          <div className="text-sm text-surface-500">
                            {session.taskName || 'No task'} • {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {session.productivity && (
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < session.productivity ? 'text-yellow-400 fill-current' : 'text-surface-300'}`} 
                              />
                            ))}
                          </div>
                        )}
                        <Badge variant="secondary" className="text-sm">
                          {session.duration} min
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-surface-900 mb-1">No Sessions Yet</h3>
                    <p className="text-surface-600">Complete your first Pomodoro session to see history</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Distribution */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Session Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 text-center">
                  <div className="text-3xl font-bold text-primary-700 mb-1">12</div>
                  <div className="text-sm text-primary-600">Work Sessions</div>
                </div>
                <div className="bg-accent-50 p-4 rounded-xl border border-accent-100 text-center">
                  <div className="text-3xl font-bold text-accent-700 mb-1">8</div>
                  <div className="text-sm text-accent-600">Short Breaks</div>
                </div>
                <div className="bg-info-50 p-4 rounded-xl border border-info-100 text-center">
                  <div className="text-3xl font-bold text-info-700 mb-1">3</div>
                  <div className="text-sm text-info-600">Long Breaks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-surface-900 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Timer Settings
                </h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-surface-500 hover:text-surface-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-surface-600 text-sm mt-1">
                Customize your Pomodoro experience
              </p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localSettings.workDuration}
                  onChange={(e) => setLocalSettings({...localSettings, workDuration: parseInt(e.target.value) || 25})}
                  className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  Short Break Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) => setLocalSettings({...localSettings, shortBreakDuration: parseInt(e.target.value) || 5})}
                  className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                  <Coffee className="h-4 w-4" />
                  Long Break Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) => setLocalSettings({...localSettings, longBreakDuration: parseInt(e.target.value) || 15})}
                  className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Long Break Interval (sessions)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localSettings.longBreakInterval}
                  onChange={(e) => setLocalSettings({...localSettings, longBreakInterval: parseInt(e.target.value) || 4})}
                  className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-surface-600" />
                  <div>
                    <span className="text-sm font-medium text-surface-700">Auto-start Breaks</span>
                    <p className="text-xs text-surface-500">Automatically start break sessions</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.autoStartBreaks}
                    onChange={(e) => setLocalSettings({...localSettings, autoStartBreaks: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-surface-600" />
                  <div>
                    <span className="text-sm font-medium text-surface-700">Enable Notifications</span>
                    <p className="text-xs text-surface-500">Get alerts when sessions end</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.notificationEnabled}
                    onChange={(e) => setLocalSettings({...localSettings, notificationEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-surface-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="px-5 py-2.5 hover:shadow-md transition-shadow"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Session Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-surface-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Session Completed
                </h3>
                <button 
                  onClick={() => setShowCompletionModal(false)}
                  className="text-surface-500 hover:text-surface-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-surface-600 text-sm mt-1">
                Great job! How would you rate this session?
              </p>
            </div>
            <div className="p-6">
              <div className="flex gap-3 justify-center mb-6">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    onClick={() => setProductivityRating(rating)}
                    variant={productivityRating === rating ? 'primary' : 'outline'}
                    size="lg"
                    className={`w-12 h-12 p-0 rounded-full ${
                      productivityRating === rating 
                        ? 'border-primary-500 shadow-lg transform scale-110' 
                        : 'border-2 hover:bg-primary-50'
                    }`}
                  >
                    <Star className={`h-5 w-5 ${productivityRating === rating ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
              {productivityRating && (
                <div className="text-center mb-6">
                  <div className="text-lg font-bold text-surface-900">
                    {getProductivityLabel(productivityRating)}
                  </div>
                  <div className="text-sm text-surface-600 mt-1">
                    You rated this session {productivityRating}/5
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCompletionModal(false)}
                  className="px-4 py-2 hover:shadow-md transition-shadow"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSessionComplete}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  disabled={!productivityRating}
                >
                  Confirm Rating
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;