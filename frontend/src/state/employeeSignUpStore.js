import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storeNotification, showBrowserNotification, requestNotificationPermission } from '../utils/notificationUtils';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Default terms and conditions
const defaultTerms = [{
  title: 'Employee Terms and Conditions',
  content: `
    1. All employees must comply with company policies and procedures.
    2. Confidentiality of company information is mandatory.
    3. Regular attendance and punctuality are required.
    4. Professional conduct is expected at all times.
    5. Compliance with Indian labor laws is mandatory.
  `,
  lawReference: {
    lawName: 'Industrial Disputes Act, 1947',
    lawNumber: 'Act No. 14 of 1947'
  }
}];

export const useEmployeeSignUpStore = create(
  persist(
    (set, get) => ({
      // State
      currentSignUp: null,
      signUpData: null,
      termsAndConditions: [],
      pendingApprovals: [],
      isLoading: false,
      error: null,

      // Actions
      fetchTermsAndConditions: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with localStorage
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Check if terms exist in localStorage
          const storedTerms = localStorage.getItem('termsAndConditions');
          
          if (storedTerms) {
            set({ 
              termsAndConditions: JSON.parse(storedTerms),
              isLoading: false 
            });
          } else {
            // Use default terms
            set({ 
              termsAndConditions: defaultTerms,
              isLoading: false 
            });
            
            // Store default terms in localStorage
            localStorage.setItem('termsAndConditions', JSON.stringify(defaultTerms));
          }
        } catch (error) {
          console.error('Error fetching terms and conditions:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch terms and conditions'
          });
        }
      },

      submitEmployeeSignUp: async (signUpData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with localStorage
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Create record with ID
          const newSignUp = {
            _id: generateId(),
            ...signUpData,
            status: 'pending',
            profileStatus: 'pending',
            createdAt: new Date().toISOString()
          };
          
          // Store in localStorage
          const existingSignUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
          existingSignUps.push(newSignUp);
          localStorage.setItem('employeeSignUps', JSON.stringify(existingSignUps));
          
          console.log('EmployeeSignUpStore: Stored sign-up in localStorage:', newSignUp);
          
          // Send notification to admins/managers
          const notification = {
            type: 'employee-registration',
            title: 'New Employee Registration',
            message: `New employee registration submitted by ${newSignUp.fullName}`,
            employeeId: newSignUp._id,
            employeeName: newSignUp.fullName
          };
          
          console.log('EmployeeSignUpStore: Creating notification:', notification);
          
          // Store notification in localStorage
          const storedNotification = storeNotification(notification);
          console.log('EmployeeSignUpStore: Stored notification:', storedNotification);
          
          // Try to show browser notification
          showBrowserNotification('New Employee Registration', {
            body: `New employee registration submitted by ${newSignUp.fullName}`
          });
          
          set({ 
            currentSignUp: newSignUp,
            signUpData: signUpData,
            isLoading: false 
          });
          return { success: true, data: newSignUp };
        } catch (error) {
          console.error('Error submitting employee sign-up:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to submit employee sign-up'
          });
          return { success: false, error: error.message || 'Failed to submit employee sign-up' };
        }
      },

      updateProfileStatus: async (signUpId, profileStatus) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with localStorage
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Get current signups
          const existingSignUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
          const signUpIndex = existingSignUps.findIndex(signup => signup._id === signUpId);
          
          if (signUpIndex === -1) {
            throw new Error('Sign up not found');
          }
          
          // Update the status
          existingSignUps[signUpIndex].status = profileStatus;
          existingSignUps[signUpIndex].profileStatus = profileStatus;
          existingSignUps[signUpIndex].updatedAt = new Date().toISOString();
          
          // Save back to localStorage
          localStorage.setItem('employeeSignUps', JSON.stringify(existingSignUps));
          
          const updatedSignUp = existingSignUps[signUpIndex];
          
          set({ 
            currentSignUp: updatedSignUp,
            isLoading: false 
          });
          return { success: true, data: updatedSignUp };
        } catch (error) {
          console.error('Error updating profile status:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to update profile status'
          });
          return { success: false, error: error.message || 'Failed to update profile status' };
        }
      },

      fetchPendingApprovals: async (token) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with localStorage
          await new Promise(resolve => setTimeout(resolve, 400));
          
          // Get all signups
          const existingSignUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
          
          // Filter for pending ones (employees who have submitted registration but not yet approved)
          // In the registration flow, employees have profileStatus: 'pending'
          // After profile creation, they have profileStatus: 'profile_created'
          // For approvals, we want to see those with profileStatus: 'profile_created'
          const pendingApprovals = existingSignUps.filter(signup => 
            signup.profileStatus === 'profile_created' || 
            signup.profileStatus === 'pending'
          );
          
          set({ 
            pendingApprovals: pendingApprovals,
            isLoading: false 
          });
          return { success: true, data: pendingApprovals };
        } catch (error) {
          console.error('Error fetching pending approvals:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch pending approvals'
          });
          return { success: false, error: error.message || 'Failed to fetch pending approvals' };
        }
      },

      approveEmployee: async (signUpId, approvalData, token) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with localStorage
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get current signups
          const existingSignUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
          const signUpIndex = existingSignUps.findIndex(signup => signup._id === signUpId);
          
          if (signUpIndex === -1) {
            throw new Error('Sign up not found');
          }
          
          const signUpData = existingSignUps[signUpIndex];
          
          // Create Employee record
          const employeeRecord = {
            _id: generateId(),
            name: signUpData.fullName,
            email: signUpData.email,
            phoneNumber: signUpData.phoneNumber,
            department: signUpData.jobTitle.includes('Manager') ? 'Management' : 'Production',
            position: signUpData.jobTitle,
            hireDate: signUpData.joiningDate || new Date().toISOString(),
            salary: 45000, // Default salary, can be adjusted
            address: signUpData.address,
            emergencyContact: signUpData.emergencyContact,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Create EmployeeAuth record
          const authRecord = {
            _id: generateId(),
            employeeId: employeeRecord._id,
            username: signUpData.username,
            password: signUpData.password, // In production, this should be hashed
            email: signUpData.email,
            role: signUpData.jobTitle.includes('Manager') ? 'manager' : 'employee',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Store Employee record
          const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
          existingEmployees.push(employeeRecord);
          localStorage.setItem('employees', JSON.stringify(existingEmployees));
          
          // Store EmployeeAuth record
          const existingAuthRecords = JSON.parse(localStorage.getItem('employeeAuths') || '[]');
          existingAuthRecords.push(authRecord);
          localStorage.setItem('employeeAuths', JSON.stringify(existingAuthRecords));
          
          // Update the signup status and add approval data
          existingSignUps[signUpIndex] = {
            ...existingSignUps[signUpIndex],
            status: 'approved',
            profileStatus: 'approved',
            approvedAt: new Date().toISOString(),
            approvedBy: approvalData.approvedBy || 'admin',
            employeeId: employeeRecord._id, // Link to created employee
            authId: authRecord._id, // Link to created auth record
            ...approvalData
          };
          
          // Save back to localStorage
          localStorage.setItem('employeeSignUps', JSON.stringify(existingSignUps));
          
          // Update the pending approvals list
          const currentApprovals = get().pendingApprovals;
          const updatedApprovals = currentApprovals.filter(approval => approval._id !== signUpId);
          
          set({ 
            pendingApprovals: updatedApprovals,
            isLoading: false 
          });
          
          console.log('EmployeeSignUpStore: Created employee and auth records:', {
            employee: employeeRecord,
            auth: authRecord
          });
          
          return { 
            success: true, 
            data: existingSignUps[signUpIndex],
            employee: employeeRecord,
            auth: authRecord
          };
        } catch (error) {
          console.error('Error approving employee:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to approve employee'
          });
          return { success: false, error: error.message || 'Failed to approve employee' };
        }
      },

      // New function to hold an employee registration
      holdEmployee: async (signUpId, holdData, token) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with localStorage
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get current signups
          const existingSignUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
          const signUpIndex = existingSignUps.findIndex(signup => signup._id === signUpId);
          
          if (signUpIndex === -1) {
            throw new Error('Sign up not found');
          }
          
          // Update the status and add hold data
          existingSignUps[signUpIndex] = {
            ...existingSignUps[signUpIndex],
            status: 'on-hold',
            profileStatus: 'on-hold',
            heldAt: new Date().toISOString(),
            heldBy: holdData.heldBy || 'admin',
            holdReason: holdData.holdReason || '',
            ...holdData
          };
          
          // Save back to localStorage
          localStorage.setItem('employeeSignUps', JSON.stringify(existingSignUps));
          
          // Update the pending approvals list
          const currentApprovals = get().pendingApprovals;
          const updatedApprovals = currentApprovals.filter(approval => approval._id !== signUpId);
          
          set({ 
            pendingApprovals: updatedApprovals,
            isLoading: false 
          });
          return { success: true, data: existingSignUps[signUpIndex] };
        } catch (error) {
          console.error('Error holding employee:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to hold employee'
          });
          return { success: false, error: error.message || 'Failed to hold employee' };
        }
      },

      // New function to reject an employee registration
      rejectEmployee: async (signUpId, rejectionData, token) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with localStorage
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get current signups
          const existingSignUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
          const signUpIndex = existingSignUps.findIndex(signup => signup._id === signUpId);
          
          if (signUpIndex === -1) {
            throw new Error('Sign up not found');
          }
          
          // Update the status and add rejection data
          existingSignUps[signUpIndex] = {
            ...existingSignUps[signUpIndex],
            status: 'rejected',
            profileStatus: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectedBy: rejectionData.rejectedBy || 'admin',
            rejectionReason: rejectionData.rejectionReason || '',
            ...rejectionData
          };
          
          // Save back to localStorage
          localStorage.setItem('employeeSignUps', JSON.stringify(existingSignUps));
          
          // Update the pending approvals list
          const currentApprovals = get().pendingApprovals;
          const updatedApprovals = currentApprovals.filter(approval => approval._id !== signUpId);
          
          set({ 
            pendingApprovals: updatedApprovals,
            isLoading: false 
          });
          return { success: true, data: existingSignUps[signUpIndex] };
        } catch (error) {
          console.error('Error rejecting employee:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to reject employee'
          });
          return { success: false, error: error.message || 'Failed to reject employee' };
        }
      },

      getSignUpById: async (signUpId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call with localStorage
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Get signups from localStorage
          const existingSignUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
          const signUp = existingSignUps.find(signup => signup._id === signUpId);
          
          if (signUp) {
            set({ 
              currentSignUp: signUp,
              isLoading: false 
            });
            return { success: true, data: signUp };
          } else {
            throw new Error('Employee sign up not found');
          }
        } catch (error) {
          console.error('Error fetching sign-up:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Failed to fetch employee sign-up'
          });
          return { success: false, error: error.message || 'Failed to fetch employee sign-up' };
        }
      },

      clearError: () => {
        set({ error: null });
      },

      resetSignUp: () => {
        set({ 
          currentSignUp: null,
          signUpData: null,
          error: null 
        });
      }
    }),
    {
      name: 'eco-auto-employee-signup',
      partialize: (state) => ({
        currentSignUp: state.currentSignUp,
        signUpData: state.signUpData
      })
    }
  )
);
