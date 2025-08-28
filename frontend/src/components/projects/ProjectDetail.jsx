import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRoadmapStore } from '../../state/roadmapStore';
import { useTaskStore } from '../../state/taskStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  Target, 
  Calendar, 
  Users, 
  Flag, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Eye, 
  Lock,
  User,
  BarChart3,
  TrendingUp,
  Award,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/Button';
import RoadmapBoardGame from '../roadmaps/RoadmapBoardGame';

const ProjectDetail = () => {
  const { id } = useParams();
  const { getRoadmap, getRoadmapStages } = useRoadmapStore();
  const { getTasksByProject } = useTaskStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const roadmap = getRoadmap(id);
  const stages = getRoadmapStages(id);
  const tasks = getTasksByProject(id);
  
  // Calculate project metrics
  const completedStages = stages.filter(stage => stage.status === 'DONE').length;
  const totalStages = stages.length;
  const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
  
  const completedTasks = tasks.filter(task => task.status === 'DONE').length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  if (!roadmap) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Project Not Found</h3>
          <p className="text-slate-600">The requested project could not be found.</p>
        </div>
      </div>
    );
  }
  
  // Get status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      'PLANNING': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'IN_PROGRESS': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'BLOCKED': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'DONE': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };
  
  // Get stage status config
  const getStageStatusConfig = (status) => {
    switch (status) {
      case 'LOCKED':
        return { icon: Lock, color: 'text-gray-400', bg: 'bg-gray-100' };
      case 'READY':
        return { icon: Play, color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'IN_PROGRESS':
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' };
      case 'REVIEW':
        return { icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' };
      case 'DONE':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' };
      case 'BLOCKED':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' };
      default:
        return { icon: Lock, color: 'text-gray-400', bg: 'bg-gray-100' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{roadmap.name}</h1>
            {getStatusBadge(roadmap.status)}
          </div>
          <p className="text-slate-600 dark:text-slate-400">{roadmap.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Client: {roadmap.client}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created: {new Date(roadmap.createdDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Project Progress</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{progress}%</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-800/50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Tasks Completed</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{taskProgress}%</p>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-1">
            <span>{completedTasks}/{totalTasks} tasks</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Stages</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{completedStages}/{totalStages}</p>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-1">
            <span>{totalStages - completedStages} remaining</span>
          </div>
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
          Roadmap
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Description</h4>
                    <p className="text-slate-600 dark:text-slate-400">{roadmap.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Client</h4>
                    <p className="text-slate-600 dark:text-slate-400">{roadmap.client}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Created Date</h4>
                    <p className="text-slate-600 dark:text-slate-400">{new Date(roadmap.createdDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Status</h4>
                    <p className="text-slate-600 dark:text-slate-400">{roadmap.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stages Overview */}
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Stages Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stages.map((stage) => {
                    const StatusIcon = getStageStatusConfig(stage.status).icon;
                    const statusColor = getStageStatusConfig(stage.status).color;
                    const statusBg = getStageStatusConfig(stage.status).bg;
                    
                    return (
                      <div key={stage.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusBg}`}>
                            <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{stage.title}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{stage.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor.replace('text', 'bg').replace('-500', '-100')} ${statusColor}`}>
                            {stage.status}
                          </span>
                          {stage.assignedUserId && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <User className="w-3 h-3" />
                              <span>Assigned</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Team Members */}
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: '1', name: 'Admin User', role: 'Project Manager', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                    { id: '2', name: 'Manager User', role: 'UI/UX Designer', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                    { id: '3', name: 'Team Member', role: 'Developer', avatar: 'https://randomuser.me/api/portraits/men/51.jpg' }
                  ].map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white text-sm">{member.name}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Project Timeline */}
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Start Date</span>
                      <span className="font-medium text-slate-900 dark:text-white">Jan 15, 2025</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Estimated completion: Mar 30, 2025
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {activeTab === 'roadmap' && (
        <RoadmapBoardGame roadmapId={id} />
      )}
      
      {activeTab === 'tasks' && (
        <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Project Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Task</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Assignee</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Due Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{task.title}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">{task.desc}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-green to-accent-blue flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {task.assigneeId ? 'T' : 'U'}
                              </span>
                            </div>
                            <span className="text-sm text-slate-900 dark:text-white">
                              {task.assigneeId ? 'Team Member' : 'Unassigned'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-slate-900 dark:text-white">
                            {new Date(task.dueAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            {task.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  No tasks found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  This project doesn't have any tasks yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 gap-6">
          {/* Performance Metrics */}
          <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-slate-900 dark:text-white">Completion Rate</h4>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">87%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">On track</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-medium text-slate-900 dark:text-white">Avg. Task Time</h4>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">4.2 days</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Per task</div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-medium text-slate-900 dark:text-white">Quality Score</h4>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">92%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">High quality</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Stage Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2 pt-4">
                  {stages.map((stage, index) => {
                    const height = stage.status === 'DONE' ? 100 : stage.status === 'IN_PROGRESS' ? 70 : stage.status === 'READY' ? 40 : 20;
                    return (
                      <div key={stage.id} className="flex flex-col items-center flex-1 group">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer shadow-sm group-hover:shadow-md"
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs text-slate-600 mt-2 transform group-hover:scale-110 transition-transform">
                          {stage.title.substring(0, 3)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Admin User', completed: 12, pending: 3, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                    { name: 'Manager User', completed: 8, pending: 5, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                    { name: 'Team Member', completed: 15, pending: 2, avatar: 'https://randomuser.me/api/portraits/men/51.jpg' }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{member.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {member.completed} completed, {member.pending} pending
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {Math.round((member.completed / (member.completed + member.pending)) * 100)}%
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Completion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;