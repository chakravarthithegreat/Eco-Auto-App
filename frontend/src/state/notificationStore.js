import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationStore = create(
  persist(
    (set, get) => ({
      // Notification records
      notifications: [],
      
      // Add a new notification
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: notification.id || Date.now(),
          createdAt: notification.createdAt || new Date().toISOString(),
          read: notification.read || false
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },
      
      // Mark notification as read
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        }));
      },
      
      // Mark all notifications as read
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            read: true
          }))
        }));
      },
      
      // Remove notification
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(notification => notification.id !== id)
        }));
      },
      
      // Get unread notifications count
      getUnreadCount: () => {
        return get().notifications.filter(notification => !notification.read).length;
      },
      
      // Get notifications by type
      getNotificationsByType: (type) => {
        return get().notifications.filter(notification => notification.type === type);
      },
      
      // Get approval notifications
      getApprovalNotifications: () => {
        return get().notifications.filter(notification => notification.type === 'approval');
      },
      
      // Update notification status
      updateNotificationStatus: (id, status) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === id ? { ...notification, status } : notification
          )
        }));
      }
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications
      })
    }
  )
);

export { useNotificationStore };