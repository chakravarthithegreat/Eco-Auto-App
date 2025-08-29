import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = '/api';

// Define responsibilities and sub-responsibilities according to specification
const RESPONSIBILITIES = [
  {
    id: 'project_management',
    name: 'Project Management',
    description: 'Overseeing project execution and delivery',
    tags: ['management', 'planning', 'coordination']
  },
  {
    id: 'ui_ux_design',
    name: 'UI/UX Design',
    description: 'Creating user interfaces and experiences',
    tags: ['design', 'user-experience', 'prototyping']
  },
  {
    id: 'frontend_development',
    name: 'Frontend Development',
    description: 'Building client-side applications',
    tags: ['javascript', 'react', 'html', 'css']
  },
  {
    id: 'backend_development',
    name: 'Backend Development',
    description: 'Building server-side applications and APIs',
    tags: ['nodejs', 'python', 'database', 'api']
  },
  {
    id: 'quality_assurance',
    name: 'Quality Assurance',
    description: 'Testing and ensuring quality standards',
    tags: ['testing', 'automation', 'manual-testing']
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'Infrastructure and deployment management',
    tags: ['docker', 'kubernetes', 'ci-cd', 'aws']
  }
];

const SUB_RESPONSIBILITIES = [
  // Project Management sub-responsibilities
  {
    id: 'project_planning',
    responsibilityId: 'project_management',
    name: 'Project Planning',
    description: 'Creating project plans and timelines',
    skillLevel: 'MID'
  },
  {
    id: 'resource_allocation',
    responsibilityId: 'project_management',
    name: 'Resource Allocation',
    description: 'Assigning resources to tasks and projects',
    skillLevel: 'SENIOR'
  },
  
  // UI/UX Design sub-responsibilities
  {
    id: 'wireframing',
    responsibilityId: 'ui_ux_design',
    name: 'Wireframing',
    description: 'Creating low-fidelity mockups',
    skillLevel: 'JUNIOR'
  },
  {
    id: 'visual_design',
    responsibilityId: 'ui_ux_design',
    name: 'Visual Design',
    description: 'Creating high-fidelity visual designs',
    skillLevel: 'MID'
  },
  
  // Frontend Development sub-responsibilities
  {
    id: 'component_development',
    responsibilityId: 'frontend_development',
    name: 'Component Development',
    description: 'Building reusable UI components',
    skillLevel: 'JUNIOR'
  },
  {
    id: 'state_management',
    responsibilityId: 'frontend_development',
    name: 'State Management',
    description: 'Managing application state',
    skillLevel: 'MID'
  },
  
  // Backend Development sub-responsibilities
  {
    id: 'api_development',
    responsibilityId: 'backend_development',
    name: 'API Development',
    description: 'Building RESTful APIs',
    skillLevel: 'JUNIOR'
  },
  {
    id: 'database_design',
    responsibilityId: 'backend_development',
    name: 'Database Design',
    description: 'Designing database schemas',
    skillLevel: 'MID'
  },
  
  // Quality Assurance sub-responsibilities
  {
    id: 'test_case_creation',
    responsibilityId: 'quality_assurance',
    name: 'Test Case Creation',
    description: 'Writing test cases and scenarios',
    skillLevel: 'JUNIOR'
  },
  {
    id: 'automated_testing',
    responsibilityId: 'quality_assurance',
    name: 'Automated Testing',
    description: 'Implementing automated test suites',
    skillLevel: 'MID'
  },
  
  // DevOps sub-responsibilities
  {
    id: 'ci_cd_setup',
    responsibilityId: 'devops',
    name: 'CI/CD Setup',
    description: 'Setting up continuous integration pipelines',
    skillLevel: 'MID'
  },
  {
    id: 'infrastructure_management',
    responsibilityId: 'devops',
    name: 'Infrastructure Management',
    description: 'Managing cloud infrastructure',
    skillLevel: 'SENIOR'
  }
];

// Mock users with responsibilities and sub-responsibilities according to specification
const MOCK_USERS = {
  'admin': { 
    id: '1', 
    username: 'admin', 
    role: 'ADMIN', 
    name: 'Admin User', 
    email: 'admin@ecoauto.com', 
    status: 'ACTIVE',
    capacityHoursPerWeek: 40,
    responsibilities: ['project_management', 'ui_ux_design', 'frontend_development', 'backend_development', 'quality_assurance', 'devops'],
    subResponsibilities: ['project_planning', 'resource_allocation', 'wireframing', 'visual_design', 'component_development', 'state_management', 'api_development', 'database_design', 'test_case_creation', 'automated_testing', 'ci_cd_setup', 'infrastructure_management'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'manager': { 
    id: '2', 
    username: 'manager', 
    role: 'MANAGER', 
    name: 'Manager User', 
    email: 'manager@ecoauto.com', 
    status: 'ACTIVE',
    capacityHoursPerWeek: 40,
    responsibilities: ['project_management', 'ui_ux_design', 'frontend_development'],
    subResponsibilities: ['project_planning', 'resource_allocation', 'wireframing', 'visual_design', 'component_development'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'member': { 
    id: '3', 
    username: 'member', 
    role: 'TEAM_MEMBER', 
    name: 'Team Member', 
    email: 'member@ecoauto.com', 
    status: 'ACTIVE',
    capacityHoursPerWeek: 40,
    responsibilities: ['frontend_development', 'backend_development'],
    subResponsibilities: ['component_development', 'state_management', 'api_development', 'database_design'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,
      
      // Responsibilities and sub-responsibilities data
      responsibilities: RESPONSIBILITIES,
      subResponsibilities: SUB_RESPONSIBILITIES,

      // Actions
      login: async (username, password) => {
        // Validate input
        if (!username || !password) {
          const errorMessage = 'Username and password are required';
          set({ error: errorMessage });
          return { success: false, error: errorMessage };
        }

        set({ isLoading: true, error: null });
        
        try {
          // Try real API call to backend first
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              password: password
            }),
          });

          const data = await response.json();
          
          if (data.success && data.user) {
            // Transform backend user data to match frontend format
            const user = {
              id: data.user._id || data.user.id,
              username: data.user.email,
              role: data.user.role || 'TEAM_MEMBER',
              name: data.user.name,
              email: data.user.email,
              status: data.user.status || 'ACTIVE',
              department: data.user.department,
              position: data.user.position,
              salary: data.user.salary,
              shift: data.user.shift,
              skills: data.user.skills || [],
              hireDate: data.user.hireDate,
              createdAt: data.user.createdAt,
              updatedAt: data.user.updatedAt
            };

            set({
              user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, user };
          } else {
            const errorMessage = data.message || 'Invalid credentials';
            set({
              isLoading: false,
              error: errorMessage,
            });
            return { success: false, error: errorMessage };
          }
        } catch (error) {
          console.error('Backend login failed, trying demo login:', error);
          
          // Fallback to demo login if backend is not available
          const demoUsers = {
            'meera.iyer': { role: 'ADMIN', name: 'Meera Iyer' },
            'rajesh.kumar': { role: 'MANAGER', name: 'Rajesh Kumar' },
            'amit.patel': { role: 'TEAM_MEMBER', name: 'Amit Patel' },
            'priya.sharma': { role: 'MANAGER', name: 'Priya Sharma' },
            'sneha.reddy': { role: 'TEAM_MEMBER', name: 'Sneha Reddy' },
            'vikram.singh': { role: 'TEAM_MEMBER', name: 'Vikram Singh' }
          };
          
          const demoUser = demoUsers[username];
          
          if (demoUser && password === 'password123') {
            const user = {
              id: `demo-${Date.now()}`,
              username: username,
              role: demoUser.role,
              name: demoUser.name,
              email: `${username}@artgifts.com`,
              status: 'ACTIVE',
              department: 'Demo Department',
              position: demoUser.role === 'ADMIN' ? 'CEO' : demoUser.role === 'MANAGER' ? 'Manager' : 'Team Member',
              salary: 50000,
              shift: 'morning',
              skills: ['Demo Skills'],
              hireDate: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            set({
              user,
              token: `demo-token-${Date.now()}`,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, user };
          } else {
            const errorMessage = 'Invalid credentials';
            set({
              isLoading: false,
              error: errorMessage,
            });
            return { success: false, error: errorMessage };
          }
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error('Logout error:', error);
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Role-based access helpers
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role);
      },

      isAdmin: () => {
        return get().hasRole('ADMIN');
      },

      isManager: () => {
        return get().hasRole('MANAGER');
      },

      isTeamMember: () => {
        return get().hasRole('TEAM_MEMBER');
      },

      canManageUsers: () => {
        return get().hasAnyRole(['ADMIN', 'MANAGER']);
      },

      canManageProjects: () => {
        return get().hasAnyRole(['ADMIN', 'MANAGER']);
      },

      canViewAnalytics: () => {
        return get().hasAnyRole(['ADMIN', 'MANAGER']);
      },

      canManagePolicies: () => {
        return get().hasRole('ADMIN');
      },

      // Get user responsibilities
      getUserResponsibilities: () => {
        const { user, responsibilities } = get();
        if (!user || !user.responsibilities) return [];
        
        return responsibilities.filter(responsibility => 
          user.responsibilities.includes(responsibility.id)
        );
      },

      // Get user sub-responsibilities
      getUserSubResponsibilities: () => {
        const { user, subResponsibilities } = get();
        if (!user || !user.subResponsibilities) return [];
        
        return subResponsibilities.filter(subResponsibility => 
          user.subResponsibilities.includes(subResponsibility.id)
        );
      },

      // Get responsibility by ID
      getResponsibility: (responsibilityId) => {
        const { responsibilities } = get();
        return responsibilities.find(r => r.id === responsibilityId);
      },

      // Get sub-responsibility by ID
      getSubResponsibility: (subResponsibilityId) => {
        const { subResponsibilities } = get();
        return subResponsibilities.find(sr => sr.id === subResponsibilityId);
      },

      // Get users by responsibility
      getUsersByResponsibility: (responsibilityId) => {
        return Object.values(MOCK_USERS).filter(user => 
          user.responsibilities.includes(responsibilityId)
        );
      },

      // Get users by sub-responsibility
      getUsersBySubResponsibility: (subResponsibilityId) => {
        return Object.values(MOCK_USERS).filter(user => 
          user.subResponsibilities.includes(subResponsibilityId)
        );
      },

      // Test helpers for development
      switchRole: (role) => {
        const { user } = get();
        if (user) {
          const newUser = MOCK_USERS[role.toLowerCase()];
          if (newUser) {
            set({
              user: newUser,
              token: `mock-token-${newUser.id}`,
            });
          }
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Update user profile
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { user } = get();
          if (user) {
            const updatedUser = { ...user, ...userData, updatedAt: new Date().toISOString() };
            set({ user: updatedUser, isLoading: false });
            return { success: true, user: updatedUser };
          }
        } catch (error) {
          console.error('Profile update error:', error);
          set({ isLoading: false, error: 'Failed to update profile' });
          return { success: false, error: 'Failed to update profile' };
        }
      },

      // Add hydration callback
      setHasHydrated: (hydrated) => {
        console.log('Auth store hydration status:', hydrated);
        set({ hasHydrated: hydrated });
      }
    }),
    {
      name: 'eco-auto-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => {
        console.log('Auth store hydration started');
        return (state, error) => {
          if (error) {
            console.error('Auth store hydration error:', error);
          } else {
            console.log('Auth store hydration finished');
            if (state && state.setHasHydrated) {
              state.setHasHydrated(true);
            }
          }
        };
      },
    }
  )
);

export { useAuthStore };