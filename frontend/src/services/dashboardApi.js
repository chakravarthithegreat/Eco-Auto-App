// API base URL for Netlify Functions
const API_BASE = '/.netlify/functions/api';

// Mock data for when backend is not available (fallback only)
const mockData = {
  hours: {
    average: 8.5,
    deltaPct: 2.1,
    series: Array.from({ length: 28 }, (_, i) => ({
      date: new Date(Date.now() - (27 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hours: 7.5 + Math.random() * 3
    }))
  },
  teamSplit: {
    onsite: { pct: 65, deltaPct: 1.2 },
    remote: { pct: 35, deltaPct: -1.2 }
  },
  teamComposition: [
    { role: 'ADMIN', count: 3 },
    { role: 'MANAGER', count: 8 },
    { role: 'TEAM_MEMBER', count: 13 }
  ],
  recruitmentPipeline: [
    { stage: 'Applied', matched: 45, notMatched: 12 },
    { stage: 'Interview', matched: 18, notMatched: 8 },
    { stage: 'Offer', matched: 5, notMatched: 1 }
  ],
  payouts: [
    { id: 1, name: 'John Doe', amount: 4500, date: 'Today', status: 'Done' },
    { id: 2, name: 'Jane Smith', amount: 5200, date: 'Today', status: 'Done' },
    { id: 3, name: 'Mike Johnson', amount: 3800, date: 'Pending', status: 'Waiting' }
  ],
  payrollSummary: {
    base: 125000,
    performance: 25000,
    gift: 5000,
    total: 155000
  }
};

export async function fetchJSON(url, opts = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  
  try {
    console.log(`🔄 Fetching data from: ${fullUrl}`);
    const res = await fetch(fullUrl, { 
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers
      },
      ...opts 
    });
    
    if (!res.ok) {
      throw new Error(`Request failed ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log(`✅ Data received from: ${fullUrl}`, data);
    return data;
  } catch (error) {
    console.warn(`❌ API call failed for ${url}, using mock data:`, error.message);
    console.log(`📊 Falling back to mock data for: ${url}`);
    
    // Return mock data based on the endpoint
    const endpoint = url.split('/').pop();
    switch (endpoint) {
      case 'hours':
        return mockData.hours;
      case 'team-split':
        return mockData.teamSplit;
      case 'team-composition':
        return mockData.teamComposition;
      case 'pipeline':
        return mockData.recruitmentPipeline;
      case 'payouts':
        return mockData.payouts;
      case 'summary':
        return mockData.payrollSummary;
      default:
        console.error(`❌ No mock data available for endpoint: ${endpoint}`);
        throw error;
    }
  }
}

export const DashboardAPI = {
  // Dashboard data endpoints
  getHours: () => fetchJSON('/dashboard/hours'),
  getTeamSplit: () => fetchJSON('/dashboard/team-split'),
  getTeamComposition: () => fetchJSON('/dashboard/team-composition'),
  getRecruitmentPipeline: () => fetchJSON('/hiring/pipeline'),
  getPayouts: () => fetchJSON('/payroll/payouts'),
  getPayrollSummary: () => fetchJSON('/payroll/summary'),
  
  // Employee endpoints
  getEmployees: () => fetchJSON('/employees'),
  getEmployee: (id) => fetchJSON(`/employees/${id}`),
  
  // Task endpoints
  getTasks: () => fetchJSON('/tasks'),
  createTask: (taskData) => fetchJSON('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  }),
  updateTask: (taskId, updates) => fetchJSON(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),
  deleteTask: (taskId) => fetchJSON(`/tasks/${taskId}`, {
    method: 'DELETE'
  }),
  
  // Attendance endpoints
  getAttendance: () => fetchJSON('/attendance'),
  createAttendance: (attendanceData) => fetchJSON('/attendance', {
    method: 'POST',
    body: JSON.stringify(attendanceData)
  }),
  updateAttendance: (attendanceId, updates) => fetchJSON(`/attendance/${attendanceId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),
  
  // Project endpoints
  getProjects: () => fetchJSON('/projects'),
  createProject: (projectData) => fetchJSON('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData)
  }),
  
  // Analytics endpoints
  getAnalytics: () => fetchJSON('/analytics/dashboard'),
  
  // Authentication endpoints
  login: (credentials) => fetchJSON('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  logout: () => fetchJSON('/auth/logout', {
    method: 'POST'
  }),
  
  // Health check
  healthCheck: () => fetchJSON('/health'),
  
  // Data seeding (development only)
  seedData: () => fetchJSON('/seed', {
    method: 'POST'
  })
};


