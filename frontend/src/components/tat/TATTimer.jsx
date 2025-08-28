import React, { useState, useEffect } from 'react';
import { useTATStore } from '../../state/tatStore';
import { useTaskStore } from '../../state/taskStore';
import { useAuthStore } from '../../state/authStore';
import { useNotificationStore } from '../../state/notificationStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Target, 
  User, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Award,
  Calendar,
  Timer,
  BarChart2,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const TATTimer = () => {
  const { user } = useAuthStore();
  const { 
    tatRecords, 
    startTaskTracking, 
    updateTaskTracking, 
    completeTaskTracking 
  } = useTATStore();
  const { tasks, updateTask } = useTaskStore();
  const { addNotification } = useNotificationStore();

  const [activeTimer, setActiveTimer] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [qualityRating, setQualityRating] = useState(3);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('timer');
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    avgTimePerTask: 0,
    efficiencyRate: 0
  });

  // Get assigned tasks for current user
  const assignedTasks = tasks.filter(task => 
    task.assigneeId === user?.id && 
    (task.status === 'accepted' || task.status === 'in_progress')
  );

  // Find active TAT record for current user
  useEffect(() => {
    const activeRecord = tatRecords.find(record => 
      record.assigneeId === user?.id && 
      record.status === 'in_progress'
    );
    
    if (activeRecord) {
      setActiveTimer(activeRecord);
      setSelectedTask(tasks.find(t => t.id === activeRecord.taskId) || null);
      
      // Calculate elapsed time
      const startTime = new Date(activeRecord.actualStartDate).getTime();
      const currentTime = new Date().getTime();
      setTimeElapsed(Math.floor((currentTime - startTime) / 1000));
      setIsRunning(true);
    }
  }, [tatRecords, user, tasks]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isRunning && activeTimer) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, activeTimer]);

  // Calculate task statistics
  useEffect(() => {
    if (tatRecords && tatRecords.length > 0) {
      const userRecords = tatRecords.filter(record => record.assigneeId === user?.id);
      const completedRecords = userRecords.filter(record => record.status === 'completed');
      
      const totalTasks = userRecords.length;
      const completedTasks = completedRecords.length;
      const totalTime = completedRecords.reduce((sum, record) => sum + (record.actualHours || 0), 0);
      const avgTimePerTask = totalTasks > 0 ? totalTime / totalTasks : 0;
      const efficiencyRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      setTaskStats({
        totalTasks,
        completedTasks,
        avgTimePerTask,
        efficiencyRate
      });
    }
  }, [tatRecords, user]);

  // Format time for display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer for a task
  const handleStartTimer = (task) => {
    if (!task) return;
    
    // Check if there's already an active timer
    if (activeTimer) {
      toast.error('You already have an active timer. Please stop it first.');
      return;
    }
    
    // Start TAT tracking
    const tatRecord = startTaskTracking(task);
    setActiveTimer(tatRecord);
    setSelectedTask(task);
    setTimeElapsed(0);
    setIsRunning(true);
    
    // Update task status
    updateTask(task.id, { status: 'in_progress' });
    
    toast.success(`Timer started for task: ${task.title}`);
  };

  // Pause timer
  const handlePauseTimer = () => {
    if (!activeTimer) return;
    
    setIsRunning(false);
    
    // Update TAT record with current time
    const hours = timeElapsed / 3600;
    updateTaskTracking(activeTimer.taskId, { actualHours: hours });
    
    toast.success('Timer paused');
  };

  // Stop timer
  const handleStopTimer = () => {
    if (!activeTimer) return;
    
    setIsRunning(false);
    
    // Update TAT record with final time
    const hours = timeElapsed / 3600;
    updateTaskTracking(activeTimer.taskId, { actualHours: hours });
    
    toast.success('Timer stopped');
  };

  // Complete work and request approval
  const handleCompleteWork = () => {
    if (!activeTimer || !selectedTask) return;
    
    // Stop timer
    setIsRunning(false);
    
    // Complete TAT tracking
    const hours = timeElapsed / 3600;
    completeTaskTracking(activeTimer.taskId, hours, qualityRating, notes);
    
    // Update task status to completed
    updateTask(selectedTask.id, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
    
    // Create notification for managers/admins
    const notification = {
      id: Date.now(),
      title: 'Work Completion Request',
      message: `${user?.name} has completed task "${selectedTask.title}" and requests approval`,
      type: 'approval',
      taskId: selectedTask.id,
      userId: user?.id,
      userName: user?.name,
      taskName: selectedTask.title,
      timeSpent: hours,
      qualityRating,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    addNotification(notification);
    
    // Reset state
    setActiveTimer(null);
    setSelectedTask(null);
    setTimeElapsed(0);
    setQualityRating(3);
    setNotes('');
    
    toast.success('Work completed! Request sent to manager for approval.');
  };

  // Get quality rating label
  const getQualityLabel = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
              TAT Timer
            </h1>
            <p className="text-surface-600 mt-1">
              Track your work time and request approval when complete
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
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'tasks'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          My Tasks
        </button>
      </div>

      {activeTab === 'timer' && (
        <div className="space-y-6">
          {/* Active Timer */}
          {activeTimer && (
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary-500" />
                    Active Timer
                  </div>
                  <Badge variant="primary" className="px-3 py-1">
                    {isRunning ? 'Running' : 'Paused'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-5 border border-primary-100">
                    <h3 className="font-bold text-lg text-surface-900 mb-2">{selectedTask?.title}</h3>
                    <p className="text-sm text-surface-600 mb-4">{selectedTask?.description}</p>
                    <div className="flex items-center gap-4 text-sm text-surface-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Project: {selectedTask?.projectName || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        <span>Est. {selectedTask?.estimatedHours || 0} hours</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timer Display */}
                  <div className="text-center py-6">
                    <div className="text-5xl font-mono font-bold text-primary-600 mb-2">
                      {formatTime(timeElapsed)}
                    </div>
                    <div className="text-sm text-surface-600">
                      Time Elapsed
                    </div>
                  </div>
                  
                  {/* Progress Visualization */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-600">Progress</span>
                      <span className="font-medium">
                        {Math.min(100, Math.round((timeElapsed / 3600 / (selectedTask?.estimatedHours || 1)) * 100))}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, (timeElapsed / 3600 / (selectedTask?.estimatedHours || 1)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-surface-500">
                      {Math.round(timeElapsed / 3600 * 100) / 100}h of {selectedTask?.estimatedHours || 0}h
                    </div>
                  </div>
                  
                  {/* Timer Controls */}
                  <div className="flex justify-center gap-4">
                    {!isRunning ? (
                      <Button 
                        onClick={() => setIsRunning(true)} 
                        className="flex items-center gap-2 px-6 py-3 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Play className="h-5 w-5" />
                        Resume
                      </Button>
                    ) : (
                      <Button 
                        onClick={handlePauseTimer} 
                        variant="secondary"
                        className="flex items-center gap-2 px-6 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Pause className="h-5 w-5" />
                        Pause
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleStopTimer} 
                      variant="outline"
                      className="flex items-center gap-2 px-6 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Square className="h-5 w-5" />
                      Stop
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task Selection */}
          {!activeTimer && (
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-500" />
                  Select Task to Track
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {assignedTasks.map(task => (
                      <div 
                        key={task.id} 
                        className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-surface-50 rounded-2xl border border-surface-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="mb-4 md:mb-0 md:mr-4">
                          <h3 className="font-bold text-surface-900 mb-1">{task.title}</h3>
                          <p className="text-sm text-surface-600 mb-3">{task.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{task.projectName || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Timer className="w-4 h-4" />
                              <span>Est. {task.estimatedHours} hours</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              <span className="capitalize">{task.priority || 'medium'}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleStartTimer(task)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <Play className="h-4 w-4" />
                          Start Timer
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-surface-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-surface-900 mb-2">No Assigned Tasks</h3>
                    <p className="text-surface-600 max-w-md mx-auto">
                      You don't have any tasks assigned to you right now. Contact your manager to assign tasks.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Complete Work Form */}
          {activeTimer && (
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success-500" />
                  Complete Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Quality Rating
                    </label>
                    <div className="flex justify-center gap-3 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setQualityRating(star)}
                          className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
                            star <= qualityRating 
                              ? 'text-amber-500 bg-amber-50 shadow-md' 
                              : 'text-surface-300 bg-surface-50 hover:bg-amber-50'
                          }`}
                        >
                          <Star className={`h-8 w-8 ${star <= qualityRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-surface-900">
                        {getQualityLabel(qualityRating)}
                      </div>
                      <div className="text-sm text-surface-600">
                        {qualityRating} star{qualityRating !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm hover:shadow-md transition-shadow"
                      placeholder="Add any notes about your work..."
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCompleteWork}
                    className="w-full flex items-center justify-center gap-2 py-3 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <CheckCircle className="h-5 w-5" />
                    Complete Work & Request Approval
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Total Tasks</h3>
                    <div className="text-3xl font-bold">{taskStats.totalTasks}</div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Completed</h3>
                    <div className="text-3xl font-bold">{taskStats.completedTasks}</div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Avg Time</h3>
                    <div className="text-3xl font-bold">
                      {taskStats.avgTimePerTask.toFixed(1)}h
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Efficiency</h3>
                    <div className="text-3xl font-bold">{taskStats.efficiencyRate.toFixed(0)}%</div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Task Completion Trend
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
                    <span>Completion Rate</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Zap className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-cyan-800">Peak Productivity</h3>
                </div>
                <div className="text-2xl font-bold text-cyan-900 mb-1">10:00 AM - 2:00 PM</div>
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
                <div className="text-2xl font-bold text-violet-900 mb-1">5 tasks</div>
                <div className="text-sm text-violet-700">Consecutive completions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <Timer className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-rose-800">Avg Duration</h3>
                </div>
                <div className="text-2xl font-bold text-rose-900 mb-1">2.3 hours</div>
                <div className="text-sm text-rose-700">Per task completion</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Task List */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                My Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedTasks.length > 0 ? (
                <div className="space-y-4">
                  {assignedTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="p-5 bg-surface-50 rounded-2xl border border-surface-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="mb-3 md:mb-0">
                          <h3 className="font-bold text-surface-900 mb-1">{task.title}</h3>
                          <p className="text-sm text-surface-600">{task.description}</p>
                        </div>
                        <Badge 
                          className={`px-3 py-1 ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority || 'medium'} priority
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-surface-200">
                          <div className="flex items-center text-sm text-surface-500 mb-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Project</span>
                          </div>
                          <p className="text-sm font-medium text-surface-900">
                            {task.projectName || 'N/A'}
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-surface-200">
                          <div className="flex items-center text-sm text-surface-500 mb-1">
                            <Timer className="w-4 h-4 mr-1" />
                            <span>Estimated Time</span>
                          </div>
                          <p className="text-sm font-medium text-surface-900">
                            {task.estimatedHours} hours
                          </p>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-surface-200">
                          <div className="flex items-center text-sm text-surface-500 mb-1">
                            <Target className="w-4 h-4 mr-1" />
                            <span>Status</span>
                          </div>
                          <p className="text-sm font-medium text-surface-900 capitalize">
                            {task.status || 'assigned'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        {task.status !== 'in_progress' && (
                          <Button 
                            onClick={() => handleStartTimer(task)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <Play className="h-4 w-4" />
                            Start Tracking
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-surface-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-surface-900 mb-2">No Assigned Tasks</h3>
                  <p className="text-surface-600 max-w-md mx-auto">
                    You don't have any tasks assigned to you right now. Contact your manager to assign tasks.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TATTimer;