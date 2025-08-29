import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = '/api';

export const LEAVE_TYPES = {
  paid: 'Paid Leave',
  sick: 'Sick Leave',
  casual: 'Casual Leave',
  emergency: 'Emergency Leave',
  unpaid: 'Unpaid Leave'
};

export const LEAVE_STATUS = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  cancelled: 'cancelled'
};

export const useLeaveStore = create(
  persist(
    (set, get) => ({
      // State
      leaves: [
        {
          id: 1,
          userId: 1,
          employeeName: 'Alex Johnson',
          designation: 'Developer',
          startDate: '2024-08-15',
          endDate: '2024-08-17',
          leaveType: 'paid',
          reason: 'Family vacation',
          status: 'approved',
          appliedAt: '2024-08-01T10:30:00Z',
          remarks: 'Approved by manager',
          isAdvanceNotice: true
        },
        {
          id: 2,
          userId: 2,
          employeeName: 'Maria Garcia',
          designation: 'Designer',
          startDate: '2024-08-20',
          endDate: '2024-08-22',
          leaveType: 'sick',
          reason: 'Medical appointment',
          status: 'pending',
          appliedAt: '2024-08-10T14:15:00Z',
          remarks: '',
          isAdvanceNotice: true
        },
        {
          id: 3,
          userId: 3,
          employeeName: 'James Wilson',
          designation: 'Project Manager',
          startDate: '2024-08-25',
          endDate: '2024-08-26',
          leaveType: 'casual',
          reason: 'Personal work',
          status: 'rejected',
          appliedAt: '2024-08-05T09:45:00Z',
          remarks: 'Team meeting scheduled on 25th Aug',
          isAdvanceNotice: false
        }
      ],
      leaveBalance: {
        1: { paid: 12, sick: 7, casual: 5, used: { paid: 3, sick: 1, casual: 0 } },
        2: { paid: 12, sick: 7, casual: 5, used: { paid: 1, sick: 0, casual: 2 } },
        3: { paid: 12, sick: 7, casual: 5, used: { paid: 2, sick: 0, casual: 1 } },
        4: { paid: 12, sick: 7, casual: 5, used: { paid: 0, sick: 0, casual: 0 } },
        5: { paid: 12, sick: 7, casual: 5, used: { paid: 1, sick: 1, casual: 0 } }
      },
      leaveSettings: {
        leaveTypes: [
          { id: 'paid', name: 'Paid Leave', color: 'primary', description: 'Regular paid time off' },
          { id: 'sick', name: 'Sick Leave', color: 'success', description: 'For health-related absences' },
          { id: 'casual', name: 'Casual Leave', color: 'info', description: 'For personal reasons' },
          { id: 'emergency', name: 'Emergency Leave', color: 'danger', description: 'For urgent situations' },
          { id: 'unpaid', name: 'Unpaid Leave', color: 'default', description: 'Without pay' }
        ],
        policies: {
          paidLeavesAdvanceNotice: 2,      // 2 paid leaves if informed 7 days in advance
          advanceNoticeDays: 7,            // 7 days advance notice required
          unnotifiedLeaveRatio: 0.5,       // 50% deduction for unnotified leave
          emergencyLeaveRatio: 0.75        // 25% deduction for emergency leave
        }
      },
      leavePolicy: {
        paidLeavesAdvanceNotice: 2,      // 2 paid leaves if informed 7 days in advance
        advanceNoticeDays: 7,            // 7 days advance notice required
        unnotifiedLeaveRatio: 0.5,       // 50% deduction for unnotified leave
        emergencyLeaveRatio: 0.75        // 25% deduction for emergency leave
      },
      isLoading: false,
      error: null,

      // Actions
      fetchLeaves: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would fetch from an API
          // For now, we're using mock data
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: 'Network error' });
        }
      },

      // Apply for leave
      applyForLeave: async (leaveData) => {
        set({ isLoading: true, error: null });
        
        try {
          const { startDate, endDate, leaveType, reason, isAdvanceNotice, userId, employeeName } = leaveData;
          
          // Calculate leave days
          const start = new Date(startDate);
          const end = new Date(endDate);
          const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          
          // Calculate deduction based on policy
          const deduction = get().calculateLeaveDeduction(leaveType, daysDiff, isAdvanceNotice);
          
          const newLeave = {
            id: Date.now(), // Simple ID generation for mock data
            userId,
            employeeName,
            designation: 'Team Member', // Would come from user data in real app
            startDate,
            endDate,
            leaveType,
            reason,
            daysDiff,
            deduction,
            isAdvanceNotice,
            appliedAt: new Date().toISOString(),
            status: LEAVE_STATUS.pending,
            remarks: ''
          };

          set((state) => ({
            leaves: [...state.leaves, newLeave],
            isLoading: false
          }));
          
          return { success: true, leave: newLeave, deduction };
        } catch (error) {
          set({ isLoading: false, error: 'Failed to apply for leave' });
          return { success: false };
        }
      },

      // Calculate leave deduction based on policy
      calculateLeaveDeduction: (leaveType, days, isAdvanceNotice) => {
        const { leavePolicy } = get();
        
        if (leaveType === 'unpaid') {
          return days; // Full deduction for unpaid leave
        }
        
        if (leaveType === 'paid') {
          if (isAdvanceNotice) {
            // If advance notice given, give 2 paid leaves
            const paidDays = Math.min(days, leavePolicy.paidLeavesAdvanceNotice);
            return Math.max(0, days - paidDays);
          } else {
            // No advance notice - apply unnotified leave ratio
            return days * leavePolicy.unnotifiedLeaveRatio;
          }
        }
        
        if (leaveType === 'emergency') {
          return days * leavePolicy.emergencyLeaveRatio;
        }
        
        if (leaveType === 'sick') {
          return 0; // No deduction for sick leave (with medical certificate)
        }
        
        if (leaveType === 'casual') {
          return 0; // No deduction for casual leave
        }
        
        return 0; // Default no deduction
      },

      // Update leave status (for managers/admins)
      updateLeaveStatus: async (leaveId, status, remarks = '') => {
        set({ isLoading: true, error: null });
        
        try {
          set((state) => ({
            leaves: state.leaves.map(leave => 
              leave.id === leaveId ? { ...leave, status, remarks, updatedAt: new Date().toISOString() } : leave
            ),
            isLoading: false
          }));
          
          // If approved, update leave balance
          if (status === LEAVE_STATUS.approved) {
            const leave = get().leaves.find(l => l.id === leaveId);
            if (leave) {
              get().updateLeaveBalance(leave.userId, leave.leaveType, leave.daysDiff);
            }
          }
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: 'Failed to update leave status' });
          return { success: false };
        }
      },

      // Update leave balance
      updateLeaveBalance: (userId, leaveType, days) => {
        set((state) => {
          const newBalance = { ...state.leaveBalance };
          
          if (!newBalance[userId]) {
            newBalance[userId] = { paid: 12, sick: 7, casual: 5, used: { paid: 0, sick: 0, casual: 0 } };
          }
          
          if (leaveType === 'paid') {
            newBalance[userId].used.paid += days;
          } else if (leaveType === 'sick') {
            newBalance[userId].used.sick += days;
          } else if (leaveType === 'casual') {
            newBalance[userId].used.casual += days;
          }
          
          return { leaveBalance: newBalance };
        });
      },

      // Get pending requests
      getPendingRequests: () => {
        return get().leaves.filter(leave => leave.status === LEAVE_STATUS.pending);
      },

      // Get leave requests by employee
      getLeaveRequestsByEmployee: (userId) => {
        return get().leaves.filter(leave => leave.userId === userId);
      },

      // Get leave statistics
      getLeaveStatistics: () => {
        const { leaves } = get();
        
        const approved = leaves.filter(l => l.status === LEAVE_STATUS.approved).length;
        const pending = leaves.filter(l => l.status === LEAVE_STATUS.pending).length;
        const rejected = leaves.filter(l => l.status === LEAVE_STATUS.rejected).length;
        
        const approvedDays = leaves
          .filter(l => l.status === LEAVE_STATUS.approved)
          .reduce((sum, l) => sum + l.daysDiff, 0);
        
        const total = approved + pending + rejected;
        const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
        
        return {
          approved,
          pending,
          rejected,
          approvedDays,
          approvalRate,
          total
        };
      },

      // Calculate leave balance for an employee
      calculateLeaveBalance: (userId) => {
        const { leaveBalance } = get();
        
        const userBalance = leaveBalance[userId] || { 
          paid: 12, 
          sick: 7, 
          casual: 5, 
          used: { paid: 0, sick: 0, casual: 0 } 
        };
        
        return {
          paid: {
            total: userBalance.paid,
            used: userBalance.used.paid,
            remaining: Math.max(0, userBalance.paid - userBalance.used.paid)
          },
          sick: {
            total: userBalance.sick,
            used: userBalance.used.sick,
            remaining: Math.max(0, userBalance.sick - userBalance.used.sick)
          },
          casual: {
            total: userBalance.casual,
            used: userBalance.used.casual,
            remaining: Math.max(0, userBalance.casual - userBalance.used.casual)
          }
        };
      },

      // Add comment to leave request
      addComment: async (leaveId, comment, userId) => {
        // In a real app, this would add a comment to the leave request
        // For now, we'll just log it
        console.log(`Comment added to leave ${leaveId} by user ${userId}: ${comment}`);
        return { success: true };
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'eco-auto-leave',
      partialize: (state) => ({
        leaves: state.leaves,
        leaveBalance: state.leaveBalance,
        leaveSettings: state.leaveSettings,
        leavePolicy: state.leavePolicy
      }),
    }
  )
);

// Initialize leave store
useLeaveStore.getState().fetchLeaves();