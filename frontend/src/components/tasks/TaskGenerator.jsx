import React, { useState, useEffect } from 'react';
import { useTaskGeneratorStore } from '../../state/taskGeneratorStore';
import { useProjectStore } from '../../state/projectStore';
import { useRoadmapStore } from '../../state/roadmapStore';
import { useTaskStore } from '../../state/taskStore';
import { usePayrollStore } from '../../state/payrollStore';
import { useAttendanceStore } from '../../state/attendanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Zap,
  Settings,
  Play,
  CheckCircle,
  AlertTriangle,
  Users,
  Clock,
  Target,
  History
} from 'lucide-react';
import { toast } from 'react-toastify';

const TaskGenerator = () => {
  const {
    generationRules,
    generationHistory,
    generateTasksForProject,
    updateGenerationRules,
    validateProjectForGeneration,
    getGenerationStats,
    assignmentStrategies
  } = useTaskGeneratorStore();
  
  const { projects } = useProjectStore();
  const { roadmaps } = useRoadmapStore();
  const { addTask } = useTaskStore();
  const { employees } = usePayrollStore();
  const { attendanceRecords } = useAttendanceStore(); // Add attendance records
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [generationPreview, setGenerationPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localRules, setLocalRules] = useState(generationRules);
  
  // Get available projects (those without generated tasks or ready for regeneration)
  const availableProjects = projects.filter(project => project.status === 'active');
  
  // Get generation statistics
  const stats = getGenerationStats();
  
  // Handle project selection
  const handleProjectSelect = (projectId) => {
    const project = projects.find(p => p.id === parseInt(projectId));
    setSelectedProject(project);
    
    // Auto-select roadmap if project has one assigned
    if (project?.roadmapId) {
      const roadmap = roadmaps.find(r => r.id === project.roadmapId);
      setSelectedRoadmap(roadmap);
    }
    
    // Clear preview when changing project
    setGenerationPreview(null);
  };
  
  // Handle roadmap selection
  const handleRoadmapSelect = (roadmapId) => {
    const roadmap = roadmaps.find(r => r.id === parseInt(roadmapId));
    setSelectedRoadmap(roadmap);
    
    // Clear preview when changing roadmap
    setGenerationPreview(null);
  };
  
  // Generate preview of tasks that would be created
  const generatePreview = () => {
    if (!selectedProject || !selectedRoadmap) return;
    
    setLoading(true);
    
    try {
      // Get current tasks for workload-based assignment
      const { tasks: currentTasks } = useTaskStore.getState();
      
      // Generate tasks with attendance data for availability checking
      const preview = generateTasksForProject(
        selectedProject, 
        selectedRoadmap, 
        employees, 
        currentTasks,
        attendanceRecords // Pass attendance records for availability checking
      );
      
      setGenerationPreview(preview);
    } catch (error) {
      console.error('Preview generation error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle task generation
  const handleGenerateTasks = async () => {
    if (!selectedProject || !selectedRoadmap || !generationPreview) return;
    
    setLoading(true);
    
    try {
      // Add each generated task to the task store
      for (const task of generationPreview.tasks) {
        await addTask(task);
      }
      
      // Show success message
      toast.success(`Successfully generated ${generationPreview.tasks.length} tasks!`);
      
      // Reset form
      setSelectedProject(null);
      setSelectedRoadmap(null);
      setGenerationPreview(null);
    } catch (error) {
      console.error('Task generation error:', error);
      toast.error('Failed to generate tasks');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle settings save
  const handleSaveSettings = () => {
    updateGenerationRules(localRules);
    setShowSettings(false);
    toast.success('Settings saved successfully');
  };
  
  // Update local rules when global rules change
  useEffect(() => {
    setLocalRules(generationRules);
  }, [generationRules]);
  
  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary-600">{stats.totalGenerations}</div>
            <div className="text-sm text-surface-600">Total Generations</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-success-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-success-600">{stats.totalTasksGenerated}</div>
            <div className="text-sm text-surface-600">Tasks Generated</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-accent-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent-600">{stats.averageTasksPerGeneration}</div>
            <div className="text-sm text-surface-600">Avg per Project</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Settings className="h-8 w-8 text-info-500 mx-auto mb-2" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="mt-2"
            >
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assignment Strategy
                </label>
                <select
                  value={localRules.defaultAssignmentStrategy}
                  onChange={(e) => setLocalRules({...localRules, defaultAssignmentStrategy: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.entries(assignmentStrategies).map(([key, strategy]) => (
                    <option key={key} value={key}>
                      {strategy.name} - {strategy.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Task Naming Pattern
                </label>
                <input
                  type="text"
                  value={localRules.taskNamingPattern}
                  onChange={(e) => setLocalRules({...localRules, taskNamingPattern: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="{stepName} - {projectName}"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoAssignment"
                  checked={localRules.autoAssignment}
                  onChange={(e) => setLocalRules({...localRules, autoAssignment: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="autoAssignment" className="text-sm text-slate-700">
                  Automatic Assignment
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sequentialCreation"
                  checked={localRules.sequentialTaskCreation}
                  onChange={(e) => setLocalRules({...localRules, sequentialTaskCreation: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="sequentialCreation" className="text-sm text-slate-700">
                  Sequential Task Creation
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSaveSettings} variant="primary">
                Save Settings
              </Button>
              <Button onClick={() => setShowSettings(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Project and Roadmap Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a project...</option>
                {availableProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name} - {project.customerName} (Qty: {project.quantity})
                  </option>
                ))}
              </select>
              
              {selectedProject && (
                <div className="p-3 bg-primary-50 rounded-card">
                  <div className="text-sm font-medium text-primary-800">
                    {selectedProject.name}
                  </div>
                  <div className="text-xs text-primary-600 mt-1">
                    Customer: {selectedProject.customerName} • Quantity: {selectedProject.quantity}
                  </div>
                  <div className="text-xs text-primary-600">
                    Category: {selectedProject.category} • Days: {selectedProject.promiseDays}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Select Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <select
                value={selectedRoadmap?.id || ''}
                onChange={(e) => handleRoadmapSelect(e.target.value)}
                className="w-full px-3 py-2 border border-surface-300 rounded-card focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a roadmap...</option>
                {roadmaps.map(roadmap => (
                  <option key={roadmap.id} value={roadmap.id}>
                    {roadmap.name} ({roadmap.steps?.length || 0} steps)
                  </option>
                ))}
              </select>
              
              {selectedRoadmap && (
                <div className="p-3 bg-accent-50 rounded-card">
                  <div className="text-sm font-medium text-accent-800">
                    {selectedRoadmap.name}
                  </div>
                  <div className="text-xs text-accent-600 mt-1">
                    {selectedRoadmap.steps?.length || 0} steps • {selectedRoadmap.category}
                  </div>
                  <div className="text-xs text-accent-600">
                    Total SLA: {selectedRoadmap.steps?.reduce((sum, step) => sum + (step.slaHours || 0), 0) || 0} hours
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Generation Actions */}
      {selectedProject && selectedRoadmap && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <Button
                onClick={generatePreview}
                disabled={loading}
                variant="outline"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Preview Tasks'}
              </Button>
              
              {generationPreview && (
                <Button
                  onClick={handleGenerateTasks}
                  disabled={loading}
                  variant="primary"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Create {generationPreview.tasks.length} Tasks
                </Button>
              )}
            </div>
            
            {/* Generation Preview */}
            {generationPreview && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {generationPreview.tasks.length}
                    </div>
                    <div className="text-sm text-surface-600">Tasks to Create</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600">
                      {generationPreview.summary.estimatedTotalHours}h
                    </div>
                    <div className="text-sm text-surface-600">Total Hours</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600">
                      {generationPreview.summary.projectDuration}
                    </div>
                    <div className="text-sm text-surface-600">Working Days</div>
                  </div>
                </div>
                
                {/* Task Assignment Preview */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Task Distribution</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(generationPreview.summary.tasksByRole).map(([role, count]) => (
                      <div key={role} className="text-center p-2 bg-surface-50 rounded-card">
                        <div className="font-semibold text-slate-900">{count}</div>
                        <div className="text-xs text-surface-600">{role}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sample Tasks Preview */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Sample Tasks (First 3)</h4>
                  <div className="space-y-2">
                    {generationPreview.tasks.slice(0, 3).map((task, index) => (
                      <div key={index} className="p-3 bg-surface-50 rounded-card">
                        <div className="font-medium text-slate-900">{task.title}</div>
                        <div className="text-sm text-surface-600">
                          Assigned to: {task.assigneeName} • {task.estimatedHours}h • Due: {task.dueDate}
                        </div>
                      </div>
                    ))}
                    {generationPreview.tasks.length > 3 && (
                      <div className="text-center text-sm text-surface-500">
                        ... and {generationPreview.tasks.length - 3} more tasks
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Generation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Generations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentGenerations.length > 0 ? (
              stats.recentGenerations.map((generation) => (
                <div key={generation.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-card">
                  <div>
                    <div className="font-medium text-slate-900">
                      {generation.projectName}
                    </div>
                    <div className="text-sm text-surface-600">
                      {generation.tasksGenerated} tasks • {generation.roadmapName}
                    </div>
                    <div className="text-xs text-surface-500">
                      {new Date(generation.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">
                    {generation.strategy.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-surface-500">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No task generations yet</p>
                <p className="text-sm">Generate your first batch of tasks above!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskGenerator;