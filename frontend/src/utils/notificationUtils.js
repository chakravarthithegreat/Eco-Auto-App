/**
 * Notification utilities for employee registration alerts
 */

// Check if browser supports notifications
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Show browser notification
export const showBrowserNotification = (title, options = {}) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }
  
  const defaultOptions = {
    body: 'New employee registration requires your attention',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    timestamp: Date.now(),
    ...options
  };
  
  try {
    new Notification(title, defaultOptions);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

// Store notification in localStorage
export const storeNotification = (notification) => {
  try {
    console.log('NotificationUtils: Getting existing notifications from localStorage');
    const notifications = JSON.parse(localStorage.getItem('employeeNotifications') || '[]');
    console.log('NotificationUtils: Current notifications:', notifications);
    
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
      // Ensure employeeId is always present for navigation purposes
      employeeId: notification.employeeId || notification.id || Date.now().toString()
    };
    
    console.log('NotificationUtils: Creating new notification:', newNotification);
    
    notifications.push(newNotification);
    console.log('NotificationUtils: Updated notifications array:', notifications);
    
    localStorage.setItem('employeeNotifications', JSON.stringify(notifications));
    console.log('NotificationUtils: Stored notifications in localStorage');
    
    console.log('NotificationUtils: All notifications after storing:', notifications);
    
    return newNotification;
  } catch (error) {
    console.error('Error storing notification:', error);
    return null;
  }
};

// Get all notifications
export const getNotifications = () => {
  try {
    console.log('NotificationUtils: Getting notifications from localStorage');
    const notifications = JSON.parse(localStorage.getItem('employeeNotifications') || '[]');
    console.log('NotificationUtils: Retrieved notifications:', notifications);
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = (id) => {
  try {
    const notifications = JSON.parse(localStorage.getItem('employeeNotifications') || '[]');
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    localStorage.setItem('employeeNotifications', JSON.stringify(updatedNotifications));
    return updatedNotifications;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return [];
  }
};

// Clear all notifications
export const clearNotifications = () => {
  try {
    localStorage.setItem('employeeNotifications', JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};