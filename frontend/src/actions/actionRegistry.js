// Action Registry - Centralized action management system
// This implements the action wiring contracts specified in the requirements

// Action Schema:
// {
//   id: string,
//   label: string,
//   type: enum('route','modal','mutation'),
//   target: string,
//   payload: any,
//   fallback: { route: string, toast: string },
//   guards: ['auth:role', 'featureFlag?:string']
// }

const actionRegistry = {
  // Navigation Actions
  'nav.dashboard': {
    id: 'nav.dashboard',
    label: 'Dashboard',
    type: 'route',
    target: '/dashboard',
    fallback: { route: '/dashboard', toast: 'Dashboard temporarily unavailable' },
    guards: []
  },
  
  'nav.manager-dashboard': {
    id: 'nav.manager-dashboard',
    label: 'Manager Dashboard',
    type: 'route',
    target: '/manager-dashboard',
    fallback: { route: '/dashboard', toast: 'Manager Dashboard temporarily unavailable' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'nav.admin-dashboard': {
    id: 'nav.admin-dashboard',
    label: 'Admin Dashboard',
    type: 'route',
    target: '/admin-dashboard',
    fallback: { route: '/dashboard', toast: 'Admin Dashboard temporarily unavailable' },
    guards: ['auth:ADMIN']
  },
  
  'nav.team-member-dashboard': {
    id: 'nav.team-member-dashboard',
    label: 'My Dashboard',
    type: 'route',
    target: '/team-member-dashboard',
    fallback: { route: '/dashboard', toast: 'Dashboard temporarily unavailable' },
    guards: ['auth:TEAM_MEMBER']
  },
  
  'nav.tasks': {
    id: 'nav.tasks',
    label: 'Tasks',
    type: 'route',
    target: '/tasks',
    fallback: { route: '/dashboard', toast: 'Tasks temporarily unavailable' },
    guards: []
  },
  
  'nav.projects': {
    id: 'nav.projects',
    label: 'Projects',
    type: 'route',
    target: '/projects',
    fallback: { route: '/dashboard', toast: 'Projects temporarily unavailable' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'nav.roadmaps': {
    id: 'nav.roadmaps',
    label: 'Roadmaps',
    type: 'route',
    target: '/roadmaps',
    fallback: { route: '/dashboard', toast: 'Roadmaps temporarily unavailable' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'nav.notifications': {
    id: 'nav.notifications',
    label: 'Notifications',
    type: 'route',
    target: '/notifications',
    fallback: { route: '/dashboard', toast: 'Notifications temporarily unavailable' },
    guards: []
  },
  
  'nav.rewards': {
    id: 'nav.rewards',
    label: 'Rewards',
    type: 'route',
    target: '/rewards',
    fallback: { route: '/dashboard', toast: 'Rewards temporarily unavailable' },
    guards: []
  },
  
  'nav.pomodoro': {
    id: 'nav.pomodoro',
    label: 'Focus Timer',
    type: 'route',
    target: '/pomodoro',
    fallback: { route: '/dashboard', toast: 'Focus Timer temporarily unavailable' },
    guards: []
  },
  
  // Task Actions
  'task.start': {
    id: 'task.start',
    label: 'Start Task',
    type: 'mutation',
    target: 'startTask',
    payload: { taskId: null },
    fallback: { route: '/tasks', toast: 'Unable to start task' },
    guards: []
  },
  
  'task.complete': {
    id: 'task.complete',
    label: 'Complete Task',
    type: 'mutation',
    target: 'completeTask',
    payload: { taskId: null },
    fallback: { route: '/tasks', toast: 'Unable to complete task' },
    guards: []
  },
  
  'task.assign': {
    id: 'task.assign',
    label: 'Assign Task',
    type: 'mutation',
    target: 'assignTask',
    payload: { taskId: null, userId: null },
    fallback: { route: '/tasks', toast: 'Unable to assign task' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'task.block': {
    id: 'task.block',
    label: 'Block Task',
    type: 'mutation',
    target: 'blockTask',
    payload: { taskId: null, reason: null },
    fallback: { route: '/tasks', toast: 'Unable to block task' },
    guards: []
  },
  
  // Stage Actions
  'stage.start': {
    id: 'stage.start',
    label: 'Start Stage',
    type: 'mutation',
    target: 'startStage',
    payload: { stageId: null },
    fallback: { route: '/roadmaps', toast: 'Unable to start stage' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'stage.complete': {
    id: 'stage.complete',
    label: 'Complete Stage',
    type: 'mutation',
    target: 'completeStage',
    payload: { stageId: null },
    fallback: { route: '/roadmaps', toast: 'Unable to complete stage' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'stage.assign': {
    id: 'stage.assign',
    label: 'Assign Stage',
    type: 'mutation',
    target: 'assignStage',
    payload: { stageId: null, userId: null },
    fallback: { route: '/roadmaps', toast: 'Unable to assign stage' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'stage.block': {
    id: 'stage.block',
    label: 'Block Stage',
    type: 'mutation',
    target: 'blockStage',
    payload: { stageId: null, reason: null },
    fallback: { route: '/roadmaps', toast: 'Unable to block stage' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  // Bulk Actions
  'bulk.nudge': {
    id: 'bulk.nudge',
    label: 'Nudge Selected',
    type: 'mutation',
    target: 'nudgeStages',
    payload: { stageIds: [] },
    fallback: { route: '/manager-dashboard', toast: 'Unable to nudge stages' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'bulk.escalate': {
    id: 'bulk.escalate',
    label: 'Escalate Selected',
    type: 'mutation',
    target: 'escalateStages',
    payload: { stageIds: [] },
    fallback: { route: '/manager-dashboard', toast: 'Unable to escalate stages' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  'bulk.assign': {
    id: 'bulk.assign',
    label: 'Assign Selected',
    type: 'mutation',
    target: 'assignStages',
    payload: { stageIds: [], userId: null },
    fallback: { route: '/manager-dashboard', toast: 'Unable to assign stages' },
    guards: ['auth:MANAGER', 'auth:ADMIN']
  },
  
  // Admin Actions
  'admin.add-user': {
    id: 'admin.add-user',
    label: 'Add User',
    type: 'modal',
    target: 'AddUserModal',
    payload: {},
    fallback: { route: '/admin-settings', toast: 'Unable to add user' },
    guards: ['auth:ADMIN']
  },
  
  'admin.set-theme': {
    id: 'admin.set-theme',
    label: 'Set Theme',
    type: 'mutation',
    target: 'setTheme',
    payload: { theme: null },
    fallback: { route: '/admin-dashboard', toast: 'Unable to set theme' },
    guards: ['auth:ADMIN']
  },
  
  // Team Member Actions
  'member.pomodoro-start': {
    id: 'member.pomodoro-start',
    label: 'Start Focus Session',
    type: 'mutation',
    target: 'startPomodoro',
    payload: {},
    fallback: { route: '/pomodoro', toast: 'Unable to start focus session' },
    guards: []
  },
  
  'member.pomodoro-pause': {
    id: 'member.pomodoro-pause',
    label: 'Pause Focus Session',
    type: 'mutation',
    target: 'pausePomodoro',
    payload: {},
    fallback: { route: '/pomodoro', toast: 'Unable to pause focus session' },
    guards: []
  },
  
  // Notification Actions
  'notification.mark-read': {
    id: 'notification.mark-read',
    label: 'Mark as Read',
    type: 'mutation',
    target: 'markNotificationRead',
    payload: { notificationId: null },
    fallback: { route: '/notifications', toast: 'Unable to mark notification as read' },
    guards: []
  },
  
  'notification.mark-all-read': {
    id: 'notification.mark-all-read',
    label: 'Mark All as Read',
    type: 'mutation',
    target: 'markAllNotificationsRead',
    payload: {},
    fallback: { route: '/notifications', toast: 'Unable to mark all notifications as read' },
    guards: []
  }
};

// Function to get an action by ID
export const getAction = (actionId) => {
  return actionRegistry[actionId];
};

// Function to validate if an action exists
export const validateAction = (actionId) => {
  return actionRegistry.hasOwnProperty(actionId);
};

// Function to get all actions
export const getAllActions = () => {
  return Object.values(actionRegistry);
};

// Function to execute an action (stub implementation)
export const executeAction = async (actionId, payload = {}) => {
  const action = getAction(actionId);
  
  if (!action) {
    console.warn(`Action ${actionId} not found in registry`);
    return { success: false, error: 'Action not found' };
  }
  
  try {
    // In a real implementation, this would execute the actual action
    console.log(`Executing action: ${actionId}`, payload);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { success: true, action, payload };
  } catch (error) {
    console.error(`Error executing action ${actionId}:`, error);
    return { success: false, error: error.message, action, payload };
  }
};

export default actionRegistry;