import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Share2,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  TrendingUp
} from 'lucide-react';

const ProjectsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for projects
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design and improved UX',
      status: 'in_progress',
      progress: 75,
      startDate: '2023-05-15',
      endDate: '2023-08-30',
      team: [
        { id: 1, name: 'Sarah Johnson', role: 'Designer' },
        { id: 2, name: 'Michael Chen', role: 'Developer' },
        { id: 3, name: 'Emma Rodriguez', role: 'Project Manager' }
      ],
      budget: 50000,
      spent: 32000
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms',
      status: 'planning',
      progress: 15,
      startDate: '2023-07-01',
      endDate: '2023-12-15',
      team: [
        { id: 4, name: 'David Kim', role: 'Lead Developer' },
        { id: 5, name: 'Lisa Wang', role: 'UX Designer' }
      ],
      budget: 120000,
      spent: 18000
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      description: 'Q3 digital marketing campaign for product launch',
      status: 'completed',
      progress: 100,
      startDate: '2023-04-01',
      endDate: '2023-06-30',
      team: [
        { id: 6, name: 'Robert Taylor', role: 'Marketing Director' },
        { id: 7, name: 'Jennifer Lee', role: 'Content Creator' }
      ],
      budget: 25000,
      spent: 24500
    },
    {
      id: 4,
      name: 'Data Migration',
      description: 'Migration of legacy systems to cloud infrastructure',
      status: 'on_hold',
      progress: 45,
      startDate: '2023-03-10',
      endDate: '2023-09-20',
      team: [
        { id: 8, name: 'Thomas Brown', role: 'System Architect' },
        { id: 9, name: 'Amanda Clark', role: 'DevOps Engineer' }
      ],
      budget: 75000,
      spent: 38000
    }
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <TrendingUp className="w-4 h-4" />;
      case 'planning': return <Clock className="w-4 h-4" />;
      case 'on_hold': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };
  
  // Filter projects based on active tab and search term
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'active') {
      matchesTab = project.status === 'in_progress' || project.status === 'planning';
    } else if (activeTab === 'completed') {
      matchesTab = project.status === 'completed';
    }
    
    return matchesSearch && matchesTab;
  });
  
  // Get project statistics
  const getProjectStats = () => {
    return {
      total: projects.length,
      active: projects.filter(p => p.status === 'in_progress' || p.status === 'planning').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'on_hold').length
    };
  };
  
  const projectStats = getProjectStats();

  return (
    <div>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900">Projects Dashboard</h1>
            <p className="text-surface-600 mt-1">Manage projects and track team progress</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              
              <Button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-green to-primary-green-light text-surface-900"
              >
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </div>
          </div>
        </div>
        
        {/* Project Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{projectStats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{projectStats.active}</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{projectStats.completed}</p>
                </div>
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-gray-500 bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">On Hold</p>
                  <p className="text-2xl font-bold text-gray-900">{projectStats.onHold}</p>
                </div>
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
                    {project.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(project.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {project.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.progress < 30 ? 'bg-red-500' : 
                        project.progress < 70 ? 'bg-amber-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Dates</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      <span>Budget</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {/* Team Members */}
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="w-4 h-4 mr-1" />
                    <span>Team ({project.team.length})</span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 4).map((member, index) => (
                      <div 
                        key={member.id} 
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-green to-accent-blue flex items-center justify-center border-2 border-white"
                        title={member.name}
                      >
                        <span className="text-white text-xs font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    ))}
                    {project.team.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white">
                        <span className="text-gray-600 text-xs font-medium">
                          +{project.team.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </Card>
        )}
        
        {/* Add Project Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                      placeholder="Enter project budget"
                    />
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
                    className="bg-gradient-to-r from-primary-green to-primary-green-light text-surface-900"
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;