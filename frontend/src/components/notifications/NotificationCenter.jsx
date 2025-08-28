import React, { useState, useEffect } from 'react';
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
  Lock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter = () => {
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
  
  const [filter, setFilter] = useState('all');
  const [showHUD, setShowHUD] = useState(true);

  // Filter notifications based on priority
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.priority === filter);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
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
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="w-full text-xs"
                  onClick={() => document.getElementById('notifications-tab').click()}
                >
                  View All Notifications
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Notification Center */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Stay updated with project events and alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            filter === 'high'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setFilter('high')}
        >
          High Priority
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            filter === 'medium'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setFilter('medium')}
        >
          Medium
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            filter === 'low'
              ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          onClick={() => setFilter('low')}
        >
          Low Priority
        </button>
      </div>

      {/* Notifications List */}
      <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      notification.read 
                        ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50' 
                        : 'border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className={`mt-0.5 ${notification.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {notification.title}
                        </h3>
                        {getPriorityBadge(notification.priority)}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {notification.timestamp}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.read ? 'Read' : 'Mark Read'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                          >
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                No notifications
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Task</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Complete Stage</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Request Review</span>
            </button>
            
            <button className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
                <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Block Stage</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;