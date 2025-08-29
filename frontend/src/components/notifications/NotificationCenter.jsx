import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useNavigationStore } from '../../state/navigationStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  Target, 
  Zap,
  Award,
  Flag,
  Play,
  Eye,
  Lock,
  Badge,
  Edit,
  CheckSquare
} from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { playNotificationSound, setNotificationSoundSettings } from '../../utils/notificationSoundUtils';
import { getNotifications, markNotificationAsRead, clearNotifications } from '../../utils/notificationUtils';

const NotificationCenter = () => {
  const { user } = useAuthStore();
  const { setCurrentPage } = useNavigationStore();
  
  console.log('NotificationCenter: Component rendered with user:', user);
  console.log('NotificationCenter: User role:', user?.role);
  console.log('NotificationCenter: Is admin:', user?.role === 'ADMIN');
  console.log('NotificationCenter: Is manager:', user?.role === 'MANAGER');
  console.log('NotificationCenter: Can view employee notifications:', user?.role === 'ADMIN' || user?.role === 'MANAGER');
  
  // Navigate to employee approval dashboard
  const navigateToApprovals = () => {
    setCurrentPage('employee-approvals');
  };

  // Navigate to specific employee approval
  const navigateToEmployeeApproval = (employeeId) => {
    // Store the selected employee ID in localStorage for the approval page to access
    if (employeeId) {
      localStorage.setItem('selectedEmployeeForApproval', employeeId);
    }
    setCurrentPage('employee-approvals');
  };
  
  // Navigate to employee profile creation for editing
  const navigateToEditEmployee = (employeeId) => {
    if (employeeId) {
      localStorage.setItem('selectedEmployeeForEditing', employeeId);
    }
    setCurrentPage('profile-creation');
  };
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'stage-ready',
      title: 'Stage Ready for Assignment',
      message: 'UI/UX Design stage is ready for your review',
      timestamp: '2 minutes ago',
      priority: 'high',
      action: 'Assign',
      icon: Target,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'task-blocked',
      title: 'Task Blocked',
      message: 'API Development task is blocked due to dependency',
      timestamp: '15 minutes ago',
      priority: 'high',
      action: 'Resolve',
      icon: AlertCircle,
      color: 'text-red-500'
    },
    {
      id: 3,
      type: 'handoff-needed',
      title: 'Handoff Required',
      message: 'Frontend Development stage completed, next stage ready',
      timestamp: '1 hour ago',
      priority: 'medium',
      action: 'Handoff',
      icon: Zap,
      color: 'text-green-500'
    },
    {
      id: 4,
      type: 'sla-risk',
      title: 'SLA Risk Detected',
      message: 'Backend Integration stage approaching deadline',
      timestamp: '2 hours ago',
      priority: 'high',
      action: 'Escalate',
      icon: Clock,
      color: 'text-amber-500'
    },
    {
      id: 5,
      type: 'achievement',
      title: 'New Achievement Unlocked',
      message: 'Completed 10 tasks this week - Consistent Performer',
      timestamp: '3 hours ago',
      priority: 'low',
      action: 'View',
      icon: Award,
      color: 'text-purple-500'
    }
  ]);
  
  const [employeeNotifications, setEmployeeNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showHUD, setShowHUD] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key
  
  console.log('NotificationCenter: Current employeeNotifications state:', employeeNotifications);

  // Load employee notifications for admins and managers
  useEffect(() => {
    console.log('NotificationCenter: useEffect triggered with user:', user);
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      console.log('NotificationCenter: User is admin or manager, loading employee notifications');
      const storedEmployeeNotifications = getNotifications();
      console.log('NotificationCenter: Found employee notifications:', storedEmployeeNotifications);
      setEmployeeNotifications(storedEmployeeNotifications);
    } else {
      console.log('NotificationCenter: User is not admin or manager, clearing employee notifications');
      setEmployeeNotifications([]);
    }
  }, [user, refreshKey]); // Add refreshKey to dependencies

  // Add a function to manually refresh notifications
  const refreshNotifications = () => {
    console.log('NotificationCenter: Manually refreshing notifications');
    setRefreshKey(prev => prev + 1);
  };

  // Filter general notifications based on priority
  const filteredGeneralNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.priority === filter);

  // Filter employee notifications
  const filteredEmployeeNotifications = employeeNotifications;

  // Mark general notification as read
  const markGeneralAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Mark employee notification as read
  const markEmployeeAsRead = (id) => {
    markNotificationAsRead(id);
    // Reload employee notifications
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      const storedEmployeeNotifications = getNotifications();
      setEmployeeNotifications(storedEmployeeNotifications);
    }
  };

  // Mark all general notifications as read
  const markAllGeneralAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Mark all employee notifications as read
  const markAllEmployeeAsRead = () => {
    // In a real implementation, we would mark all as read
    // For now, we'll just reload to reflect any changes
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      const storedEmployeeNotifications = getNotifications();
      setEmployeeNotifications(storedEmployeeNotifications);
    }
  };

  // Clear all employee notifications
  const clearAllEmployeeNotifications = () => {
    clearNotifications();
    setEmployeeNotifications([]);
  };

  // Remove general notification
  const removeGeneralNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Add a new notification (for testing sound)
  const addNotification = () => {
    const newNotification = {
      id: notifications.length + 1,
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification with sound',
      timestamp: 'just now',
      priority: 'medium',
      action: 'View',
      icon: Bell,
      color: 'text-blue-500'
    };
    
    setNotifications([newNotification, ...notifications]);
    
    // Play notification sound
    playNotificationSound();
  };

  // Get notification icon component
  const getIconComponent = (Icon, color) => {
    return <Icon className={`w-5 h-5 ${color}`} />;
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Get employee notification icon
  const getEmployeeNotificationIcon = (type) => {
    switch (type) {
      case 'employee-registration':
        return <User className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get employee notification color
  const getEmployeeNotificationColor = (type) => {
    switch (type) {
      case 'employee-registration':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Refresh Button for Debugging */}
      <div className="flex justify-end">
        <Button onClick={refreshNotifications} variant="outline" size="sm">
          Refresh Notifications
        </Button>
      </div>
      
      {/* Game-Style HUD */}
      <AnimatePresence>
        {showHUD && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 w-80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white">Live Events</h3>
                <button 
                  onClick={() => setShowHUD(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div 
                      key={notification.id} 
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className={`mt-0.5 ${notification.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-900 dark:text-white">
                          {notification.title}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {notification.message}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs h-6">
                        {notification.action}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Stay updated with project events and alerts
          </p>
        </div>

        {/* General Notifications Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                General Notifications
              </CardTitle>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={filter === 'high' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('high')}
                >
                  High Priority
                </Button>
                <Button 
                  variant={filter === 'medium' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('medium')}
                >
                  Medium
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllGeneralAsRead}
                >
                  Mark All Read
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {filteredGeneralNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No general notifications
                </h3>
                <p className="text-gray-500">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...filteredGeneralNotifications].reverse().map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div 
                      key={notification.id} 
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className={`mt-0.5 ${notification.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.timestamp}
                          </span>
                          <Button size="sm" variant="outline">
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeGeneralNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee Registration Alerts Section (for Admins and Managers only) */}
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Employee Registration Alerts
                </CardTitle>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={markAllEmployeeAsRead}
                  >
                    Mark All Read
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearAllEmployeeNotifications}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={navigateToApprovals}
                  >
                    View All Approvals
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredEmployeeNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No employee registration alerts
                  </h3>
                  <p className="text-gray-500">
                    No new employee registrations pending review.
                  </p>
                  {/* Debug info */}
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">
                      Debug: User role is "{user?.role}"
                    </p>
                    <p className="text-sm text-gray-600">
                      Debug: Employee notifications count: {employeeNotifications.length}
                    </p>
                    <p className="text-sm text-gray-600">
                      Debug: Filtered employee notifications count: {filteredEmployeeNotifications.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...filteredEmployeeNotifications].reverse().map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start gap-4 p-4 rounded-lg border ${
                        notification.read 
                          ? 'border-gray-200 bg-gray-50' 
                          : 'border-blue-200 bg-blue-50'
                      } ${getEmployeeNotificationColor(notification.type)}`}
                    >
                      <div className="mt-0.5">
                        {getEmployeeNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-1"
                              onClick={() => {
                                markEmployeeAsRead(notification.id);
                                navigateToEmployeeApproval(notification.employeeId);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => {
                                markEmployeeAsRead(notification.id);
                                navigateToEditEmployee(notification.employeeId);
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </Button>
                            
                            <Button 
                              size="sm"
                              className="flex items-center gap-1" 
                              onClick={() => {
                                markEmployeeAsRead(notification.id);
                                navigateToEmployeeApproval(notification.employeeId);
                              }}
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => markEmployeeAsRead(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {/* Debug: Show this section even for non-admin users for testing */}
        {!(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <Card className="shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Access Restricted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You need to be an Admin or Manager to view employee registration alerts.
              </p>
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">
                  Debug: User role is "{user?.role}"
                </p>
                <p className="text-sm text-gray-600">
                  Debug: Employee notifications count: {employeeNotifications.length}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;