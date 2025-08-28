import { create } from 'zustand';

export const useNavigationStore = create((set, get) => ({
  // State
  currentPage: 'dashboard',
  previousPage: null,
  breadcrumbs: [],
  
  // Actions
  setCurrentPage: (pageId) => {
    console.log('NavigationStore: Setting current page to', pageId);
    const currentPage = get().currentPage;
    set({
      previousPage: currentPage,
      currentPage: pageId,
    });
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
    set({ breadcrumbs: crumbs });
  },

  addBreadcrumb: (crumb) => {
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
      roadmaps: { title: 'Roadmaps', subtitle: 'Manage project roadmaps and stages' },
      'talent-management': { title: 'Talent Management', subtitle: 'Recruitment and hiring processes' },
      leaves: { title: 'Leave Management', subtitle: 'Request and manage time off' },
      help: { title: 'Help Center', subtitle: 'Documentation and support resources' },
    };
    console.log('NavigationStore: Getting page info for', currentPage, pageMap[currentPage]);
    return pageMap[currentPage] || { title: 'Dashboard', subtitle: 'Overview of your workspace' }; // Default to dashboard
  },
}));