import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Bell, 
  X, 
  User, 
  Clock,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react';
import { getNotifications, markNotificationAsRead, clearNotifications } from '../../utils/notificationUtils';

const EmployeeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  // Load notifications from localStorage
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const storedNotifications = getNotifications();
    setNotifications(storedNotifications);
  };

  // Filter notifications based on type
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
    loadNotifications(); // Reload notifications
  };

  const handleClearAll = () => {
    clearNotifications();
    loadNotifications(); // Reload notifications
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'employee-registration':
        return <User className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'employee-registration':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Notifications</h1>
        <p className="text-gray-500">
          Stay updated with employee registration alerts
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
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
                variant={filter === 'employee-registration' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('employee-registration')}
              >
                Registrations
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No notifications
              </h3>
              <p className="text-gray-500">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...filteredNotifications].reverse().map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    notification.read 
                      ? 'border-gray-200 bg-gray-50' 
                      : 'border-blue-200 bg-blue-50'
                  } ${getNotificationColor(notification.type)}`}
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-6"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)}
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
    </div>
  );
};

export default EmployeeNotifications;