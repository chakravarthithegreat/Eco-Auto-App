import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../state/taskStore';
import { useAuthStore } from '../../state/authStore';
import { useRewardsStore } from '../../state/rewardsStore';
import StatsCard from '../ui/StatsCard';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  User,
  Calendar,
  MoreVertical,
  Play,
  CheckCircle,
  Pause,
  Edit,
  Trash2,
  Tag,
  FolderOpen,
  TrendingUp,
  Target,
  BarChart3,
  List,
  Grid,
  ChevronDown,
  X,
  Eye,
  Share2,
  Printer,
  Download,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import WorkHoursMatrix from './WorkHoursMatrix';

const TaskDashboard = () => {
  const { 
    tasks, 
    myTasks, 
    teamTasks, 
    getTaskStatistics, 
    getOverdueTasks, 
    getUpcomingTasks,
    getCompletionRate,
    updateFilters,
    filters,
    createTask,
    updateTask,
    deleteTask,
    initializeMockTasks,
    fetchTasks
  } = useTaskStore();
  
  const { isAdmin, isManager, isTeamMember, user } = useAuthStore();
  const { addReward } = useRewardsStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // list or grid
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [taskStats, setTaskStats] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskActivityData, setTaskActivityData] = useState({
    hours: 0,
    trend: "+0%",
    dots: Array(30).fill(false)
  });

  // Form state for new task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    assigneeId: user?.id || 1,
    projectId: null,
    category: 'General'
  });

  useEffect(() => {
    console.log('TaskDashboard: Initializing task data');
    
    // Fetch real tasks from API
    fetchTasks();
    
    // Load data
    const stats = getTaskStatistics();
    setTaskStats(stats);
    setOverdueTasks(getOverdueTasks());
    setUpcomingTasks(getUpcomingTasks());
    setCompletionRate(getCompletionRate());
    
    // Generate task activity data
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
      const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
      
      // Generate activity dots based on task progress
      const dots = Array(30).fill(false).map((_, i) => {
        // Simulate activity based on task progress
        return Math.random() > 0.4;
      });
      
      setTaskActivityData({
        hours: completedTasks,
        trend: `${completionRate >= 50 ? '+' : ''}${Math.round((completionRate - 50) / 10)}%`,
        dots: dots
      });
    }
    
    // Log for debugging
    console.log('TaskDashboard: Loaded task statistics', stats);
  }, [tasks, getTaskStatistics, getOverdueTasks, getUpcomingTasks, getCompletionRate, initializeMockTasks]);

  // Get task statistics for display
  const taskStatsData = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t.status === 'Completed').length || 0,
    inProgress: tasks?.filter(t => t.status === 'In Progress').length || 0,
    pending: tasks?.filter(t => t.status === 'Pending').length || 0,
    overdue: overdueTasks?.length || 0
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Helper function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Assigned': return 'bg-purple-100 text-purple-800';
      case 'Accepted': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle adding a new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    createTask(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assigneeId: user?.id || 1,
      projectId: null,
      category: 'General'
    });
    setShowAddModal(false);
  };

  // Handle updating task status
  const handleUpdateTaskStatus = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    
    // Add reward for completing tasks
    if (newStatus === 'Completed') {
      addReward(10, 'Task completed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your tasks and track progress</p>
      </div>
      
      {/* Controls and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          
          <Button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          title="Total Tasks" 
          value={taskStatsData.total} 
          icon={<CheckSquare />} 
          iconBgColor="bg-blue-100" 
          iconColor="text-blue-600"
        />
        
        <StatsCard 
          title="Completed" 
          value={taskStatsData.completed} 
          icon={<CheckCircle />} 
          iconBgColor="bg-green-100" 
          iconColor="text-green-600"
        />
        
        <StatsCard 
          title="In Progress" 
          value={taskStatsData.inProgress} 
          icon={<Play />} 
          iconBgColor="bg-amber-100" 
          iconColor="text-amber-600"
        />
        
        <StatsCard 
          title="Pending" 
          value={taskStatsData.pending} 
          icon={<Clock />} 
          iconBgColor="bg-yellow-100" 
          iconColor="text-yellow-600"
        />
        
        <StatsCard 
          title="Overdue" 
          value={taskStatsData.overdue} 
          icon={<AlertTriangle />} 
          iconBgColor="bg-red-100" 
          iconColor="text-red-600"
        />
      </div>
      
      {/* Activity and Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-1">
          <WorkHoursMatrix data={taskActivityData} />
        </div>
        
        {/* Tab Navigation */}
        <div className="lg:col-span-3">
          <div className="border-b border-gray-200 mb-4">
            <div className="flex">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'my'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Tasks
              </button>
              {(isManager || isAdmin) && (
                <button
                  onClick={() => setActiveTab('team')}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'team'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Team Tasks
                </button>
              )}
            </div>
          </div>
          
          {/* Task List/Grid View */}
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`rounded-xl overflow-hidden transition-all hover:shadow-md ${
                    viewMode === 'grid' ? '' : 'flex'
                  }`}
                >
                  <div className={`p-4 ${viewMode === 'grid' ? '' : 'flex-shrink-0 w-64'}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {task.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(task.dueDate)}
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            task.progress < 30 ? 'bg-red-500' : 
                            task.progress < 70 ? 'bg-amber-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {task.status !== 'Completed' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                          className="bg-green-500 hover:bg-green-600 text-white hover:shadow-md transition-all"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedTask(task)}
                        className="hover:shadow-md transition-all"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Edit task functionality would go here
                        }}
                        className="hover:shadow-md transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New Task</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="General">General</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddTask}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                >
                  Add Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;