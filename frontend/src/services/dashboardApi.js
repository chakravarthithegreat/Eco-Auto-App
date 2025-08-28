const API_BASE = import.meta.env.VITE_API_URL || '';

// Mock data for when backend is not available
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
    const res = await fetch(fullUrl, { credentials: 'include', ...opts });
    if (!res.ok) throw new Error(`Request failed ${res.status}`);
    return res.json();
  } catch (error) {
    console.warn(`API call failed for ${url}, using mock data:`, error.message);
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
        throw error;
    }
  }
}

export const DashboardAPI = {
  getHours: () => fetchJSON('/api/dashboard/hours'),
  getTeamSplit: () => fetchJSON('/api/dashboard/team-split'),
  getTeamComposition: () => fetchJSON('/api/dashboard/team-composition'),
  getRecruitmentPipeline: () => fetchJSON('/api/hiring/pipeline'),
  getPayouts: () => fetchJSON('/api/payroll/payouts'),
  getPayrollSummary: () => fetchJSON('/api/payroll/summary'),
};


