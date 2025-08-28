import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import RoleSpecificDashboard from '../dashboard/RoleSpecificDashboard';

// Create a mock auth store for testing
const useMockAuthStore = create(
  persist(
    (set, get) => ({
      user: { id: 1, username: 'admin', role: 'admin', name: 'Admin User' },
      token: 'mock-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
      hasHydrated: true,
      
      // Mock login function
      login: async (credentials) => {
        const mockUsers = {
          'admin': { id: 1, username: 'admin', role: 'admin', name: 'Admin User' },
          'manager': { id: 2, username: 'manager', role: 'manager', name: 'Manager User' },
          'member': { id: 3, username: 'member', role: 'team_member', name: 'Team Member' }
        };
        
        const user = mockUsers[credentials.username];
        if (user && credentials.password === `${credentials.username}123`) {
          const token = `mock-jwt-token-${user.id}-${Date.now()}`;
          set({ user, token, isAuthenticated: true, error: null });
          return { success: true, user };
        } else {
          const errorMessage = 'Invalid username or password';
          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },
      
      // Mock logout function
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },
      
      // Mock role checking functions
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },
      
      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role);
      },
      
      isAdmin: () => get().hasRole('admin'),
      isManager: () => get().hasRole('manager'),
      isTeamMember: () => get().hasRole('team_member'),
      
      canManageUsers: () => get().hasAnyRole(['admin', 'manager']),
      canManageProjects: () => get().hasAnyRole(['admin', 'manager']),
      canViewAnalytics: () => get().hasAnyRole(['admin', 'manager']),
      canManagePolicies: () => get().hasRole('admin'),
      
      // Mock hydration callback
      setHasHydrated: (hydrated) => {
        set({ hasHydrated: hydrated });
      }
    }),
    {
      name: 'mock-auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Mock AuthProvider component
const MockAuthProvider = ({ userRole = 'admin', children }) => {
  const mockUsers = {
    admin: { id: 1, username: 'admin', role: 'admin', name: 'Admin User' },
    manager: { id: 2, username: 'manager', role: 'manager', name: 'Manager User' },
    member: { id: 3, username: 'member', role: 'team_member', name: 'Team Member' }
  };
  
  const mockUser = mockUsers[userRole] || mockUsers.admin;
  
  // Override the useAuthStore hook to return mock data
  useMockAuthStore.setState({ 
    user: mockUser, 
    token: `mock-token-${mockUser.id}`, 
    isAuthenticated: true 
  });
  
  return children;
};

const RoleSpecificDashboardTest = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">RoleSpecificDashboard Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
        <MockAuthProvider userRole="admin">
          <RoleSpecificDashboard />
        </MockAuthProvider>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Manager Dashboard</h2>
        <MockAuthProvider userRole="manager">
          <RoleSpecificDashboard />
        </MockAuthProvider>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Team Member Dashboard</h2>
        <MockAuthProvider userRole="member">
          <RoleSpecificDashboard />
        </MockAuthProvider>
      </div>
    </div>
  );
};

export default RoleSpecificDashboardTest;