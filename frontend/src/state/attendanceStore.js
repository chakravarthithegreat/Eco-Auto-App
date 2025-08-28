import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = 'http://localhost:3001/api';

export const ATTENDANCE_STATUS = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  halfDay: 'Half Day',
  leave: 'On Leave'
};

export const useAttendanceStore = create(
  persist(
    (set, get) => ({
      // State
      attendanceRecords: [
        {
          id: 1,
          userId: 1,
          date: new Date().toISOString().split('T')[0],
          checkInTime: '08:45:00',
          checkOutTime: null,
          status: ATTENDANCE_STATUS.present,
          isLate: false,
          location: 'Office',
          device: 'Web App',
          notes: 'On time',
          hoursWorked: null,
          overtime: null,
          isHalfDay: false,
          isOvertime: false
        },
        {
          id: 2,
          userId: 1,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          checkInTime: '09:05:00',
          checkOutTime: '17:30:00',
          status: ATTENDANCE_STATUS.late,
          isLate: true,
          location: 'Office',
          device: 'Web App',
          notes: '5 minutes late',
          hoursWorked: 8.42,
          overtime: 0.42,
          isHalfDay: false,
          isOvertime: true
        },
        {
          id: 3,
          userId: 1,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          checkInTime: '08:55:00',
          checkOutTime: '16:45:00',
          status: ATTENDANCE_STATUS.present,
          isLate: false,
          location: 'Office',
          device: 'Web App',
          notes: 'On time',
          hoursWorked: 7.83,
          overtime: 0,
          isHalfDay: false,
          isOvertime: false
        }
      ],
      todayAttendance: null,
      weeklyAttendance: [],
      monthlyStats: {},
      attendancePolicy: {
        onTimeThreshold: '09:00',
        lateThreshold: '09:30',
        halfDayThreshold: '13:00',
        minimumWorkingHours: 8,
        overtimeThreshold: 8,
        gracePeriod: 5 // 5 minutes grace period
      },
      isLoading: false,
      error: null,
      isCheckedIn: true,
      currentSession: {
        checkInTime: '08:45:00',
        startTime: new Date().toISOString()
      },

      // Actions
      fetchAttendanceRecords: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/attendance`);
          
          if (response.ok) {
            const attendanceRecords = await response.json();
            // Transform backend data to match frontend format
            const transformedRecords = attendanceRecords.map(record => ({
              id: record._id || record.id,
              userId: record.employeeId,
              date: record.date,
              checkInTime: record.checkIn?.time,
              checkOutTime: record.checkOut?.time,
              status: record.status,
              isLate: record.status === 'late',
              location: record.checkIn?.location || 'Office',
              device: record.checkIn?.method || 'Web App',
              notes: record.notes || '',
              hoursWorked: record.totalHours,
              overtime: record.overtimeHours,
              isHalfDay: record.status === 'half_day',
              isOvertime: record.overtimeHours > 0
            }));
            set({ attendanceRecords: transformedRecords, isLoading: false });
          } else {
            throw new Error('Failed to fetch attendance records');
          }
        } catch (error) {
          console.error('Error fetching attendance records:', error);
          set({ isLoading: false, error: error.message });
        }
      },

      // Initialize mock attendance data
      initializeMockData: () => {
        console.log('AttendanceStore: Initializing mock data');
        const mockAttendanceRecords = [
          {
            id: 1,
            userId: 1,
            date: new Date().toISOString().split('T')[0],
            checkInTime: '08:45:00',
            checkOutTime: null,
            status: ATTENDANCE_STATUS.present,
            isLate: false,
            location: 'Office',
            device: 'Web App',
            notes: 'On time',
            hoursWorked: null,
            overtime: null,
            isHalfDay: false,
            isOvertime: false
          },
          {
            id: 2,
            userId: 1,
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            checkInTime: '09:05:00',
            checkOutTime: '17:30:00',
            status: ATTENDANCE_STATUS.late,
            isLate: true,
            location: 'Office',
            device: 'Web App',
            notes: '5 minutes late',
            hoursWorked: 8.42,
            overtime: 0.42,
            isHalfDay: false,
            isOvertime: true
          },
          {
            id: 3,
            userId: 1,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            checkInTime: '08:55:00',
            checkOutTime: '16:45:00',
            status: ATTENDANCE_STATUS.present,
            isLate: false,
            location: 'Office',
            device: 'Web App',
            notes: 'On time',
            hoursWorked: 7.83,
            overtime: 0,
            isHalfDay: false,
            isOvertime: false
          }
        ];
        
        set({ 
          attendanceRecords: mockAttendanceRecords,
          isCheckedIn: true,
          currentSession: {
            checkInTime: '08:45:00',
            startTime: new Date().toISOString()
          }
        });
        
        get().calculateStats();
        get().checkTodayAttendance();
        console.log('AttendanceStore: Mock data initialized');
      },
      
      fetchAttendanceRecords: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // For a demo, use mock data instead of real API call
          // In a real application, this would be an API call
          console.log('Using mock attendance data for demonstration');
          
          const mockAttendanceRecords = [
            {
              id: 1,
              userId: 1,
              date: new Date().toISOString().split('T')[0],
              checkInTime: '08:45:00',
              checkOutTime: null,
              status: ATTENDANCE_STATUS.present,
              isLate: false,
              location: 'Office',
              device: 'Web App',
              notes: 'On time',
              hoursWorked: null,
              overtime: null,
              isHalfDay: false,
              isOvertime: false
            },
            {
              id: 2,
              userId: 1,
              date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              checkInTime: '09:05:00',
              checkOutTime: '17:30:00',
              status: ATTENDANCE_STATUS.late,
              isLate: true,
              location: 'Office',
              device: 'Web App',
              notes: '5 minutes late',
              hoursWorked: 8.42,
              overtime: 0.42,
              isHalfDay: false,
              isOvertime: true
            },
            {
              id: 3,
              userId: 1,
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              checkInTime: '08:55:00',
              checkOutTime: '16:45:00',
              status: ATTENDANCE_STATUS.present,
              isLate: false,
              location: 'Office',
              device: 'Web App',
              notes: 'On time',
              hoursWorked: 7.83,
              overtime: 0,
              isHalfDay: false,
              isOvertime: false
            }
          ];
          
          set({ 
            attendanceRecords: mockAttendanceRecords, 
            isLoading: false,
            isCheckedIn: mockAttendanceRecords.some(record => 
              record.date === new Date().toISOString().split('T')[0] && !record.checkOutTime
            )
          });
          
          get().calculateStats();
          get().checkTodayAttendance();
          console.log('Attendance records loaded:', mockAttendanceRecords);
        } catch (error) {
          console.error('Error fetching attendance records:', error);
          set({ isLoading: false, error: 'Network error' });
        }
      },

      // Clock in
      clockIn: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const now = new Date();
          const checkInTime = now.toTimeString().slice(0, 8);
          const date = now.toISOString().split('T')[0];
          
          // Determine if late
          const { attendancePolicy } = get();
          const onTimeThreshold = new Date(`1970-01-01T${attendancePolicy.onTimeThreshold}`);
          const lateThreshold = new Date(`1970-01-01T${attendancePolicy.lateThreshold}`);
          const currentTime = new Date(`1970-01-01T${checkInTime}`);
          
          let status = ATTENDANCE_STATUS.present;
          let isLate = false;
          
          if (currentTime > lateThreshold) {
            status = ATTENDANCE_STATUS.late;
            isLate = true;
          } else if (currentTime > onTimeThreshold) {
            // Within grace period
            const gracePeriodEnd = new Date(onTimeThreshold.getTime() + (attendancePolicy.gracePeriod * 60000));
            if (currentTime > gracePeriodEnd) {
              status = ATTENDANCE_STATUS.late;
              isLate = true;
            }
          }

          const attendanceRecord = {
            userId: 1, // Current user ID
            date,
            checkInTime,
            status,
            isLate,
            location: 'Office', // Can be enhanced with geolocation
            device: 'Web App',
            notes: isLate ? `Late by ${Math.round((currentTime - onTimeThreshold) / 60000)} minutes` : 'On time'
          };

          const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(attendanceRecord),
          });

          if (response.ok) {
            const newRecord = await response.json();
            set((state) => ({
              attendanceRecords: [...state.attendanceRecords, newRecord],
              todayAttendance: newRecord,
              isCheckedIn: true,
              currentSession: {
                checkInTime,
                startTime: now.toISOString()
              },
              isLoading: false
            }));
            
            get().calculateStats();
            return { success: true, record: newRecord, isLate };
          } else {
            set({ isLoading: false, error: 'Failed to clock in' });
            return { success: false };
          }
        } catch (error) {
          set({ isLoading: false, error: 'Network error' });
          return { success: false };
        }
      },

      // Clock out
      clockOut: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { todayAttendance, currentSession, attendancePolicy } = get();
          
          if (!todayAttendance) {
            set({ isLoading: false, error: 'No check-in record found for today' });
            return { success: false };
          }

          const now = new Date();
          const checkOutTime = now.toTimeString().slice(0, 8);
          
          // Calculate working hours
          const checkInDateTime = new Date(`${todayAttendance.date}T${todayAttendance.checkInTime}`);
          const checkOutDateTime = now;
          const hoursWorked = (checkOutDateTime - checkInDateTime) / (1000 * 60 * 60);
          
          // Determine final status
          let finalStatus = todayAttendance.status;
          let isOvertime = false;
          let isHalfDay = false;
          
          if (hoursWorked < attendancePolicy.minimumWorkingHours / 2) {
            finalStatus = ATTENDANCE_STATUS.halfDay;
            isHalfDay = true;
          } else if (hoursWorked > attendancePolicy.overtimeThreshold) {
            isOvertime = true;
          }

          const updatedRecord = {
            ...todayAttendance,
            checkOutTime,
            hoursWorked: Math.round(hoursWorked * 100) / 100,
            overtime: isOvertime ? hoursWorked - attendancePolicy.minimumWorkingHours : 0,
            status: finalStatus,
            isHalfDay,
            isOvertime,
            updatedAt: now.toISOString()
          };

          const response = await fetch(`${API_BASE_URL}/attendance/${todayAttendance.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedRecord),
          });

          if (response.ok) {
            const updatedAttendance = await response.json();
            set((state) => ({
              attendanceRecords: state.attendanceRecords.map(record => 
                record.id === todayAttendance.id ? updatedAttendance : record
              ),
              todayAttendance: updatedAttendance,
              isCheckedIn: false,
              currentSession: null,
              isLoading: false
            }));
            
            // If this is a half-day, trigger task reassignment
            if (isHalfDay) {
              get().triggerTaskReassignment();
            }
            
            return { success: true, record: updatedAttendance, isHalfDay, isOvertime };
          } else {
            set({ isLoading: false, error: 'Failed to clock out' });
            return { success: false };
          }
        } catch (error) {
          set({ isLoading: false, error: 'Network error' });
          return { success: false };
        }
      },

      // Check today's attendance
      checkTodayAttendance: () => {
        const { attendanceRecords } = get();
        const today = new Date().toISOString().split('T')[0];
        
        const todayRecord = attendanceRecords.find(record => record.date === today);
        
        set({ 
          todayAttendance: todayRecord || null,
          isCheckedIn: todayRecord && !todayRecord.checkOutTime
        });

        if (todayRecord && !todayRecord.checkOutTime) {
          set({
            currentSession: {
              checkInTime: todayRecord.checkInTime,
              startTime: `${todayRecord.date}T${todayRecord.checkInTime}`
            }
          });
        }
      },

      // Calculate attendance statistics
      calculateStats: () => {
        const { attendanceRecords } = get();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Monthly stats
        const monthlyRecords = attendanceRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
        });

        const monthlyStats = {
          totalDays: monthlyRecords.length,
          presentDays: monthlyRecords.filter(r => r.status === ATTENDANCE_STATUS.present).length,
          lateDays: monthlyRecords.filter(r => r.isLate).length,
          halfDays: monthlyRecords.filter(r => r.isHalfDay).length,
          overtimeDays: monthlyRecords.filter(r => r.isOvertime).length,
          totalHours: monthlyRecords.reduce((sum, r) => sum + (r.hoursWorked || 0), 0),
          totalOvertime: monthlyRecords.reduce((sum, r) => sum + (r.overtime || 0), 0),
          attendancePercentage: monthlyRecords.length > 0 ? 
            (monthlyRecords.filter(r => r.status !== ATTENDANCE_STATUS.absent).length / monthlyRecords.length) * 100 : 0
        };

        // Weekly stats (last 7 days)
        const weekAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
        const weeklyRecords = attendanceRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= weekAgo && recordDate <= currentDate;
        });

        set({ 
          monthlyStats,
          weeklyAttendance: weeklyRecords
        });
      },

      // Get current session time
      getCurrentSessionTime: () => {
        const { currentSession } = get();
        
        if (!currentSession) return null;
        
        const startTime = new Date(currentSession.startTime);
        const now = new Date();
        const elapsed = now - startTime;
        
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        
        return {
          hours,
          minutes,
          totalMinutes: Math.floor(elapsed / (1000 * 60)),
          formattedTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        };
      },

      // Get attendance summary
      getAttendanceSummary: () => {
        const { monthlyStats, attendanceRecords } = get();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Get working days in current month (excluding weekends)
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const workingDays = Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(currentYear, currentMonth, i + 1);
          return date.getDay() !== 0 && date.getDay() !== 6; // Exclude Sunday (0) and Saturday (6)
        }).filter(Boolean).length;

        const presentPercentage = workingDays > 0 ? (monthlyStats.presentDays / workingDays) * 100 : 0;
        
        return {
          ...monthlyStats,
          workingDays,
          presentPercentage: Math.round(presentPercentage * 100) / 100,
          avgHoursPerDay: monthlyStats.totalDays > 0 ? 
            Math.round((monthlyStats.totalHours / monthlyStats.totalDays) * 100) / 100 : 0
        };
      },

      // Mark leave
      markLeave: async (date, leaveType) => {
        set({ isLoading: true, error: null });
        
        try {
          const leaveRecord = {
            userId: 1,
            date,
            status: ATTENDANCE_STATUS.leave,
            leaveType,
            notes: `${leaveType} leave`,
            hoursWorked: 0
          };

          const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(leaveRecord),
          });

          if (response.ok) {
            const newRecord = await response.json();
            set((state) => ({
              attendanceRecords: [...state.attendanceRecords, newRecord],
              isLoading: false
            }));
            
            // Trigger task reassignment for unavailable employees
            get().triggerTaskReassignment();
            
            return { success: true, record: newRecord };
          } else {
            set({ isLoading: false, error: 'Failed to mark leave' });
            return { success: false };
          }
        } catch (error) {
          set({ isLoading: false, error: 'Network error' });
          return { success: false };
        }
      },
      
      // Trigger task reassignment when employee availability changes
      triggerTaskReassignment: async () => {
        try {
          // Import the task store dynamically to avoid circular dependencies
          const { useTaskStore } = await import('./taskStore');
          const { usePayrollStore } = await import('./payrollStore');
          const { useTaskGeneratorStore } = await import('./taskGeneratorStore');
          
          const taskStore = useTaskStore.getState();
          const payrollStore = usePayrollStore.getState();
          
          // Get current attendance records and employees
          const { attendanceRecords } = get();
          const { employees } = payrollStore;
          
          // Reassign tasks from unavailable employees
          await taskStore.reassignTasksFromUnavailableEmployees(attendanceRecords, employees);
        } catch (error) {
          console.error('Failed to trigger task reassignment:', error);
        }
      },
      
      // Update attendance policy
      updateAttendancePolicy: (newPolicy) => {
        set((state) => ({
          attendancePolicy: { ...state.attendancePolicy, ...newPolicy }
        }));
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'eco-auto-attendance',
      partialize: (state) => ({
        attendanceRecords: state.attendanceRecords,
        attendancePolicy: state.attendancePolicy,
        monthlyStats: state.monthlyStats
      }),
    }
  )
);

// Initialize attendance store
useAttendanceStore.getState().calculateStats();
useAttendanceStore.getState().checkTodayAttendance();