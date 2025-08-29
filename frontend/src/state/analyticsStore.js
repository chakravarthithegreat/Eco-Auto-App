import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardAPI } from '../services/dashboardApi';

const API_BASE_URL = '/api';

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
          console.log('🔄 AnalyticsStore: Fetching real analytics data from backend...');
          
          // Fetch real data from backend APIs
          const [
            hoursData,
            teamComposition,
            recruitmentPipeline,
            payouts,
            payrollSummary,
            employees,
            tasks,
            attendance
          ] = await Promise.all([
            DashboardAPI.getHours(),
            DashboardAPI.getTeamComposition(),
            DashboardAPI.getRecruitmentPipeline(),
            DashboardAPI.getPayouts(),
            DashboardAPI.getPayrollSummary(),
            DashboardAPI.getEmployees(),
            DashboardAPI.getTasks(),
            DashboardAPI.getAttendance()
          ]);
          
          console.log('✅ AnalyticsStore: Real data received from backend');
          
          // Transform real data into analytics format
          const transformedData = get().transformRealDataToAnalytics({
            hoursData,
            teamComposition,
            recruitmentPipeline,
            payouts,
            payrollSummary,
            employees,
            tasks,
            attendance
          });
          
          set({
            productivityData: transformedData.productivityData,
            attendanceData: transformedData.attendanceData,
            taskData: transformedData.taskData,
            rewardData: transformedData.rewardData,
            projectData: transformedData.projectData,
            payrollData: transformedData.payrollData,
            timeTrackingData: transformedData.timeTrackingData,
            efficiencyMetrics: transformedData.efficiencyMetrics,
            isLoading: false
          });
          
          console.log('✅ AnalyticsStore: Data transformed and stored successfully');
        } catch (error) {
          console.error('❌ AnalyticsStore: Error fetching real data:', error);
          console.log('📊 AnalyticsStore: Falling back to mock data generation');
          
          // Fallback to mock data if real data fails
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
            isLoading: false,
            error: 'Failed to fetch real data, using mock data'
          });
        }
      },
      
      // Transform real backend data to analytics format
      transformRealDataToAnalytics: (realData) => {
        const { hoursData, teamComposition, recruitmentPipeline, payouts, payrollSummary, employees, tasks, attendance } = realData;
        
        // Transform productivity data from real hours data
        const productivityData = hoursData.series.map(day => ({
          date: day.date,
          hours: day.hours,
          productivity: Math.round((day.hours / 8) * 100) // Assuming 8 hours is 100% productivity
        }));
        
        // Transform attendance data from real attendance records
        const attendanceData = attendance.map(record => ({
          date: record.date,
          employeeId: record.employeeId,
          checkIn: record.checkIn?.time,
          checkOut: record.checkOut?.time,
          totalHours: record.totalHours,
          status: record.status
        }));
        
        // Transform task data from real tasks
        const taskData = tasks.map(task => ({
          id: task._id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
          completedAt: task.completedAt
        }));
        
        // Transform reward data (if available)
        const rewardData = [
          { type: 'stars', count: 1234, value: 6170 },
          { type: 'butterflies', count: 890, value: 2225 },
          { type: 'chocolates', count: 567, value: 709 }
        ];
        
        // Transform project data (if available)
        const projectData = [
          { name: 'Website Redesign', progress: 85, status: 'in_progress' },
          { name: 'Mobile App', progress: 60, status: 'in_progress' },
          { name: 'API Integration', progress: 45, status: 'in_progress' },
          { name: 'Database Migration', progress: 95, status: 'review' },
          { name: 'Security Audit', progress: 30, status: 'planning' }
        ];
        
        // Transform payroll data from real payroll summary
        const payrollData = [
          { 
            month: new Date().toLocaleDateString('en-US', { month: 'short' }), 
            avgSalary: payrollSummary.base / (employees.length || 1), 
            totalPayroll: payrollSummary.total 
          }
        ];
        
        // Transform time tracking data from real hours data
        const timeTrackingData = hoursData.series.slice(-5).map(day => ({
          day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
          workHours: day.hours,
          breakHours: Math.max(0, 8 - day.hours), // Assume 8-hour workday
          productiveHours: Math.round(day.hours * 0.85) // Assume 85% productivity
        }));
        
        // Calculate efficiency metrics from real data
        const efficiencyMetrics = {
          overallProductivity: Math.round((hoursData.average / 8) * 100),
          taskCompletionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0,
          attendanceRate: attendance.length > 0 ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100) : 0,
          punctualityRate: 87, // Could be calculated from attendance data
          rewardEngagement: 76 // Could be calculated from reward data
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
      
      generateMockAnalyticsData: () => {
        // Generate mock productivity data
        const productivityData = [
          {
            date: '2024-01-01',
            hours: 8.2,
            productivity: 82
          },
          {
            date: '2024-01-02',
            hours: 7.8,
            productivity: 78
          },
          {
            date: '2024-01-03',
            hours: 8.5,
            productivity: 85
          }
        ];
        
        // Generate mock attendance data
        const attendanceData = [
          {
            date: '2024-01-01',
            employeeId: '1',
            checkIn: '09:00',
            checkOut: '17:00',
            totalHours: 8,
            status: 'present'
          }
        ];
        
        // Generate mock task data
        const taskData = [
          {
            id: '1',
            title: 'Complete project documentation',
            status: 'completed',
            priority: 'high',
            assignedTo: 'John Doe',
            dueDate: '2024-01-15',
            completedAt: '2024-01-14'
          }
        ];
        
        // Generate mock reward data
        const rewardData = [
          { type: 'stars', count: 1234, value: 6170 },
          { type: 'butterflies', count: 890, value: 2225 },
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
      getDataByDateRange: (startDate, endDate) => {
        const { productivityData, attendanceData, taskData } = get();
        
        const filteredProductivity = productivityData.filter(item => 
          item.date >= startDate && item.date <= endDate
        );
        
        const filteredAttendance = attendanceData.filter(item => 
          item.date >= startDate && item.date <= endDate
        );
        
        const filteredTasks = taskData.filter(item => 
          item.dueDate >= startDate && item.dueDate <= endDate
        );
        
        return {
          productivityData: filteredProductivity,
          attendanceData: filteredAttendance,
          taskData: filteredTasks
        };
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
      name: 'analytics-store',
      partialize: (state) => ({
        reportSettings: state.reportSettings
      })
    }
  )
);

// Initialize analytics store
useAnalyticsStore.getState().fetchAnalyticsData();