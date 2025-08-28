/**
 * Form utilities for smart defaults and enhanced user experience
 */

/**
 * Get smart defaults based on user behavior and preferences
 * @param {string} formType - Type of form (e.g., 'project', 'task', 'employee')
 * @param {Object} userData - User data and preferences
 * @returns {Object} Smart defaults for the form
 */
export const getSmartDefaults = (formType, userData) => {
  // In a real implementation, this would be based on actual user data
  // For now, we'll use mock data
  
  const defaults = {
    project: {
      priority: 'medium',
      assignee: userData?.recentAssignee || 'unassigned',
      deadlineBuffer: 7, // days
      notificationPreference: 'email',
      visibility: 'team'
    },
    task: {
      priority: 'medium',
      estimatedHours: 2,
      assignee: userData?.recentAssignee || 'unassigned',
      reminder: '1 day before',
      tags: ['development']
    },
    employee: {
      role: 'team_member',
      department: userData?.department || 'general',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notificationPreference: 'email'
    }
  };
  
  return defaults[formType] || {};
};

/**
 * Save user preferences for future smart defaults
 * @param {string} formType - Type of form
 * @param {Object} formData - Form data to extract preferences from
 */
export const saveUserPreferences = (formType, formData) => {
  try {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Update preferences based on form data
    if (formType === 'project') {
      if (formData.assignee) {
        preferences.recentAssignee = formData.assignee;
      }
    }
    
    if (formType === 'task') {
      if (formData.assignee) {
        preferences.recentAssignee = formData.assignee;
      }
      if (formData.estimatedHours) {
        const currentHours = preferences.averageTaskHours || 0;
        const taskCount = preferences.taskCount || 0;
        preferences.averageTaskHours = 
          (currentHours * taskCount + formData.estimatedHours) / (taskCount + 1);
        preferences.taskCount = taskCount + 1;
      }
    }
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.warn('Could not save user preferences:', error);
  }
};

/**
 * Load user preferences
 * @returns {Object} User preferences
 */
export const loadUserPreferences = () => {
  try {
    return JSON.parse(localStorage.getItem('userPreferences') || '{}');
  } catch (error) {
    console.warn('Could not load user preferences:', error);
    return {};
  }
};

/**
 * Apply smart defaults to a form
 * @param {Object} formElement - Form element to apply defaults to
 * @param {string} formType - Type of form
 * @param {Object} userData - User data
 */
export const applySmartDefaults = (formElement, formType, userData) => {
  const defaults = getSmartDefaults(formType, userData);
  
  // Apply defaults to form fields
  Object.entries(defaults).forEach(([key, value]) => {
    const field = formElement.querySelector(`[name="${key}"]`);
    if (field && !field.value) {
      field.value = value;
    }
  });
};