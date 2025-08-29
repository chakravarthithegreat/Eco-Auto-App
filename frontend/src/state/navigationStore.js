import { create } from 'zustand';

export const useNavigationStore = create((set, get) => ({
  // State
  currentPage: 'dashboard',
  previousPage: null,
  breadcrumbs: [],
  
  // Actions
  setCurrentPage: (pageId) => {
    // FIXED: Add validation to prevent invalid page IDs
    if (!pageId || typeof pageId !== 'string') {
      console.error('NavigationStore: Invalid pageId provided:', pageId);
      return;
    }
    
    console.log('NavigationStore: Setting current page to', pageId);
    const currentPage = get().currentPage;
    set({
      previousPage: currentPage,
      currentPage: pageId,
    });
    console.log('NavigationStore: Current page is now', pageId);
  },

  goBack: () => {
    const { previousPage } = get();
    if (previousPage) {
      set({
        currentPage: previousPage,
        previousPage: null,
      });
    }
  },

  setBreadcrumbs: (crumbs) => {
    // FIXED: Add validation for breadcrumbs
    if (!Array.isArray(crumbs)) {
      console.error('NavigationStore: Invalid breadcrumbs provided:', crumbs);
      return;
    }
    set({ breadcrumbs: crumbs });
  },

  addBreadcrumb: (crumb) => {
    // FIXED: Add validation for breadcrumb
    if (!crumb || typeof crumb !== 'object') {
      console.error('NavigationStore: Invalid breadcrumb provided:', crumb);
      return;
    }
    set((state) => ({
      breadcrumbs: [...state.breadcrumbs, crumb],
    }));
  },

  clearBreadcrumbs: () => {
    set({ breadcrumbs: [] });
  },

  // Helper to get current page info
  getCurrentPageInfo: () => {
    const { currentPage } = get();
    const pageMap = {
      dashboard: { title: 'Dashboard', subtitle: 'Overview of your workspace' },
      'manager-dashboard': { title: 'Manager Dashboard', subtitle: 'Team performance and approval overview' },
      'admin-dashboard': { title: 'Admin Dashboard', subtitle: 'System administration and management' },
      'team-member-dashboard': { title: 'My Dashboard', subtitle: 'Personal workspace and tasks' },
      tasks: { title: 'Tasks', subtitle: 'Manage your tasks and projects' },
      attendance: { title: 'Attendance', subtitle: 'Track your work hours' },
      projects: { title: 'Projects', subtitle: 'Manage team projects' },
      analytics: { title: 'Analytics', subtitle: 'Performance insights and reports' },
      rewards: { title: 'Rewards', subtitle: 'Your achievements and rewards' },
      pomodoro: { title: 'Focus Timer', subtitle: 'Productivity timer and tracking' },
      tat: { title: 'TAT Timer', subtitle: 'Track work time and request approval' },
      approvals: { title: 'Approvals', subtitle: 'Review and approve work completion' },
      employees: { title: 'Employees', subtitle: 'Manage team members and roles' },
      payroll: { title: 'Payroll', subtitle: 'Salary and compensation management' },
      'admin-settings': { title: 'Admin Settings', subtitle: 'Manage employees, roadmaps, and policies' },
      settings: { title: 'Settings', subtitle: 'Application and account settings' },
      'simple-test': { title: 'Simple Test', subtitle: 'Test page for debugging' },
      'debug': { title: 'Debug', subtitle: 'Debug information' },
      notifications: { title: 'Notifications', subtitle: 'Stay updated with project events and alerts' },
      'employee-notifications': { title: 'Employee Notifications', subtitle: 'Stay updated with employee registration alerts' },
      roadmaps: { title: 'Roadmaps', subtitle: 'Manage project roadmaps and stages' },
      'talent-management': { title: 'Talent Management', subtitle: 'Recruitment and hiring processes' },
      leaves: { title: 'Leave Management', subtitle: 'Request and manage time off' },
      help: { title: 'Help Center', subtitle: 'Documentation and support resources' },
      'employee-signup': { title: 'Employee Registration', subtitle: 'Complete your employee registration' },
      'terms-and-conditions': { title: 'Terms & Conditions', subtitle: 'Review company policies and terms' },
      'profile-creation': { title: 'Profile Creation', subtitle: 'Complete your profile information' },
      'employee-approvals': { title: 'Employee Approvals', subtitle: 'Review and approve employee registrations' },
      'notification-sound-test': { title: 'Notification Sound Test', subtitle: 'Test notification sounds and settings' },
    };
    console.log('NavigationStore: Getting page info for', currentPage, pageMap[currentPage]);
    return pageMap[currentPage] || { title: 'Dashboard', subtitle: 'Overview of your workspace' }; // Default to dashboard
  },
}));