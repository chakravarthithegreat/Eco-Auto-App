import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default role structure - Ecotrophy Innovations
const DEFAULT_ROLES = [
  {
    id: 'sales-client-management',
    name: 'Sales & Client Management',
    description: 'Lead generation and client relationship management',
    responsibilities: ['lead-generation', 'quotation'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'production',
    name: 'Production',
    description: 'Manufacturing and production operations',
    responsibilities: ['cutting', 'printing', 'assembly'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_RESPONSIBILITIES = [
  {
    id: 'lead-generation',
    roleId: 'sales-client-management',
    name: 'Lead Generation',
    description: 'Generate and qualify leads',
    subResponsibilities: ['cold-calls', 'whatsapp-follow-ups'],
    capacityHrs: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'quotation',
    roleId: 'sales-client-management',
    name: 'Quotation',
    description: 'Prepare and send quotations',
    subResponsibilities: ['price-entry', 'customer-confirmation'],
    capacityHrs: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cutting',
    roleId: 'production',
    name: 'Cutting',
    description: 'Material cutting operations',
    subResponsibilities: ['cnc-router', 'laser-cutter'],
    capacityHrs: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'printing',
    roleId: 'production',
    name: 'Printing',
    description: 'Printing operations',
    subResponsibilities: ['uv-printer'],
    capacityHrs: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'assembly',
    roleId: 'production',
    name: 'Assembly',
    description: 'Final assembly operations',
    subResponsibilities: [],
    capacityHrs: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const DEFAULT_SUB_RESPONSIBILITIES = [
  {
    id: 'cold-calls',
    responsibilityId: 'lead-generation',
    name: 'Cold Calls',
    description: 'Outbound cold calling',
    slaHours: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'whatsapp-follow-ups',
    responsibilityId: 'lead-generation',
    name: 'WhatsApp Follow-ups',
    description: 'Follow up leads via WhatsApp',
    slaHours: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'price-entry',
    responsibilityId: 'quotation',
    name: 'Price Entry',
    description: 'Enter pricing information',
    slaHours: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'customer-confirmation',
    responsibilityId: 'quotation',
    name: 'Customer Confirmation',
    description: 'Get customer confirmation',
    slaHours: 24,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cnc-router',
    responsibilityId: 'cutting',
    name: 'CNC Router',
    description: 'Operate CNC router machine',
    slaHours: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'laser-cutter',
    responsibilityId: 'cutting',
    name: 'Laser Cutter',
    description: 'Operate laser cutting machine',
    slaHours: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'uv-printer',
    responsibilityId: 'printing',
    name: 'UV Printer',
    description: 'Operate UV printing machine',
    slaHours: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const useRoleManagementStore = create(
  persist(
    (set, get) => ({
      // State
      roles: DEFAULT_ROLES,
      responsibilities: DEFAULT_RESPONSIBILITIES,
      subResponsibilities: DEFAULT_SUB_RESPONSIBILITIES,
      isLoading: false,
      error: null,
      auditLog: [],

      // Initialize with fallback data if corrupted
      initialize: () => {
        try {
          const state = get();
          if (!state.roles || state.roles.length === 0) {
            set({
              roles: DEFAULT_ROLES,
              responsibilities: DEFAULT_RESPONSIBILITIES,
              subResponsibilities: DEFAULT_SUB_RESPONSIBILITIES,
              error: null
            });
          }
        } catch (error) {
          console.error('Error initializing role management:', error);
          set({
            roles: DEFAULT_ROLES,
            responsibilities: DEFAULT_RESPONSIBILITIES,
            subResponsibilities: DEFAULT_SUB_RESPONSIBILITIES,
            error: 'Failed to initialize role management'
          });
        }
      },

      // Role CRUD operations
      addRole: (roleData) => {
        try {
          const newRole = {
            id: `role-${Date.now()}`,
            ...roleData,
            responsibilities: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set(state => ({
            roles: [...state.roles, newRole],
            error: null,
            auditLog: [...state.auditLog, {
              action: 'ADD_ROLE',
              entityId: newRole.id,
              entityName: newRole.name,
              timestamp: new Date().toISOString(),
              user: 'admin' // In real app, get from auth store
            }]
          }));

          return newRole;
        } catch (error) {
          console.error('Error adding role:', error);
          set({ error: 'Failed to add role' });
          return null;
        }
      },

      updateRole: (roleId, updates) => {
        try {
          set(state => ({
            roles: state.roles.map(role =>
              role.id === roleId
                ? { ...role, ...updates, updatedAt: new Date().toISOString() }
                : role
            ),
            error: null,
            auditLog: [...state.auditLog, {
              action: 'UPDATE_ROLE',
              entityId: roleId,
              entityName: updates.name || 'Unknown',
              timestamp: new Date().toISOString(),
              user: 'admin'
            }]
          }));
        } catch (error) {
          console.error('Error updating role:', error);
          set({ error: 'Failed to update role' });
        }
      },

      deleteRole: (roleId) => {
        try {
          const role = get().roles.find(r => r.id === roleId);
          if (!role) return false;

          // Remove associated responsibilities and sub-responsibilities
          const responsibilitiesToDelete = get().responsibilities.filter(r => r.roleId === roleId);
          const subResponsibilitiesToDelete = get().subResponsibilities.filter(sr =>
            responsibilitiesToDelete.some(r => r.id === sr.responsibilityId)
          );

          set(state => ({
            roles: state.roles.filter(r => r.id !== roleId),
            responsibilities: state.responsibilities.filter(r => r.roleId !== roleId),
            subResponsibilities: state.subResponsibilities.filter(sr =>
              !subResponsibilitiesToDelete.some(del => del.id === sr.id)
            ),
            error: null,
            auditLog: [...state.auditLog, {
              action: 'DELETE_ROLE',
              entityId: roleId,
              entityName: role.name,
              timestamp: new Date().toISOString(),
              user: 'admin'
            }]
          }));

          return true;
        } catch (error) {
          console.error('Error deleting role:', error);
          set({ error: 'Failed to delete role' });
          return false;
        }
      },

      // Responsibility CRUD operations
      addResponsibility: (roleId, responsibilityData) => {
        console.log('STORE: addResponsibility called with roleId:', roleId, 'data:', responsibilityData);
        try {
          const newResponsibility = {
            id: `resp-${Date.now()}`,
            roleId,
            ...responsibilityData,
            subResponsibilities: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          console.log('STORE: Creating new responsibility:', newResponsibility);

          set(state => {
            console.log('STORE: Current state before update:', {
              responsibilitiesCount: state.responsibilities.length,
              roles: state.roles.map(r => ({ id: r.id, name: r.name, responsibilities: r.responsibilities }))
            });

            // Create new arrays to ensure proper reactivity
            const newResponsibilities = [...state.responsibilities, newResponsibility];
            const newRoles = state.roles.map(role =>
              role.id === roleId
                ? { ...role, responsibilities: [...role.responsibilities, newResponsibility.id] }
                : role
            );
            const newAuditLog = [...state.auditLog, {
              action: 'ADD_RESPONSIBILITY',
              entityId: newResponsibility.id,
              entityName: newResponsibility.name,
              timestamp: new Date().toISOString(),
              user: 'admin'
            }];

            const updatedState = {
              responsibilities: newResponsibilities,
              roles: newRoles,
              error: null,
              auditLog: newAuditLog
            };

            console.log('STORE: Updated state:', {
              responsibilitiesCount: updatedState.responsibilities.length,
              roles: updatedState.roles.map(r => ({ id: r.id, name: r.name, responsibilities: r.responsibilities }))
            });

            // Force a re-render by creating a new state object
            return { ...updatedState };
          });

          console.log('STORE: Responsibility added successfully:', newResponsibility);
          return newResponsibility;
        } catch (error) {
          console.error('Error adding responsibility:', error);
          set({ error: 'Failed to add responsibility' });
          return null;
        }
      },

      updateResponsibility: (responsibilityId, updates) => {
        try {
          set(state => ({
            responsibilities: state.responsibilities.map(resp =>
              resp.id === responsibilityId
                ? { ...resp, ...updates, updatedAt: new Date().toISOString() }
                : resp
            ),
            error: null,
            auditLog: [...state.auditLog, {
              action: 'UPDATE_RESPONSIBILITY',
              entityId: responsibilityId,
              entityName: updates.name || 'Unknown',
              timestamp: new Date().toISOString(),
              user: 'admin'
            }]
          }));
        } catch (error) {
          console.error('Error updating responsibility:', error);
          set({ error: 'Failed to update responsibility' });
        }
      },

      deleteResponsibility: (responsibilityId) => {
        try {
          const responsibility = get().responsibilities.find(r => r.id === responsibilityId);
          if (!responsibility) return false;

          // Remove associated sub-responsibilities
          const subResponsibilitiesToDelete = get().subResponsibilities.filter(sr =>
            sr.responsibilityId === responsibilityId
          );

          set(state => ({
            responsibilities: state.responsibilities.filter(r => r.id !== responsibilityId),
            subResponsibilities: state.subResponsibilities.filter(sr =>
              sr.responsibilityId !== responsibilityId
            ),
            roles: state.roles.map(role => ({
              ...role,
              responsibilities: role.responsibilities.filter(id => id !== responsibilityId)
            })),
            error: null,
            auditLog: [...state.auditLog, {
              action: 'DELETE_RESPONSIBILITY',
              entityId: responsibilityId,
              entityName: responsibility.name,
              timestamp: new Date().toISOString(),
              user: 'admin'
            }]
          }));

          return true;
        } catch (error) {
          console.error('Error deleting responsibility:', error);
          set({ error: 'Failed to delete responsibility' });
          return false;
        }
      },

      // Sub-Responsibility CRUD operations
      addSubResponsibility: (responsibilityId, subResponsibilityData) => {
        try {
          const newSubResponsibility = {
            id: `subresp-${Date.now()}`,
            responsibilityId,
            ...subResponsibilityData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set(state => ({
            subResponsibilities: [...state.subResponsibilities, newSubResponsibility],
            responsibilities: state.responsibilities.map(resp =>
              resp.id === responsibilityId
                ? { ...resp, subResponsibilities: [...resp.subResponsibilities, newSubResponsibility.id] }
                : resp
            ),
            error: null,
            auditLog: [...state.auditLog, {
              action: 'ADD_SUB_RESPONSIBILITY',
              entityId: newSubResponsibility.id,
              entityName: newSubResponsibility.name,
              timestamp: new Date().toISOString(),
              user: 'admin'
            }]
          }));

          return newSubResponsibility;
        } catch (error) {
          console.error('Error adding sub-responsibility:', error);
          set({ error: 'Failed to add sub-responsibility' });
          return null;
        }
      },

      updateSubResponsibility: (subResponsibilityId, updates) => {
        try {
          set(state => ({
            subResponsibilities: state.subResponsibilities.map(subResp =>
              subResp.id === subResponsibilityId
                ? { ...subResp, ...updates, updatedAt: new Date().toISOString() }
                : subResp
            ),
            error: null,
            auditLog: [...state.auditLog, {
              action: 'UPDATE_SUB_RESPONSIBILITY',
              entityId: subResponsibilityId,
              entityName: updates.name || 'Unknown',
              timestamp: new Date().toISOString(),
              user: 'admin'
            }]
          }));
        } catch (error) {
          console.error('Error updating sub-responsibility:', error);
          set({ error: 'Failed to update sub-responsibility' });
        }
      },

      deleteSubResponsibility: (subResponsibilityId) => {
        try {
          const subResponsibility = get().subResponsibilities.find(sr => sr.id === subResponsibilityId);
          if (!subResponsibility) return false;

          set(state => ({
            subResponsibilities: state.subResponsibilities.filter(sr => sr.id !== subResponsibilityId),
            responsibilities: state.responsibilities.map(resp => ({
              ...resp,
              subResponsibilities: resp.subResponsibilities.filter(id => id !== subResponsibilityId)
            })),
            error: null,
            auditLog: [...state.auditLog, {
              action: 'DELETE_SUB_RESPONSIBILITY',
              entityId: subResponsibilityId,
              entityName: subResponsibility.name,
              timestamp: new Date().toISOString(),
              user: 'admin'
            }]
          }));

          return true;
        } catch (error) {
          console.error('Error deleting sub-responsibility:', error);
          set({ error: 'Failed to delete sub-responsibility' });
          return false;
        }
      },

      // Utility functions with fallbacks
      getRoleById: (roleId) => {
        try {
          return get().roles.find(role => role.id === roleId) || null;
        } catch (error) {
          console.error('Error getting role by ID:', error);
          return null;
        }
      },

      getResponsibilitiesByRole: (roleId) => {
        try {
          return get().responsibilities.filter(resp => resp.roleId === roleId) || [];
        } catch (error) {
          console.error('Error getting responsibilities by role:', error);
          return [];
        }
      },

      getSubResponsibilitiesByResponsibility: (responsibilityId) => {
        try {
          return get().subResponsibilities.filter(subResp => subResp.responsibilityId === responsibilityId) || [];
        } catch (error) {
          console.error('Error getting sub-responsibilities by responsibility:', error);
          return [];
        }
      },

      getSubResponsibilityById: (subResponsibilityId) => {
        try {
          return get().subResponsibilities.find(subResp => subResp.id === subResponsibilityId) || null;
        } catch (error) {
          console.error('Error getting sub-responsibility by ID:', error);
          return null;
        }
      },

      // Export/Import functionality
      exportRoles: () => {
        try {
          const state = get();
          return {
            roles: state.roles,
            responsibilities: state.responsibilities,
            subResponsibilities: state.subResponsibilities,
            exportedAt: new Date().toISOString()
          };
        } catch (error) {
          console.error('Error exporting roles:', error);
          return null;
        }
      },

      importRoles: (data) => {
        try {
          if (!data || !data.roles || !data.responsibilities || !data.subResponsibilities) {
            throw new Error('Invalid import data structure');
          }

          set({
            roles: data.roles,
            responsibilities: data.responsibilities,
            subResponsibilities: data.subResponsibilities,
            error: null,
            auditLog: [...get().auditLog, {
              action: 'IMPORT_ROLES',
              entityId: 'import',
              entityName: 'Bulk Import',
              timestamp: new Date().toISOString(),
              user: 'admin'
            }]
          });

          return true;
        } catch (error) {
          console.error('Error importing roles:', error);
          set({ error: 'Failed to import roles' });
          return false;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Get audit log
      getAuditLog: () => {
        try {
          return get().auditLog || [];
        } catch (error) {
          console.error('Error getting audit log:', error);
          return [];
        }
      }
    }),
    {
      name: 'role-management-storage',
      onRehydrateStorage: () => (state) => {
        // Ensure fallback data if hydration fails
        if (state && (!state.roles || state.roles.length === 0)) {
          state.roles = DEFAULT_ROLES;
          state.responsibilities = DEFAULT_RESPONSIBILITIES;
          state.subResponsibilities = DEFAULT_SUB_RESPONSIBILITIES;
        }
      }
    }
  )
);

export default useRoleManagementStore;
