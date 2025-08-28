import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../state/projectStore';
import { useCategoryStore } from '../../state/categoryStore';
import { useRoadmapStore } from '../../state/roadmapStore';
import { useAuthStore } from '../../state/authStore';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Users, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const ProjectManagement = () => {
  const { 
    projects, 
    getProjectMetrics, 
    getCategoryWiseStats, 
    getOverdueProjects,
    addProject,
    updateProject,
    deleteProject
  } = useProjectStore();
  
  const { getActiveCategories } = useCategoryStore();
  const { getActiveRoadmaps, getRoadmapWithMetrics } = useRoadmapStore();
  const { isAdmin, isManager } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [projectMetrics, setProjectMetrics] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [overdueProjects, setOverdueProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

  // Form state for new project
  const [newProject, setNewProject] = useState({
    name: '',
    customer: '',
    categoryId: '',
    roadmapId: '',
    quantity: 1,
    promiseDays: 30,
    budget: 0,
    priority: 'medium',
    description: '',
    assignedTeam: [],
    perUnitTAT: 0
  });

  useEffect(() => {
    // Load data
    setProjectMetrics(getProjectMetrics());
    setCategoryStats(getCategoryWiseStats());
    setOverdueProjects(getOverdueProjects());
    setCategories(getActiveCategories());
    setRoadmaps(getActiveRoadmaps());
  }, [projects, getProjectMetrics, getCategoryWiseStats, getOverdueProjects, getActiveCategories, getActiveRoadmaps]);

  // Update perUnitTAT when roadmap changes
  useEffect(() => {
    if (newProject.roadmapId) {
      const roadmap = getRoadmapWithMetrics(parseInt(newProject.roadmapId));
      if (roadmap) {
        setNewProject(prev => ({
          ...prev,
          perUnitTAT: roadmap.totalTAT
        }));
      }
    }
  }, [newProject.roadmapId, getRoadmapWithMetrics]);

  const handleAddProject = () => {
    if (newProject.name && newProject.customer && newProject.categoryId) {
      addProject({
        ...newProject,
        categoryId: parseInt(newProject.categoryId),
        roadmapId: parseInt(newProject.roadmapId),
        quantity: parseInt(newProject.quantity),
        promiseDays: parseInt(newProject.promiseDays),
        budget: parseFloat(newProject.budget),
        perUnitTAT: parseInt(newProject.perUnitTAT) || 0,
        createdBy: 'Current User'
      });
      setShowAddModal(false);
      // Reset form
      setNewProject({
        name: '',
        customer: '',
        categoryId: '',
        roadmapId: '',
        quantity: 1,
        promiseDays: 30,
        budget: 0,
        priority: 'medium',
        description: '',
        assignedTeam: [],
        perUnitTAT: 0
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.categoryId === parseInt(selectedCategory);
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Project Management</h1>
          <p className="text-surface-600 mt-1">Manage your projects and track progress</p>
        </div>
        {(isAdmin() || isManager()) && (
          <Button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">Total Projects</p>
                <p className="text-2xl font-bold text-surface-900">{projectMetrics?.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">Completed</p>
                <p className="text-2xl font-bold text-surface-900">{projectMetrics?.completed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">In Progress</p>
                <p className="text-2xl font-bold text-surface-900">{projectMetrics?.inProgress || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">Overdue</p>
                <p className="text-2xl font-bold text-surface-900">{projectMetrics?.overdue || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">Total Budget</p>
                <p className="text-2xl font-bold text-surface-900">₹{projectMetrics?.totalBudget?.toLocaleString() || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-3 px-4 font-medium text-surface-500">Project</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500">Budget</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-surface-100 hover:bg-surface-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-surface-900">{project.name}</div>
                        <div className="text-sm text-surface-500">
                          {project.quantity} units • {project.promiseDays} days • {project.perUnitTAT} TAT
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-surface-700">{project.customer}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{project.category}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-24 bg-surface-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-surface-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-surface-900">
                      ₹{project.budget?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-surface-500 hover:text-primary-600 rounded-lg hover:bg-primary-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-surface-500 hover:text-primary-600 rounded-lg hover:bg-primary-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-surface-500 hover:text-red-600 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-xl font-bold text-surface-900">Add New Project</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Customer</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newProject.customer}
                    onChange={(e) => setNewProject({...newProject, customer: e.target.value})}
                    placeholder="Enter customer name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newProject.categoryId}
                    onChange={(e) => setNewProject({...newProject, categoryId: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Roadmap</label>
                  <select
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newProject.roadmapId}
                    onChange={(e) => setNewProject({...newProject, roadmapId: e.target.value})}
                  >
                    <option value="">Select roadmap</option>
                    {roadmaps.map(roadmap => (
                      <option key={roadmap.id} value={roadmap.id}>
                        {roadmap.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Priority</label>
                  <select
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newProject.priority}
                    onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newProject.quantity}
                    onChange={(e) => setNewProject({...newProject, quantity: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Promise Days</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={newProject.promiseDays}
                    onChange={(e) => setNewProject({...newProject, promiseDays: parseInt(e.target.value) || 30})}
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Per Unit TAT (Auto-calculated)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-100"
                    value={newProject.perUnitTAT || 0}
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Budget (₹)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({...newProject, budget: parseFloat(e.target.value) || 0})}
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Enter project description"
                />
              </div>
            </div>
            <div className="p-6 border-t border-surface-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProject}
                disabled={!newProject.name || !newProject.customer || !newProject.categoryId}
              >
                Add Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;