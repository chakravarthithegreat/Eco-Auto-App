import React, { useState } from 'react';
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
  UserX
} from 'lucide-react';
import { Button } from '../ui/Button';

const RoadmapBoard = ({ roadmapId }) => {
  const { getRoadmap, getRoadmapStages, updateStage } = useRoadmapStore();
  const { user: currentUser } = useAuthStore();
  const { getTasksByStage } = useTaskStore();
  const [selectedStage, setSelectedStage] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // board or list

  const roadmap = getRoadmap(roadmapId);
  const stages = getRoadmapStages(roadmapId);

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

  // Get responsibility name
  const getResponsibilityName = (responsibilityId) => {
    const responsibilities = [
      { id: 'project_management', name: 'Project Mgmt' },
      { id: 'ui_ux_design', name: 'UI/UX Design' },
      { id: 'frontend_development', name: 'Frontend' },
      { id: 'backend_development', name: 'Backend' },
      { id: 'quality_assurance', name: 'QA' },
      { id: 'devops', name: 'DevOps' }
    ];
    
    const responsibility = responsibilities.find(r => r.id === responsibilityId);
    return responsibility ? responsibility.name : responsibilityId;
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const users = [
      { id: 1, name: 'Admin User' },
      { id: 2, name: 'Manager User' },
      { id: 3, name: 'Team Member' }
    ];
    
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unassigned';
  };

  // Handle stage click
  const handleStageClick = (stage) => {
    setSelectedStage(stage);
  };

  // Handle assign user to stage
  const handleAssignUser = (stageId, userId) => {
    updateStage(roadmapId, stageId, { 
      assignedUserId: userId,
      status: 'IN_PROGRESS'
    });
    setSelectedStage(null);
  };

  // Handle stage status change
  const handleStageStatusChange = (stageId, status) => {
    updateStage(roadmapId, stageId, { status });
  };

  // Check if current user can interact with stage
  const canInteractWithStage = (stage) => {
    // Admins can interact with all stages
    if (currentUser.role === 'admin') return true;
    
    // Managers can interact with all stages
    if (currentUser.role === 'manager') return true;
    
    // Team members can only interact with stages assigned to them
    return stage.assignedUserId === currentUser.id;
  };

  // Get available actions for a stage
  const getStageActions = (stage) => {
    const actions = [];
    
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
      if (stage.status === 'LOCKED') {
        actions.push({ label: 'Unlock', action: () => handleStageStatusChange(stage.id, 'READY') });
      }
      
      if (stage.status === 'READY') {
        actions.push({ label: 'Start', action: () => handleStageStatusChange(stage.id, 'IN_PROGRESS') });
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
    } else if (currentUser.role === 'team_member' && stage.assignedUserId === currentUser.id) {
      if (stage.status === 'READY') {
        actions.push({ label: 'Start', action: () => handleStageStatusChange(stage.id, 'IN_PROGRESS') });
      }
      
      if (stage.status === 'IN_PROGRESS') {
        actions.push({ label: 'Mark for Review', action: () => handleStageStatusChange(stage.id, 'REVIEW') });
      }
    }
    
    return actions;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{roadmap.name}</h1>
          <p className="text-slate-600 mt-1">{roadmap.description}</p>
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
      
      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-slate-900">Project Progress</h3>
          <span className="text-sm font-medium text-slate-700">
            {stages.filter(s => s.status === 'DONE').length}/{stages.length} stages completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ width: `${(stages.filter(s => s.status === 'DONE').length / stages.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Board View */}
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
              const canInteract = canInteractWithStage(stage);
              const actions = getStageActions(stage);
              
              return (
                <div 
                  key={stage.id}
                  className="flex flex-col items-center mb-8 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-2"
                >
                  {/* Stage Node */}
                  <div 
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      statusBg
                    } ${canInteract ? 'hover:scale-110 hover:shadow-lg' : ''} ${
                      selectedStage?.id === stage.id ? 'ring-4 ring-blue-400' : ''
                    }`}
                    onClick={() => canInteract && handleStageClick(stage)}
                  >
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow">
                      <span className="text-xs font-bold text-slate-700">{stage.index + 1}</span>
                    </div>
                    
                    <StatusIcon className={`w-8 h-8 ${statusColor}`} />
                    
                    {stage.assignedUserId && (
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
                        <UserCheck className="w-3 h-3 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Stage Info */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <h4 className="font-medium text-slate-900 text-sm truncate" title={stage.title}>
                      {stage.title}
                    </h4>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColor} bg-opacity-20`}>
                        {stage.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-600">
                        {getResponsibilityName(stage.responsibilityId)}
                      </span>
                    </div>
                    {stage.assignedUserId && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600 truncate">
                          {getUserName(stage.assignedUserId)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  {canInteract && actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {actions.slice(0, 2).map((action, idx) => (
                        <button
                          key={idx}
                          className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.action();
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                      {actions.length > 2 && (
                        <button className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-50">
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
        <Card className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Stage</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Responsibility</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Assignee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tasks</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.map((stage) => {
                    const StatusIcon = getStatusConfig(stage.status).icon;
                    const statusColor = getStatusConfig(stage.status).color;
                    const canInteract = canInteractWithStage(stage);
                    const actions = getStageActions(stage);
                    const tasks = getTasksByStage(stage.id);
                    const completedTasks = tasks.filter(t => t.status === 'DONE').length;
                    
                    return (
                      <tr 
                        key={stage.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => canInteract && handleStageClick(stage)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-slate-700">{stage.index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{stage.title}</div>
                              <div className="text-xs text-slate-500">{stage.description}</div>
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
                          <span className="text-sm">{getResponsibilityName(stage.responsibilityId)}</span>
                        </td>
                        <td className="py-3 px-4">
                          {stage.assignedUserId ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-3 h-3 text-slate-600" />
                              </div>
                              <span className="text-sm">{getUserName(stage.assignedUserId)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-500">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-green-500" 
                                style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-600">
                              {completedTasks}/{tasks.length}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {canInteract && actions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {actions.slice(0, 2).map((action, idx) => (
                                <button
                                  key={idx}
                                  className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                >
                                  {action.label}
                                </button>
                              ))}
                              {actions.length > 2 && (
                                <button className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-50">
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedStage.title}</h3>
                  <p className="text-slate-600 mt-1">{selectedStage.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedStage(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Stage Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-slate-600">Status</span>
                      <div className="flex items-center gap-2">
                        {React.createElement(getStatusConfig(selectedStage.status).icon, { className: `w-4 h-4 ${getStatusConfig(selectedStage.status).color}` })}
                        <span className="font-medium">{selectedStage.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-slate-600">Responsibility</span>
                      <span className="font-medium">{getResponsibilityName(selectedStage.responsibilityId)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-slate-600">SLA</span>
                      <span className="font-medium">{selectedStage.sla} days</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Assignee</h4>
                  {selectedStage.assignedUserId ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-medium">{getUserName(selectedStage.assignedUserId)}</div>
                        <div className="text-sm text-slate-600">Assigned</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Not Assigned</span>
                      </div>
                      <p className="text-sm text-amber-600 mt-1">This stage needs an assignee</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-2">Criteria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Entry Criteria</h5>
                    <ul className="space-y-2">
                      {selectedStage.entryCriteria?.map((criteria, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{criteria}</span>
                        </li>
                      )) || <li className="text-sm text-slate-500">No entry criteria defined</li>}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Exit Criteria</h5>
                    <ul className="space-y-2">
                      {selectedStage.exitCriteria?.map((criteria, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Flag className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{criteria}</span>
                        </li>
                      )) || <li className="text-sm text-slate-500">No exit criteria defined</li>}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-2">KPIs</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStage.kpis?.map((kpi, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {kpi}
                    </span>
                  )) || <span className="text-sm text-slate-500">No KPIs defined</span>}
                </div>
              </div>
              
              {(currentUser.role === 'admin' || currentUser.role === 'manager') && !selectedStage.assignedUserId && (
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-2">Assign to User</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 1, name: 'Admin User', role: 'admin' },
                      { id: 2, name: 'Manager User', role: 'manager' },
                      { id: 3, name: 'Team Member', role: 'team_member' }
                    ].map((user) => (
                      <button
                        key={user.id}
                        className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        onClick={() => handleAssignUser(selectedStage.id, user.id)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.role}</div>
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
                {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
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

export default RoadmapBoard;