import React, { useState, useEffect } from 'react';
import { useRoadmapStore } from '../../state/roadmapStore';
import { useAuthStore } from '../../state/authStore';
import { useTaskStore } from '../../state/taskStore';
import { Card, CardContent } from '../ui/Card';
import { 
  Lock, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  Users, 
  Flag, 
  Zap,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Plus,
  Edit,
  Eye,
  UserCheck,
  UserX,
  Star,
  Trophy,
  Medal,
  Crown,
  Target,
  X,
  ArrowRight,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const RoadmapBoardGame = ({ roadmapId }) => {
  const { getRoadmap, getRoadmapStages, updateStage } = useRoadmapStore();
  const { user: currentUser } = useAuthStore();
  const { getTasksByStage, autoAssignTask } = useTaskStore();
  const [selectedStage, setSelectedStage] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // board or list
  const [showConfetti, setShowConfetti] = useState(false);

  const roadmap = getRoadmap(roadmapId);
  const stages = getRoadmapStages(roadmapId);

  // Show confetti animation when a stage is completed
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Roadmap Not Found</h3>
          <p className="text-slate-600">The requested roadmap could not be found.</p>
        </div>
      </div>
    );
  }

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch (status) {
      case 'LOCKED':
        return { icon: Lock, color: 'text-gray-400', bg: 'bg-gray-100', ring: 'ring-gray-200' };
      case 'READY':
        return { icon: Play, color: 'text-blue-500', bg: 'bg-blue-50', ring: 'ring-blue-200' };
      case 'IN_PROGRESS':
        return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', ring: 'ring-amber-200' };
      case 'REVIEW':
        return { icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50', ring: 'ring-purple-200' };
      case 'DONE':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', ring: 'ring-green-200' };
      case 'BLOCKED':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', ring: 'ring-red-200' };
      default:
        return { icon: Lock, color: 'text-gray-400', bg: 'bg-gray-100', ring: 'ring-gray-200' };
    }
  };

  // Get responsibility name
  const getResponsibilityName = (responsibilityId) => {
    const responsibilities = [
      { id: 'project_management', name: 'Project Mgmt', icon: '📋' },
      { id: 'ui_ux_design', name: 'UI/UX Design', icon: '🎨' },
      { id: 'frontend_development', name: 'Frontend', icon: '💻' },
      { id: 'backend_development', name: 'Backend', icon: '⚙️' },
      { id: 'quality_assurance', name: 'QA', icon: '✅' },
      { id: 'devops', name: 'DevOps', icon: '🚀' }
    ];
    
    const responsibility = responsibilities.find(r => r.id === responsibilityId);
    return responsibility ? responsibility : { name: responsibilityId, icon: '📌' };
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const users = [
      { id: '1', name: 'Admin User', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '2', name: 'Manager User', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '3', name: 'Team Member', avatar: 'https://randomuser.me/api/portraits/men/51.jpg' }
    ];
    
    const user = users.find(u => u.id === userId);
    return user ? user : { name: 'Unassigned', avatar: null };
  };

  // Handle stage click with animation
  const handleStageClick = (stage) => {
    // Add a subtle animation when clicking a stage
    const element = document.getElementById(`stage-${stage.id}`);
    if (element) {
      element.classList.add('animate-pulse');
      setTimeout(() => {
        element.classList.remove('animate-pulse');
      }, 300);
    }
    setSelectedStage(stage);
  };

  // Handle assign user to stage with animation
  const handleAssignUser = (stageId, userId) => {
    // Add a success animation
    const element = document.getElementById(`stage-${stageId}`);
    if (element) {
      element.classList.add('animate-bounce');
      setTimeout(() => {
        element.classList.remove('animate-bounce');
      }, 500);
    }
    
    updateStage(roadmapId, stageId, { 
      assignedUserId: userId,
      status: 'IN_PROGRESS'
    });
    setSelectedStage(null);
  };

  // Handle stage status change with animation
  const handleStageStatusChange = (stageId, status) => {
    // Add animation based on status change
    const element = document.getElementById(`stage-${stageId}`);
    if (element) {
      if (status === 'DONE') {
        element.classList.add('animate-ping');
        setTimeout(() => {
          element.classList.remove('animate-ping');
        }, 500);
      } else if (status === 'IN_PROGRESS') {
        element.classList.add('animate-pulse');
        setTimeout(() => {
          element.classList.remove('animate-pulse');
        }, 300);
      }
    }
    
    updateStage(roadmapId, stageId, { status });
    
    // Show confetti when stage is completed
    if (status === 'DONE') {
      setShowConfetti(true);
    }
  };

  // Auto-assign stage based on responsibility
  const handleAutoAssign = (stageId) => {
    // In a real implementation, this would call the auto-assignment engine
    // For now, we'll simulate by assigning to a user with the matching responsibility
    const stage = stages.find(s => s.id === stageId);
    if (stage) {
      // Find a user with matching responsibility
      const users = [
        { id: '1', responsibilities: ['project_management', 'ui_ux_design', 'frontend_development', 'backend_development', 'quality_assurance', 'devops'] },
        { id: '2', responsibilities: ['project_management', 'ui_ux_design', 'frontend_development'] },
        { id: '3', responsibilities: ['frontend_development', 'backend_development'] }
      ];
      
      const eligibleUser = users.find(user => user.responsibilities.includes(stage.responsibilityId));
      if (eligibleUser) {
        handleStageStatusChange(stageId, 'IN_PROGRESS');
        updateStage(roadmapId, stageId, { 
          assignedUserId: eligibleUser.id
        });
      }
    }
  };

  // Check if current user can interact with stage
  const canInteractWithStage = (stage) => {
    // Admins can interact with all stages
    if (currentUser.role === 'ADMIN') return true;
    
    // Managers can interact with all stages
    if (currentUser.role === 'MANAGER') return true;
    
    // Team members can only interact with stages assigned to them
    return stage.assignedUserId === currentUser.id;
  };

  // Get available actions for a stage
  const getStageActions = (stage) => {
    const actions = [];
    
    if (currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER') {
      if (stage.status === 'LOCKED') {
        actions.push({ label: 'Unlock', action: () => handleStageStatusChange(stage.id, 'READY') });
      }
      
      if (stage.status === 'READY') {
        actions.push({ label: 'Start', action: () => handleStageStatusChange(stage.id, 'IN_PROGRESS') });
        actions.push({ label: 'Auto Assign', action: () => handleAutoAssign(stage.id) });
      }
      
      if (stage.status === 'IN_PROGRESS') {
        actions.push({ label: 'Mark for Review', action: () => handleStageStatusChange(stage.id, 'REVIEW') });
      }
      
      if (stage.status === 'REVIEW') {
        actions.push({ label: 'Approve', action: () => handleStageStatusChange(stage.id, 'DONE') });
        actions.push({ label: 'Request Changes', action: () => handleStageStatusChange(stage.id, 'IN_PROGRESS') });
      }
      
      if (stage.status === 'BLOCKED') {
        actions.push({ label: 'Unblock', action: () => handleStageStatusChange(stage.id, 'READY') });
      }
    } else if (currentUser.role === 'TEAM_MEMBER' && stage.assignedUserId === currentUser.id) {
      if (stage.status === 'READY') {
        actions.push({ label: 'Start', action: () => handleStageStatusChange(stage.id, 'IN_PROGRESS') });
      }
      
      if (stage.status === 'IN_PROGRESS') {
        actions.push({ label: 'Mark for Review', action: () => handleStageStatusChange(stage.id, 'REVIEW') });
      }
    }
    
    return actions;
  };

  // Get game level for stage
  const getStageLevel = (index) => {
    const levels = [
      { name: 'Starter', icon: Star, color: 'text-blue-500' },
      { name: 'Bronze', icon: Medal, color: 'text-amber-600' },
      { name: 'Silver', icon: Medal, color: 'text-gray-400' },
      { name: 'Gold', icon: Medal, color: 'text-yellow-500' },
      { name: 'Platinum', icon: Trophy, color: 'text-blue-400' },
      { name: 'Diamond', icon: Crown, color: 'text-purple-500' },
      { name: 'Master', icon: Target, color: 'text-green-500' }
    ];
    
    return levels[index % levels.length] || levels[0];
  };

  // Get priority badge for stage
  const getPriorityBadge = (index) => {
    const priorities = [
      { label: 'Critical', color: 'bg-red-100 text-red-800' },
      { label: 'High', color: 'bg-amber-100 text-amber-800' },
      { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
      { label: 'Low', color: 'bg-gray-100 text-gray-800' }
    ];
    
    return priorities[index % priorities.length] || priorities[3];
  };

  // Get progress percentage for a stage
  const getStageProgress = (stage) => {
    const tasks = getTasksByStage(stage.id);
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(t => t.status === 'DONE').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  return (
    <div className="space-y-6">
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
            <span>Stage Completed!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{roadmap.name}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">{roadmap.description}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'board' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('board')}
          >
            Board View
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
        </div>
      </div>
      
      {/* Progress Bar with Game Elements */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-slate-900 dark:text-white">Project Progress</h3>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {stages.filter(s => s.status === 'DONE').length}/{stages.length} stages completed
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 h-2.5 rounded-full" 
            style={{ width: `${(stages.filter(s => s.status === 'DONE').length / stages.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Game Progress Indicators */}
        <div className="flex justify-between mt-4">
          {stages.map((stage, index) => {
            const LevelIcon = getStageLevel(index).icon;
            const isCompleted = stage.status === 'DONE';
            return (
              <div key={stage.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
                }`}>
                  <LevelIcon className="w-4 h-4" />
                </div>
                <span className="text-xs mt-1 text-slate-500 dark:text-slate-400">{index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Total Stages</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stages.length}</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-800/50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Completed</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stages.filter(s => s.status === 'DONE').length}</p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">In Progress</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stages.filter(s => s.status === 'IN_PROGRESS').length}</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-medium text-slate-700 dark:text-slate-300">Avg SLA</h4>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {Math.round(stages.reduce((sum, stage) => sum + (stage.sla || 0), 0) / stages.length || 0)}d
          </p>
        </div>
      </div>
      
      {/* Board View - Candy Crush Style */}
      {viewMode === 'board' && (
        <div className="relative">
          {/* Path Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 rounded-full z-0"></div>
          
          {/* Stages */}
          <div className="relative z-10 flex flex-wrap justify-between">
            {stages.map((stage, index) => {
              const StatusIcon = getStatusConfig(stage.status).icon;
              const statusColor = getStatusConfig(stage.status).color;
              const statusBg = getStatusConfig(stage.status).bg;
              const statusRing = getStatusConfig(stage.status).ring;
              const canInteract = canInteractWithStage(stage);
              const actions = getStageActions(stage);
              const responsibility = getResponsibilityName(stage.responsibilityId);
              const assignedUser = getUserName(stage.assignedUserId);
              const level = getStageLevel(index);
              const LevelIcon = level.icon;
              const priority = getPriorityBadge(index);
              const progress = getStageProgress(stage);
              
              return (
                <div 
                  key={stage.id}
                  className="flex flex-col items-center mb-8 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-2"
                >
                  {/* Stage Node - Candy Crush Style */}
                  <motion.div 
                    id={`stage-${stage.id}`}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      statusBg
                    } ${canInteract ? 'hover:scale-110 hover:shadow-lg' : ''} ${
                      selectedStage?.id === stage.id ? `ring-4 ${statusRing}` : ''
                    } border-2 border-white dark:border-gray-800 shadow-lg`}
                    onClick={() => canInteract && handleStageClick(stage)}
                    whileHover={{ scale: canInteract ? 1.1 : 1 }}
                    whileTap={{ scale: canInteract ? 0.95 : 1 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Level Badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow">
                      <LevelIcon className={`w-3 h-3 ${level.color}`} />
                    </div>
                    
                    {/* Status Icon */}
                    <StatusIcon className={`w-8 h-8 ${statusColor}`} />
                    
                    {/* Assigned User Avatar */}
                    {stage.assignedUserId && (
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-green-500 flex items-center justify-center">
                        <UserCheck className="w-3 h-3 text-green-500" />
                      </div>
                    )}
                    
                    {/* Blocked Indicator */}
                    {stage.status === 'BLOCKED' && (
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                        <AlertCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {/* Priority Badge */}
                    <div className={`absolute -bottom-2 -left-2 text-[8px] px-1 py-0.5 rounded-full font-bold ${priority.color}`}>
                      {priority.label.substring(0, 1)}
                    </div>
                  </motion.div>
                  
                  {/* Stage Info */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm truncate" title={stage.title}>
                      {stage.title}
                    </h4>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColor} bg-opacity-20`}>
                        {stage.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-xs dark:text-slate-300" title={responsibility.name}>
                        {responsibility.icon} {responsibility.name}
                      </span>
                    </div>
                    {stage.assignedUserId && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <img 
                          src={assignedUser.avatar} 
                          alt={assignedUser.name} 
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {assignedUser.name.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Gameful Progress Ring */}
                  <div className="relative w-16 h-16 mt-2">
                    <svg className="w-16 h-16" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={stage.status === 'DONE' ? '#10B981' : stage.status === 'BLOCKED' ? '#EF4444' : '#3B82F6'}
                        strokeWidth="2"
                        strokeDasharray={`${Math.min(progress, 100)}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {canInteract && actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {actions.slice(0, 2).map((action, idx) => (
                        <button
                          key={idx}
                          className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.action();
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                      {actions.length > 2 && (
                        <button className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm">
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Stage</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Responsibility</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Assignee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Tasks</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">SLA</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.map((stage, index) => {
                    const StatusIcon = getStatusConfig(stage.status).icon;
                    const statusColor = getStatusConfig(stage.status).color;
                    const canInteract = canInteractWithStage(stage);
                    const actions = getStageActions(stage);
                    const tasks = getTasksByStage(stage.id);
                    const completedTasks = tasks.filter(t => t.status === 'DONE').length;
                    const responsibility = getResponsibilityName(stage.responsibilityId);
                    const assignedUser = getUserName(stage.assignedUserId);
                    const level = getStageLevel(index);
                    const LevelIcon = level.icon;
                    const priority = getPriorityBadge(index);
                    const progress = getStageProgress(stage);
                    
                    return (
                      <tr 
                        key={stage.id} 
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                        onClick={() => canInteract && handleStageClick(stage)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                              <LevelIcon className={`w-4 h-4 ${level.color}`} />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{stage.title}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{stage.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                            <span className="text-sm">{stage.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm dark:text-slate-300">{responsibility.icon} {responsibility.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          {stage.assignedUserId ? (
                            <div className="flex items-center gap-2">
                              <img 
                                src={assignedUser.avatar} 
                                alt={assignedUser.name} 
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-sm dark:text-slate-300">{assignedUser.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500 dark:text-slate-400">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-green-500" 
                                style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {completedTasks}/{tasks.length}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm dark:text-slate-300">{stage.sla || 0}d</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${priority.color}`}>
                              {priority.label}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {canInteract && actions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {actions.slice(0, 2).map((action, idx) => (
                                <button
                                  key={idx}
                                  className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                >
                                  {action.label}
                                </button>
                              ))}
                              {actions.length > 2 && (
                                <button className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600">
                                  <MoreHorizontal className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Stage Detail Modal */}
      {selectedStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedStage.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedStage.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedStage(null)}
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Stage Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-300">Status</span>
                      <div className="flex items-center gap-2">
                        {React.createElement(getStatusConfig(selectedStage.status).icon, { className: `w-4 h-4 ${getStatusConfig(selectedStage.status).color}` })}
                        <span className="font-medium dark:text-white">{selectedStage.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-300">Responsibility</span>
                      <span className="font-medium dark:text-white">{getResponsibilityName(selectedStage.responsibilityId).name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-300">SLA</span>
                      <span className="font-medium dark:text-white">{selectedStage.sla} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-slate-600 dark:text-slate-300">Level</span>
                      <div className="flex items-center gap-1">
                        {React.createElement(getStageLevel(stages.findIndex(s => s.id === selectedStage.id)).icon, { 
                          className: `w-4 h-4 ${getStageLevel(stages.findIndex(s => s.id === selectedStage.id)).color}` 
                        })}
                        <span className="font-medium dark:text-white">{getStageLevel(stages.findIndex(s => s.id === selectedStage.id)).name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Assignee</h4>
                  {selectedStage.assignedUserId ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <img 
                        src={getUserName(selectedStage.assignedUserId).avatar} 
                        alt={getUserName(selectedStage.assignedUserId).name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium dark:text-white">{getUserName(selectedStage.assignedUserId).name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Assigned</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Not Assigned</span>
                      </div>
                      <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">This stage needs an assignee</p>
                    </div>
                  )}
                  
                  {/* Node-level Assignment Controls */}
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Node Assignment</h5>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                        onClick={() => handleStageStatusChange(selectedStage.id, 'READY')}
                      >
                        Mark Ready
                      </button>
                      <button 
                        className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
                        onClick={() => handleStageStatusChange(selectedStage.id, 'IN_PROGRESS')}
                      >
                        Start Work
                      </button>
                      <button 
                        className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"
                        onClick={() => handleStageStatusChange(selectedStage.id, 'REVIEW')}
                      >
                        Request Review
                      </button>
                      <button 
                        className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800"
                        onClick={() => handleStageStatusChange(selectedStage.id, 'BLOCKED')}
                      >
                        Block Stage
                      </button>
                      <button 
                        className="text-xs bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 px-2 py-1 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-800"
                        onClick={() => handleAutoAssign(selectedStage.id)}
                      >
                        Auto Assign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Criteria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Entry Criteria</h5>
                    <ul className="space-y-2">
                      {selectedStage.entryCriteria?.map((criteria, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{criteria}</span>
                        </li>
                      )) || <li className="text-sm text-slate-500 dark:text-slate-400">No entry criteria defined</li>}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Exit Criteria</h5>
                    <ul className="space-y-2">
                      {selectedStage.exitCriteria?.map((criteria, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Flag className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{criteria}</span>
                        </li>
                      )) || <li className="text-sm text-slate-500 dark:text-slate-400">No exit criteria defined</li>}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">KPIs</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStage.kpis?.map((kpi, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                      {kpi}
                    </span>
                  )) || <span className="text-sm text-slate-500 dark:text-slate-400">No KPIs defined</span>}
                </div>
              </div>
              
              {(currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER') && !selectedStage.assignedUserId && (
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Assign to User</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: '1', name: 'Admin User', role: 'ADMIN', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                      { id: '2', name: 'Manager User', role: 'MANAGER', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                      { id: '3', name: 'Team Member', role: 'TEAM_MEMBER', avatar: 'https://randomuser.me/api/portraits/men/51.jpg' }
                    ].map((user) => (
                      <button
                        key={user.id}
                        className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => handleAssignUser(selectedStage.id, user.id)}
                      >
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <div className="font-medium text-sm dark:text-white">{user.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{user.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedStage(null)}>
                  Close
                </Button>
                {(currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER') && (
                  <Button>
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapBoardGame;