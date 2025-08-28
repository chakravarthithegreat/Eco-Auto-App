import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  Settings,
  Download,
  Upload,
  History,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import useRoleManagementStore from '../../state/roleManagementStore';
import { triggerHaptic } from '../../utils/hapticUtils';

// Error Boundary Component
class RoleManagementErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('RoleManagement Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Role Management Error
                </h3>
                <p className="text-red-600 dark:text-red-400">
                  Something went wrong with the role management system.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700"
              >
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-red-600">Error Details</summary>
                <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Main RoleManagement Component
const RoleManagement = () => {
  const {
    roles,
    responsibilities,
    subResponsibilities,
    isLoading,
    error,
    auditLog,
    initialize,
    addRole,
    updateRole,
    deleteRole,
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
    addSubResponsibility,
    updateSubResponsibility,
    deleteSubResponsibility,
    exportRoles,
    importRoles,
    clearError,
    getResponsibilitiesByRole,
    getSubResponsibilitiesByResponsibility
  } = useRoleManagementStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRoles, setExpandedRoles] = useState(new Set());
  const [expandedResponsibilities, setExpandedResponsibilities] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize store on mount
  useEffect(() => {
    try {
      initialize();
      setIsInitializing(false);
    } catch (error) {
      console.error('Failed to initialize role management:', error);
      setIsInitializing(false);
    }
  }, [initialize]);

  // Force re-render when responsibilities change
  useEffect(() => {
    console.log('Responsibilities changed, forcing re-render');
  }, [responsibilities, roles]);

  // Safe data access with fallbacks
  const safeRoles = Array.isArray(roles) ? roles : [];
  const safeResponsibilities = Array.isArray(responsibilities) ? responsibilities : [];
  const safeSubResponsibilities = Array.isArray(subResponsibilities) ? subResponsibilities : [];
  const safeAuditLog = Array.isArray(auditLog) ? auditLog : [];

  console.log('COMPONENT: Current state:', {
    rolesCount: safeRoles.length,
    responsibilitiesCount: safeResponsibilities.length,
    subResponsibilitiesCount: safeSubResponsibilities.length,
    roles: safeRoles.map(r => ({ id: r.id, name: r.name, responsibilities: r.responsibilities })),
    responsibilities: safeResponsibilities.map(r => ({ id: r.id, name: r.name, roleId: r.roleId }))
  });

  // Filter data based on search term
  const filteredRoles = safeRoles.filter(role =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle expansion functions
  const toggleRoleExpansion = useCallback((roleId) => {
    setExpandedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  }, []);

  const toggleResponsibilityExpansion = useCallback((responsibilityId) => {
    setExpandedResponsibilities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(responsibilityId)) {
        newSet.delete(responsibilityId);
      } else {
        newSet.add(responsibilityId);
      }
      return newSet;
    });
  }, []);

  // Edit functions
  const startEditing = (type, item) => {
    setEditingItem({ type, item: { ...item } });
  };

  const cancelEditing = () => {
    setEditingItem(null);
  };

  const saveEditing = () => {
    try {
      if (!editingItem) return;

      const { type, item } = editingItem;

      switch (type) {
        case 'role':
          updateRole(item.id, {
            name: item.name,
            description: item.description
          });
          break;
        case 'responsibility':
          updateResponsibility(item.id, {
            name: item.name,
            description: item.description,
            capacityHrs: item.capacityHrs
          });
          break;
        case 'subResponsibility':
          updateSubResponsibility(item.id, {
            name: item.name,
            description: item.description,
            slaHours: item.slaHours
          });
          break;
      }

      setEditingItem(null);
      triggerHaptic('success');
    } catch (error) {
      console.error('Error saving edit:', error);
      triggerHaptic('error');
    }
  };

  // Add functions
  const handleAddRole = useCallback(() => {
    console.log('handleAddRole called');
    try {
      setShowAddDialog('role');
      console.log('Add role dialog opened');
    } catch (error) {
      console.error('Error opening add role dialog:', error);
    }
  }, []);

  const handleAddResponsibility = useCallback((roleId) => {
    console.log('handleAddResponsibility called with roleId:', roleId);
    try {
      setShowAddDialog({ type: 'responsibility', roleId });
      console.log('Add responsibility dialog opened for role:', roleId);
    } catch (error) {
      console.error('Error opening add responsibility dialog:', error);
    }
  }, []);

  const handleAddSubResponsibility = useCallback((responsibilityId) => {
    console.log('handleAddSubResponsibility called with responsibilityId:', responsibilityId);
    try {
      setShowAddDialog({ type: 'subResponsibility', responsibilityId });
      console.log('Add sub-responsibility dialog opened for responsibility:', responsibilityId);
    } catch (error) {
      console.error('Error opening add sub-responsibility dialog:', error);
    }
  }, []);

  const submitAddDialog = useCallback(() => {
    console.log('submitAddDialog called with:', showAddDialog);
    try {
      if (!showAddDialog) {
        console.log('No dialog to submit');
        return;
      }

      if (showAddDialog === 'role') {
        console.log('Adding new role');
        const newRole = addRole({
          name: 'New Role',
          description: 'Role description'
        });
        console.log('Role added:', newRole);
        console.log('Current roles after adding:', roles);
      } else if (showAddDialog.type === 'responsibility') {
        console.log('Adding new responsibility for role:', showAddDialog.roleId);
        console.log('All responsibilities before adding:', responsibilities);

        const newResp = addResponsibility(showAddDialog.roleId, {
          name: 'New Responsibility',
          description: 'Responsibility description',
          capacityHrs: 20
        });

        console.log('Responsibility added:', newResp);
        console.log('All responsibilities after adding:', responsibilities);
        console.log('Responsibilities for role', showAddDialog.roleId, ':', getResponsibilitiesByRole(showAddDialog.roleId));
      } else if (showAddDialog.type === 'subResponsibility') {
        console.log('Adding new sub-responsibility for responsibility:', showAddDialog.responsibilityId);
        const newSubResp = addSubResponsibility(showAddDialog.responsibilityId, {
          name: 'New Sub-Responsibility',
          description: 'Sub-responsibility description',
          slaHours: 24
        });
        console.log('Sub-responsibility added:', newSubResp);
        console.log('Sub-responsibilities for responsibility', showAddDialog.responsibilityId, ':', getSubResponsibilitiesByResponsibility(showAddDialog.responsibilityId));
      }

      setShowAddDialog(null);
      triggerHaptic('success');
      console.log('Dialog closed successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      triggerHaptic('error');
    }
  }, [showAddDialog, addRole, addResponsibility, addSubResponsibility, roles, responsibilities, getResponsibilitiesByRole, getSubResponsibilitiesByResponsibility]);

  // Delete functions with confirmation
  const handleDelete = (type, item) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      switch (type) {
        case 'role':
          deleteRole(item.id);
          break;
        case 'responsibility':
          deleteResponsibility(item.id);
          break;
        case 'subResponsibility':
          deleteSubResponsibility(item.id);
          break;
      }
      triggerHaptic('medium');
    } catch (error) {
      console.error('Error deleting item:', error);
      triggerHaptic('error');
    }
  };

  // Export/Import functions
  const handleExport = () => {
    try {
      const data = exportRoles();
      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roles-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        triggerHaptic('success');
      }
    } catch (error) {
      console.error('Error exporting roles:', error);
      triggerHaptic('error');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (importRoles(data)) {
          triggerHaptic('success');
          alert('Roles imported successfully!');
        } else {
          alert('Failed to import roles. Please check the file format.');
        }
      } catch (error) {
        console.error('Error importing roles:', error);
        alert('Invalid file format. Please select a valid roles backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Loading state
  if (isInitializing) {
    return (
      <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading Role Management...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <RoleManagementErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Role & Responsibility Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage organizational roles, responsibilities, and sub-responsibilities
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAddRole}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <label>
              <Button variant="outline" as="span">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <Button
              variant="outline"
              onClick={() => setShowAuditLog(!showAuditLog)}
            >
              <History className="w-4 h-4 mr-2" />
              Audit Log
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearError}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search roles, responsibilities, or sub-responsibilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Audit Log */}
        {showAuditLog && (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {safeAuditLog.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No audit entries yet</p>
                ) : (
                  safeAuditLog.slice(-10).reverse().map((entry, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Badge variant="outline" className="text-xs">
                        {entry.action}
                      </Badge>
                      <span className="text-sm flex-1">{entry.entityName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roles Tree */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Roles & Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredRoles.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'No roles found matching your search' : 'No roles created yet'}
                  </p>
                  <Button
                    onClick={(e) => {
                      console.log('Create First Role button clicked');
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddRole();
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Role
                  </Button>
                </div>
              ) : (
                filteredRoles.map((role) => (
                  <div key={`${role.id}-${getResponsibilitiesByRole(role.id).length}`}>
                    <RoleItem
                      role={role}
                      responsibilities={getResponsibilitiesByRole(role.id)}
                      subResponsibilities={safeSubResponsibilities}
                      expandedRoles={expandedRoles}
                      expandedResponsibilities={expandedResponsibilities}
                      editingItem={editingItem}
                      onToggleRole={toggleRoleExpansion}
                      onToggleResponsibility={toggleResponsibilityExpansion}
                      onEdit={startEditing}
                      onDelete={handleDelete}
                      onAddResponsibility={handleAddResponsibility}
                      onAddSubResponsibility={handleAddSubResponsibility}
                      onCancelEdit={cancelEditing}
                      onSaveEdit={saveEditing}
                      onUpdateEditingItem={setEditingItem}
                    />
                    {/* Debug: Show responsibilities for this role */}
                    <div style={{ marginLeft: '20px', marginTop: '10px', fontSize: '12px', color: '#666' }}>
                      Debug - Role {role.name}: {getResponsibilitiesByRole(role.id).length} responsibilities
                      {getResponsibilitiesByRole(role.id).map(resp => (
                        <div key={resp.id}>• {resp.name} (roleId: {resp.roleId})</div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Dialog */}
        {showAddDialog && (
          <Card className="rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle>
                Add {showAddDialog === 'role' ? 'Role' :
                     showAddDialog.type === 'responsibility' ? 'Responsibility' : 'Sub-Responsibility'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAddDialog(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    console.log('Submit Add Dialog button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    submitAddDialog();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </RoleManagementErrorBoundary>
  );
};

// Role Item Component
const RoleItem = ({
  role,
  responsibilities,
  subResponsibilities,
  expandedRoles,
  expandedResponsibilities,
  editingItem,
  onToggleRole,
  onToggleResponsibility,
  onEdit,
  onDelete,
  onAddResponsibility,
  onAddSubResponsibility,
  onCancelEdit,
  onSaveEdit,
  onUpdateEditingItem
}) => {
  const isExpanded = expandedRoles.has(role.id);
  const isEditing = editingItem?.type === 'role' && editingItem.item.id === role.id;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <div
        className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30"
        onClick={() => onToggleRole(role.id)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-green-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-green-600" />
          )}
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
            Role
          </Badge>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingItem.item.name || ''}
                onChange={(e) => onUpdateEditingItem({
                  ...editingItem,
                  item: { ...editingItem.item, name: e.target.value }
                })}
                className="font-semibold"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                {role.name || 'Unnamed Role'}
              </h3>
              {role.description && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {role.description}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {responsibilities.length} responsibilities
          </span>

          {isEditing ? (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={onCancelEdit}>
                <X className="w-3 h-3" />
              </Button>
              <Button size="sm" onClick={onSaveEdit}>
                <Save className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit('role', role);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete('role', role);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  console.log('Add Responsibility button clicked for role:', role.id);
                  e.preventDefault();
                  e.stopPropagation();
                  onAddResponsibility(role.id);
                }}
                title="Add Responsibility"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {responsibilities.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No responsibilities yet. Click + to add one.
            </div>
          ) : (
            <div className="space-y-2">
              {responsibilities.map((responsibility) => (
                <ResponsibilityItem
                  key={responsibility.id}
                  responsibility={responsibility}
                  subResponsibilities={subResponsibilities.filter(sr => sr.responsibilityId === responsibility.id)}
                  expandedResponsibilities={expandedResponsibilities}
                  editingItem={editingItem}
                  onToggleResponsibility={onToggleResponsibility}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddSubResponsibility={onAddSubResponsibility}
                  onCancelEdit={onCancelEdit}
                  onSaveEdit={onSaveEdit}
                  onUpdateEditingItem={onUpdateEditingItem}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Responsibility Item Component
const ResponsibilityItem = ({
  responsibility,
  subResponsibilities,
  expandedResponsibilities,
  editingItem,
  onToggleResponsibility,
  onEdit,
  onDelete,
  onAddSubResponsibility,
  onCancelEdit,
  onSaveEdit,
  onUpdateEditingItem
}) => {
  const isExpanded = expandedResponsibilities.has(responsibility.id);
  const isEditing = editingItem?.type === 'responsibility' && editingItem.item.id === responsibility.id;

  return (
    <div className="border-l-2 border-blue-200 dark:border-blue-800 ml-4">
      <div
        className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
        onClick={() => onToggleResponsibility(responsibility.id)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-blue-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-blue-600" />
          )}
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
            Responsibility
          </Badge>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingItem.item.name || ''}
                onChange={(e) => onUpdateEditingItem({
                  ...editingItem,
                  item: { ...editingItem.item, name: e.target.value }
                })}
                className="font-semibold"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                {responsibility.name || 'Unnamed Responsibility'}
              </h4>
              {responsibility.description && (
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {responsibility.description}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {responsibility.capacityHrs && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {responsibility.capacityHrs}h/week
            </Badge>
          )}

          {isEditing ? (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={onCancelEdit}>
                <X className="w-3 h-3" />
              </Button>
              <Button size="sm" onClick={onSaveEdit}>
                <Save className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit('responsibility', responsibility);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete('responsibility', responsibility);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  console.log('Add Sub-Responsibility button clicked for responsibility:', responsibility.id);
                  e.preventDefault();
                  e.stopPropagation();
                  onAddSubResponsibility(responsibility.id);
                }}
                title="Add Sub-Responsibility"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-3">
          {subResponsibilities.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No sub-responsibilities yet. Click + to add one.
            </div>
          ) : (
            <div className="space-y-2">
              {subResponsibilities.map((subResponsibility) => (
                <SubResponsibilityItem
                  key={subResponsibility.id}
                  subResponsibility={subResponsibility}
                  editingItem={editingItem}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCancelEdit={onCancelEdit}
                  onSaveEdit={onSaveEdit}
                  onUpdateEditingItem={onUpdateEditingItem}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Sub-Responsibility Item Component
const SubResponsibilityItem = ({
  subResponsibility,
  editingItem,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  onUpdateEditingItem
}) => {
  const isEditing = editingItem?.type === 'subResponsibility' && editingItem.item.id === subResponsibility.id;

  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-8">
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Sub-Responsibility
          </Badge>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingItem.item.name || ''}
                onChange={(e) => onUpdateEditingItem({
                  ...editingItem,
                  item: { ...editingItem.item, name: e.target.value }
                })}
                className="font-semibold"
              />
            </div>
          ) : (
            <div>
              <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                {subResponsibility.name || 'Unnamed Sub-Responsibility'}
              </h5>
              {subResponsibility.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subResponsibility.description}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {subResponsibility.slaHours && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              SLA: {subResponsibility.slaHours}h
            </Badge>
          )}

          {isEditing ? (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={onCancelEdit}>
                <X className="w-3 h-3" />
              </Button>
              <Button size="sm" onClick={onSaveEdit}>
                <Save className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit('subResponsibility', subResponsibility);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete('subResponsibility', subResponsibility);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
