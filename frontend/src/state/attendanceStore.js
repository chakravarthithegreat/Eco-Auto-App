import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardAPI } from '../services/dashboardApi';

// Add the missing export that's causing the build error
export const ATTENDANCE_STATUS = {
  present: 'present',
  absent: 'absent',
  late: 'late',
  halfDay: 'half_day',
  leave: 'on_leave'
};

export const useAttendanceStore = create(
  persist(
    (set, get) => ({
      // State
      attendanceRecords: [],
      todayAttendance: null,
      isCheckedIn: false,
      currentSession: null,
      isLoading: false,
      error: null,

      // Actions
      fetchAttendanceRecords: async () => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 AttendanceStore: Fetching real attendance data from backend...');
          
          // Fetch real attendance data from backend
          const realAttendance = await DashboardAPI.getAttendance();
          
          console.log('✅ AttendanceStore: Real attendance data received from backend:', realAttendance);
          
          // Transform backend data to frontend format
          const transformedAttendance = realAttendance.map(record => ({
            id: record._id,
            userId: record.employeeId?._id || record.employeeId,
            date: record.date,
            checkInTime: record.checkIn?.time,
            checkOutTime: record.checkOut?.time,
            totalHours: record.totalHours,
            status: record.status,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            sessionNumber: record.sessionNumber || 1
          }));
          
          // Check for today's attendance
          const today = new Date().toISOString().split('T')[0];
          const currentUser = JSON.parse(localStorage.getItem('authUser') || '{"id": 1}');
          const employeeId = currentUser.id || 1;
          
          console.log('AttendanceStore: Looking for today:', today, 'employeeId:', employeeId);
          
          // Find today's sessions and get the active (uncompleted) session
          const todaySessions = transformedAttendance.filter(record => 
            record && record.date === today && record.userId === employeeId
          );
          
          console.log('AttendanceStore: Found today sessions:', todaySessions);
          
          // Find the active session (no checkOutTime)
          const activeSession = todaySessions.find(session => !session.checkOutTime);
          const todayAttendance = activeSession || todaySessions[todaySessions.length - 1]; // Use last session if no active
          
          console.log('AttendanceStore: Found active session:', activeSession, 'todayAttendance:', todayAttendance);
          
          const isCheckedIn = activeSession !== undefined;
          const currentSession = isCheckedIn ? {
            sessionId: activeSession.id,
            checkInTime: activeSession.checkInTime,
            startTime: activeSession.createdAt, // Use createdAt for accurate timing
            sessionNumber: activeSession.sessionNumber
          } : null;
          
          console.log('AttendanceStore: Setting state - isCheckedIn:', isCheckedIn, 'currentSession:', currentSession);
          
          set({ 
            attendanceRecords: transformedAttendance, 
            todayAttendance: todayAttendance || null,
            isCheckedIn,
            currentSession,
            isLoading: false 
          });
          
          console.log('✅ AttendanceStore: Real attendance data transformed and stored successfully');
        } catch (error) {
          console.error('❌ AttendanceStore: Error fetching real attendance data:', error);
          console.log('📊 AttendanceStore: Falling back to LocalStorage data');
          
          // Fallback to LocalStorage data if real data fails
          try {
            // FIXED: Add proper error handling for LocalStorage JSON parse
            let localStorageAttendance = [];
            try {
              const storedData = localStorage.getItem('attendanceRecords');
              if (storedData) {
                localStorageAttendance = JSON.parse(storedData);
                if (!Array.isArray(localStorageAttendance)) {
                  console.warn('AttendanceStore: Invalid data format in localStorage, resetting to empty array');
                  localStorageAttendance = [];
                }
              }
            } catch (parseError) {
              console.error('AttendanceStore: Error parsing localStorage data:', parseError);
              // Clear corrupted data
              localStorage.removeItem('attendanceRecords');
              localStorageAttendance = [];
            }
            
            console.log('AttendanceStore: Loading attendance records from localStorage:', localStorageAttendance);
            
            // Check for today's attendance
            const today = new Date().toISOString().split('T')[0];
            const currentUser = JSON.parse(localStorage.getItem('authUser') || '{"id": 1}');
            const employeeId = currentUser.id || 1;
            
            console.log('AttendanceStore: Looking for today:', today, 'employeeId:', employeeId);
            
            // Find today's sessions and get the active (uncompleted) session
            const todaySessions = localStorageAttendance.filter(record => 
              record && record.date === today && record.userId === employeeId
            );
            
            console.log('AttendanceStore: Found today sessions:', todaySessions);
            
            // Find the active session (no checkOutTime)
            const activeSession = todaySessions.find(session => !session.checkOutTime);
            const todayAttendance = activeSession || todaySessions[todaySessions.length - 1]; // Use last session if no active
            
            console.log('AttendanceStore: Found active session:', activeSession, 'todayAttendance:', todayAttendance);
            
            const isCheckedIn = activeSession !== undefined;
            const currentSession = isCheckedIn ? {
              sessionId: activeSession.id,
              checkInTime: activeSession.checkInTime,
              startTime: activeSession.createdAt, // Use createdAt for accurate timing
              sessionNumber: activeSession.sessionNumber
            } : null;
            
            console.log('AttendanceStore: Setting state - isCheckedIn:', isCheckedIn, 'currentSession:', currentSession);
            
            set({ 
              attendanceRecords: localStorageAttendance, 
              todayAttendance: todayAttendance || null,
              isCheckedIn,
              currentSession,
              isLoading: false,
              error: 'Failed to fetch real data, using LocalStorage data'
            });
            
            console.log('AttendanceStore: State updated successfully');
          } catch (localStorageError) {
            console.error('AttendanceStore: Error with LocalStorage fallback:', localStorageError);
            set({ 
              isLoading: false, 
              error: 'Failed to load attendance data',
              attendanceRecords: [],
              todayAttendance: null,
              isCheckedIn: false,
              currentSession: null
            });
          }
        }
      },

      checkIn: async (location = 'Main Gate', device = 'mobile') => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 AttendanceStore: Checking in via backend...');
          
          const currentUser = JSON.parse(localStorage.getItem('authUser') || '{"id": 1}');
          const employeeId = currentUser.id || 1;
          const today = new Date().toISOString().split('T')[0];
          const now = new Date();
          
          const checkInData = {
            employeeId: employeeId,
            date: today,
            checkIn: {
              time: now,
              location: location,
              method: device
            },
            status: 'present',
            sessionNumber: 1
          };
          
          // Create attendance record in backend
          const newAttendance = await DashboardAPI.createAttendance(checkInData);
          
          console.log('✅ AttendanceStore: Check-in recorded in backend:', newAttendance);
          
          // Transform and add to local state
          const transformedRecord = {
            id: newAttendance._id,
            userId: employeeId,
            date: today,
            checkInTime: now.toISOString(),
            checkOutTime: null,
            totalHours: 0,
            status: 'present',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            sessionNumber: 1
          };
          
          set(state => ({
            attendanceRecords: [...state.attendanceRecords, transformedRecord],
            todayAttendance: transformedRecord,
            isCheckedIn: true,
            currentSession: {
              sessionId: transformedRecord.id,
              checkInTime: transformedRecord.checkInTime,
              startTime: transformedRecord.createdAt,
              sessionNumber: transformedRecord.sessionNumber
            },
            isLoading: false
          }));
          
          console.log('✅ AttendanceStore: Check-in completed successfully');
        } catch (error) {
          console.error('❌ AttendanceStore: Error checking in:', error);
          set({ 
            isLoading: false,
            error: 'Failed to check in'
          });
        }
      },

      checkOut: async (location = 'Main Gate', device = 'mobile') => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 AttendanceStore: Checking out via backend...');
          
          const { currentSession, todayAttendance } = get();
          
          if (!currentSession || !todayAttendance) {
            throw new Error('No active session found');
          }
          
          const now = new Date();
          const checkInTime = new Date(currentSession.checkInTime);
          const totalHours = Math.round(((now - checkInTime) / (1000 * 60 * 60)) * 100) / 100;
          
          const checkOutData = {
            checkOut: {
              time: now,
              location: location,
              method: device
            },
            totalHours: totalHours,
            status: 'completed'
          };
          
          // Update attendance record in backend
          const updatedAttendance = await DashboardAPI.updateAttendance(todayAttendance.id, checkOutData);
          
          console.log('✅ AttendanceStore: Check-out recorded in backend:', updatedAttendance);
          
          // Update local state
          set(state => ({
            attendanceRecords: state.attendanceRecords.map(record => 
              record.id === todayAttendance.id 
                ? {
                    ...record,
                    checkOutTime: now.toISOString(),
                    totalHours: totalHours,
                    status: 'completed',
                    updatedAt: now.toISOString()
                  }
                : record
            ),
            todayAttendance: {
              ...todayAttendance,
              checkOutTime: now.toISOString(),
              totalHours: totalHours,
              status: 'completed',
              updatedAt: now.toISOString()
            },
            isCheckedIn: false,
            currentSession: null,
            isLoading: false
          }));
          
          console.log('✅ AttendanceStore: Check-out completed successfully');
        } catch (error) {
          console.error('❌ AttendanceStore: Error checking out:', error);
          set({ 
            isLoading: false,
            error: 'Failed to check out'
          });
        }
      },

      getCurrentSessionTime: () => {
        const { currentSession } = get();
        if (!currentSession) return null;
        
        const startTime = new Date(currentSession.startTime);
        const now = new Date();
        const diffMs = now - startTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        return {
          hours: diffHours,
          minutes: diffMinutes,
          seconds: diffSeconds,
          totalSeconds: Math.floor(diffMs / 1000)
        };
      },

      getTodayHours: () => {
        const { attendanceRecords } = get();
        const today = new Date().toISOString().split('T')[0];
        const currentUser = JSON.parse(localStorage.getItem('authUser') || '{"id": 1}');
        const employeeId = currentUser.id || 1;
        
        const todayRecords = attendanceRecords.filter(record => 
          record.date === today && record.userId === employeeId
        );
        
        return todayRecords.reduce((total, record) => total + (record.totalHours || 0), 0);
      },

      getWeeklyHours: () => {
        const { attendanceRecords } = get();
        const currentUser = JSON.parse(localStorage.getItem('authUser') || '{"id": 1}');
        const employeeId = currentUser.id || 1;
        
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        const weekRecords = attendanceRecords.filter(record => {
          const recordDate = new Date(record.date);
          return record.userId === employeeId && 
                 recordDate >= weekStart && 
                 recordDate <= weekEnd;
        });
        
        return weekRecords.reduce((total, record) => total + (record.totalHours || 0), 0);
      }
    }),
    {
      name: 'attendance-store',
      partialize: (state) => ({
        attendanceRecords: state.attendanceRecords
      })
    }
  )
);
