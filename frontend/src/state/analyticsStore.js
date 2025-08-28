import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = 'http://localhost:3001/api';

export const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      // State
      productivityData: [],
      attendanceData: [],
      taskData: [],
      rewardData: [],
      projectData: [],
      payrollData: [],
      isLoading: false,
      error: null,
      
      // Time tracking data
      timeTrackingData: [],
      efficiencyMetrics: {},
      
      // Report settings
      reportSettings: {
        dateRange: 'last30days',
        department: 'all',
        employee: 'all'
      },

      // Actions
      fetchAnalyticsData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would fetch from multiple APIs
          // For now, we'll generate mock data
          const data = get().generateMockAnalyticsData();
          
          set({
            productivityData: data.productivityData,
            attendanceData: data.attendanceData,
            taskData: data.taskData,
            rewardData: data.rewardData,
            projectData: data.projectData,
            payrollData: data.payrollData,
            timeTrackingData: data.timeTrackingData,
            efficiencyMetrics: data.efficiencyMetrics,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false, error: 'Failed to fetch analytics data' });
        }
      },
      
      generateMockAnalyticsData: () => {
        // Generate mock productivity data
        const productivityData = [
          { date: '2024-07-01', productivity: 75, tasksCompleted: 12 },
          { date: '2024-07-02', productivity: 82, tasksCompleted: 15 },
          { date: '2024-07-03', productivity: 68, tasksCompleted: 9 },
          { date: '2024-07-04', productivity: 90, tasksCompleted: 18 },
          { date: '2024-07-05', productivity: 77, tasksCompleted: 14 },
          { date: '2024-07-06', productivity: 85, tasksCompleted: 16 },
          { date: '2024-07-07', productivity: 72, tasksCompleted: 11 }
        ];
        
        // Generate mock attendance data
        const attendanceData = [
          { date: '2024-07-01', present: 22, late: 3, absent: 1 },
          { date: '2024-07-02', present: 24, late: 1, absent: 1 },
          { date: '2024-07-03', present: 20, late: 4, absent: 2 },
          { date: '2024-07-04', present: 25, late: 0, absent: 1 },
          { date: '2024-07-05', present: 23, late: 2, absent: 0 },
          { date: '2024-07-06', present: 18, late: 3, absent: 1 },
          { date: '2024-07-07', present: 21, late: 2, absent: 2 }
        ];
        
        // Generate mock task data
        const taskData = [
          { category: 'Development', count: 45, completed: 38 },
          { category: 'Design', count: 28, completed: 25 },
          { category: 'Testing', count: 32, completed: 29 },
          { category: 'Documentation', count: 15, completed: 12 },
          { category: 'Meetings', count: 22, completed: 20 }
        ];
        
        // Generate mock reward data
        const rewardData = [
          { type: 'stars', count: 1247, value: 6235 },
          { type: 'butterflies', count: 892, value: 2230 },
          { type: 'chocolates', count: 567, value: 709 }
        ];
        
        // Generate mock project data
        const projectData = [
          { name: 'Website Redesign', progress: 85, status: 'in_progress' },
          { name: 'Mobile App', progress: 60, status: 'in_progress' },
          { name: 'API Integration', progress: 45, status: 'in_progress' },
          { name: 'Database Migration', progress: 95, status: 'review' },
          { name: 'Security Audit', progress: 30, status: 'planning' }
        ];
        
        // Generate mock payroll data
        const payrollData = [
          { month: 'Jan', avgSalary: 52000, totalPayroll: 2600000 },
          { month: 'Feb', avgSalary: 53500, totalPayroll: 2675000 },
          { month: 'Mar', avgSalary: 54200, totalPayroll: 2710000 },
          { month: 'Apr', avgSalary: 55100, totalPayroll: 2755000 },
          { month: 'May', avgSalary: 56300, totalPayroll: 2815000 },
          { month: 'Jun', avgSalary: 57200, totalPayroll: 2860000 }
        ];
        
        // Generate mock time tracking data
        const timeTrackingData = [
          { day: 'Mon', workHours: 8.5, breakHours: 1.5, productiveHours: 7.2 },
          { day: 'Tue', workHours: 9.0, breakHours: 1.0, productiveHours: 8.1 },
          { day: 'Wed', workHours: 7.5, breakHours: 2.0, productiveHours: 6.2 },
          { day: 'Thu', workHours: 8.0, breakHours: 1.5, productiveHours: 7.0 },
          { day: 'Fri', workHours: 8.2, breakHours: 1.3, productiveHours: 7.3 }
        ];
        
        // Generate efficiency metrics
        const efficiencyMetrics = {
          overallProductivity: 78,
          taskCompletionRate: 84,
          attendanceRate: 92,
          punctualityRate: 87,
          rewardEngagement: 76
        };
        
        return {
          productivityData,
          attendanceData,
          taskData,
          rewardData,
          projectData,
          payrollData,
          timeTrackingData,
          efficiencyMetrics
        };
      },
      
      // Get data for specific date range
      getDataByDateRange: (data, startDate, endDate) => {
        return data.filter(item => {
          const itemDate = new Date(item.date || item.month);
          return itemDate >= startDate && itemDate <= endDate;
        });
      },
      
      // Update report settings
      updateReportSettings: (settings) => {
        set((state) => ({
          reportSettings: { ...state.reportSettings, ...settings }
        }));
      },
      
      // Export report data
      exportReport: (format = 'csv') => {
        const { productivityData, attendanceData, taskData } = get();
        // In a real app, this would generate and download a report
        console.log('Exporting report in', format, 'format');
        return { productivityData, attendanceData, taskData };
      },
      
      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'eco-auto-analytics',
      partialize: (state) => ({
        reportSettings: state.reportSettings
      }),
    }
  )
);

// Initialize analytics store
useAnalyticsStore.getState().fetchAnalyticsData();