import React, { useState } from 'react';
import { useCategoryStore } from '../../state/categoryStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Palette,
  Factory,
  Megaphone,
  TrendingUp,
  GraduationCap,
  Folder,
  BarChart3,
  DollarSign,
  Target,
  Clock
} from 'lucide-react';

const iconMap = {
  Palette,
  Factory,
  Megaphone,
  TrendingUp,
  GraduationCap,
  Folder,
  BarChart3,
  DollarSign,
  Target,
  Clock
};

const CategoryManagement = () => {
  const {
    categories,
    getActiveCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    validateCategory,
    getCategoryAnalytics,
    getCategoryUsageStats
  } = useCategoryStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6b7280',
    icon: 'Folder',
    defaultTATHours: 8,
    budgetMultiplier: 1.0,
    requiredSkills: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState([]);

  const activeCategories = getActiveCategories();
  const categoryAnalytics = getCategoryAnalytics();
  const usageStats = getCategoryUsageStats();

  // Handle form submission
  const handleSubmit = () => {
    const validation = validateCategory(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      if (editingId) {
        updateCategory(editingId, formData);
        setEditingId(null);
      } else {
        createCategory(formData);
        setIsCreating(false);
      }
      
      resetForm();
      setErrors([]);
    } catch (error) {
      setErrors([error.message]);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#6b7280',
      icon: 'Folder',
      defaultTATHours: 8,
      budgetMultiplier: 1.0,
      requiredSkills: []
    });
    setSkillInput('');
    setErrors([]);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  // Start editing
  const startEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      defaultTATHours: category.defaultTATHours,
      budgetMultiplier: category.budgetMultiplier,
      requiredSkills: [...category.requiredSkills]
    });
    setEditingId(category.id);
  };

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  // Remove skill
  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        deleteCategory(id);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // Get icon component
  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName] || Folder;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Statistics */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Project Categories</h2>
          <p className="text-gray-600 mt-1">Manage project categories and view performance analytics</p>
        </div>
        
        <Button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
          disabled={isCreating || editingId}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{usageStats.totalCategories}</p>
              </div>
              <Folder className="w-8 h-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{usageStats.totalProjects}</p>
              </div>
              <Target className="w-8 h-8 text-success-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{(usageStats.totalRevenue / 100000).toFixed(1)}L
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-warning-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{usageStats.averageProjectsPerCategory}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-info-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Category' : 'Create New Category'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <ul className="text-sm text-red-600 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default TAT Hours
                </label>
                <Input
                  type="number"
                  value={formData.defaultTATHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultTATHours: parseInt(e.target.value) || 8 }))}
                  min="1"
                  max="200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded-md"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#6b7280"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Multiplier
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.budgetMultiplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, budgetMultiplier: parseFloat(e.target.value) || 1.0 }))}
                  min="0.1"
                  max="5.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.keys(iconMap).map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requiredSkills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryAnalytics.map(category => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {getIconComponent(category.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={category.performanceGrade.startsWith('A') ? 'success' : 
                                  category.performanceGrade.startsWith('B') ? 'info' :
                                  category.performanceGrade.startsWith('C') ? 'warning' : 'destructive'}>
                    Grade {category.performanceGrade}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(category)}
                    disabled={isCreating || editingId}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    disabled={isCreating || editingId}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{category.totalProjects}</p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-success-600">{category.completedProjects}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-primary-600">{category.completionRate}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-warning-600">{category.averageEfficiency}%</p>
                  <p className="text-sm text-gray-600">Efficiency</p>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-lg font-semibold text-success-600">
                      ₹{(category.totalRevenue / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Avg per Project</p>
                    <p className="text-lg font-semibold text-info-600">
                      ₹{(category.averageRevenue / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Details */}
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Default TAT:</span>
                  <span className="font-medium">{category.defaultTATHours}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget Multiplier:</span>
                  <span className="font-medium">{category.budgetMultiplier}x</span>
                </div>
              </div>

              {/* Required Skills */}
              {category.requiredSkills.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.requiredSkills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {activeCategories.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Yet</h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first project category.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategoryManagement;