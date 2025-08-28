// Route Configuration - Single source of truth for routes
// This implements the routing rules specified in the requirements

const routes = [
  { 
    path: "/", 
    name: "Home", 
    element: "Dashboard",
    action: "nav.dashboard"
  },
  { 
    path: "/dashboard", 
    name: "Dashboard", 
    element: "Dashboard",
    action: "nav.dashboard"
  },
  { 
    path: "/manager-dashboard", 
    name: "Manager Dashboard", 
    element: "EnhancedManagerDashboard",
    action: "nav.manager-dashboard"
  },
  { 
    path: "/admin-dashboard", 
    name: "Admin Dashboard", 
    element: "AdminDashboard",
    action: "nav.admin-dashboard"
  },
  { 
    path: "/team-member-dashboard", 
    name: "Team Member Dashboard", 
    element: "TeamMemberDashboard",
    action: "nav.team-member-dashboard"
  },
  { 
    path: "/projects", 
    name: "Projects", 
    element: "ProjectManagement",
    action: "nav.projects"
  },
  { 
    path: "/projects/:id", 
    name: "Project Detail", 
    element: "ProjectDetail",
    action: "nav.projects"
  },
  { 
    path: "/roadmaps", 
    name: "Roadmaps", 
    element: "RoadmapManager",
    action: "nav.roadmaps"
  },
  { 
    path: "/roadmaps/:id/board", 
    name: "Roadmap Board", 
    element: "RoadmapBoardPage",
    action: "nav.roadmaps"
  },
  { 
    path: "/tasks", 
    name: "Tasks", 
    element: "TaskDashboard",
    action: "nav.tasks"
  },
  { 
    path: "/notifications", 
    name: "Notifications", 
    element: "NotificationCenter",
    action: "nav.notifications"
  },
  { 
    path: "/analytics", 
    name: "Analytics", 
    element: "AnalyticsDashboard",
    action: "nav.analytics"
  },
  { 
    path: "/rewards", 
    name: "Rewards", 
    element: "RewardsPage",
    action: "nav.rewards"
  },
  { 
    path: "/pomodoro", 
    name: "Focus Timer", 
    element: "PomodoroPage",
    action: "nav.pomodoro"
  },
  { 
    path: "/tat", 
    name: "TAT Timer", 
    element: "TATTimer",
    action: "nav.tat"
  },
  { 
    path: "/approvals", 
    name: "Approvals", 
    element: "ApprovalDashboard",
    action: "nav.approvals"
  },
  { 
    path: "/employees", 
    name: "Employees", 
    element: "EmployeeManagement",
    action: "nav.employees"
  },
  { 
    path: "/payroll", 
    name: "Payroll", 
    element: "PayrollOverview",
    action: "nav.payroll"
  },
  { 
    path: "/leaves", 
    name: "Leave Management", 
    element: "LeaveManagement",
    action: "nav.leaves"
  },
  { 
    path: "/admin-settings", 
    name: "Admin Settings", 
    element: "AdminSettings",
    action: "nav.admin-settings"
  },
  { 
    path: "/talent-management", 
    name: "Talent Management", 
    element: "TalentManagement",
    action: "nav.talent-management"
  },
  { 
    path: "/help", 
    name: "Help Center", 
    element: "HelpPage",
    action: "nav.help"
  }
];

// Function to get route by path
export const getRouteByPath = (path) => {
  return routes.find(route => route.path === path);
};

// Function to get route by name
export const getRouteByName = (name) => {
  return routes.find(route => route.name === name);
};

// Function to get route by element
export const getRouteByElement = (element) => {
  return routes.find(route => route.element === element);
};

// Function to validate if a route exists
export const validateRoute = (path) => {
  return routes.some(route => route.path === path);
};

// Function to get all routes
export const getAllRoutes = () => {
  return routes;
};

// Function to get routes by action
export const getRoutesByAction = (actionId) => {
  return routes.filter(route => route.action === actionId);
};

export default routes;