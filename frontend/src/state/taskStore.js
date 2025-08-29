import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardAPI } from '../services/dashboardApi';

const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'MANAGER',
    department: 'Engineering',
    currentLoad: 75
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'TEAM_MEMBER',
    department: 'Design',
    currentLoad: 60
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'TEAM_MEMBER',
    department: 'Development',
    currentLoad: 20
  }
];

export const useTaskStore = create(
  persist(
    (set, get) => ({
      // State
      tasks: [],
      myTasks: [],
      teamTasks: [],
      projects: [],
      categories: [],
      isLoading: false,
      error: null,
      filters: {
        status: 'all',
        priority: 'all',
        category: 'all',
        assignee: 'all'
      },

      // Actions
      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 TaskStore: Fetching real tasks from backend...');
          
          // Fetch real tasks from backend
          const realTasks = await DashboardAPI.getTasks();
          
          console.log('✅ TaskStore: Real tasks received from backend:', realTasks);
          
          // Transform backend tasks to frontend format
          const transformedTasks = realTasks.map(task => ({
            id: task._id,
            stageId: task.stageId || '1',
            projectId: task.projectId || '1',
            title: task.title,
            desc: task.description,
            assigneeId: task.assignedTo?._id || task.assignedTo,
            responsibilityId: task.responsibilityId || 'project_management',
            subResponsibilityId: task.subResponsibilityId || 'project_planning',
            priority: task.priority?.toUpperCase() || 'MEDIUM',
            status: task.status?.toUpperCase() || 'PENDING',
            dueAt: task.dueDate,
            estHours: task.estimatedHours || 8,
            spentHours: task.actualHours || 0,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            // Additional fields for compatibility
            assignee: task.assignedTo,
            category: task.category || 'General',
            progress: task.progress || 0
          }));
          
          set({ 
            tasks: transformedTasks,
            isLoading: false 
          });
          
          console.log('✅ TaskStore: Tasks transformed and stored successfully');
        } catch (error) {
          console.error('❌ TaskStore: Error fetching real tasks:', error);
          console.log('📊 TaskStore: Falling back to mock tasks');
          
          // Fallback to mock tasks if real data fails
          get().initializeMockTasks();
          set({ 
            isLoading: false,
            error: 'Failed to fetch real tasks, using mock data'
          });
        }
      },

      initializeMockTasks: () => {
        console.log('TaskStore: Initializing mock tasks');
        const mockTasks = [
          // Tasks for E-Commerce Platform Development
          {
            id: '1',
            stageId: '1',
            projectId: '1',
            title: 'Conduct Stakeholder Interviews',
            desc: 'Interview key stakeholders to gather requirements',
            assigneeId: '2',
            responsibilityId: 'project_management',
            subResponsibilityId: 'project_planning',
            priority: 'HIGH',
            status: 'DONE',
            dueAt: '2024-08-03T17:00:00Z',
            estHours: 8,
            spentHours: 6,
            createdAt: '2024-08-01T09:00:00Z',
            updatedAt: '2024-08-03T16:30:00Z'
          },
          {
            id: '2',
            stageId: '1',
            projectId: '1',
            title: 'Document Requirements',
            desc: 'Create detailed requirements document based on interviews',
            assigneeId: '2',
            responsibilityId: 'project_management',
            subResponsibilityId: 'project_planning',
            priority: 'HIGH',
            status: 'DONE',
            dueAt: '2024-08-05T17:00:00Z',
            estHours: 12,
            spentHours: 10,
            createdAt: '2024-08-03T10:00:00Z',
            updatedAt: '2024-08-05T16:45:00Z'
          },
          {
            id: '3',
            stageId: '2',
            projectId: '1',
            title: 'Create Wireframes',
            desc: 'Design low-fidelity wireframes for key user flows',
            assigneeId: '3',
            responsibilityId: 'design',
            subResponsibilityId: 'ui_design',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
            dueAt: '2024-08-10T17:00:00Z',
            estHours: 16,
            spentHours: 8,
            createdAt: '2024-08-05T14:00:00Z',
            updatedAt: '2024-08-07T11:30:00Z'
          },
          {
            id: '4',
            stageId: '2',
            projectId: '1',
            title: 'Design UI Components',
            desc: 'Create high-fidelity designs for reusable components',
            assigneeId: '3',
            responsibilityId: 'design',
            subResponsibilityId: 'ui_design',
            priority: 'MEDIUM',
            status: 'PENDING',
            dueAt: '2024-08-15T17:00:00Z',
            estHours: 20,
            spentHours: 0,
            createdAt: '2024-08-07T09:00:00Z',
            updatedAt: '2024-08-07T09:00:00Z'
          },
          {
            id: '5',
            stageId: '3',
            projectId: '1',
            title: 'Set Up Development Environment',
            desc: 'Configure development tools and project structure',
            assigneeId: '1',
            responsibilityId: 'development',
            subResponsibilityId: 'frontend_development',
            priority: 'HIGH',
            status: 'DONE',
            dueAt: '2024-08-08T17:00:00Z',
            estHours: 4,
            spentHours: 4,
            createdAt: '2024-08-06T10:00:00Z',
            updatedAt: '2024-08-08T16:00:00Z'
          },
          {
            id: '6',
            stageId: '3',
            projectId: '1',
            title: 'Implement User Authentication',
            desc: 'Build login, registration, and password reset functionality',
            assigneeId: '1',
            responsibilityId: 'development',
            subResponsibilityId: 'backend_development',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            dueAt: '2024-08-20T17:00:00Z',
            estHours: 24,
            spentHours: 12,
            createdAt: '2024-08-08T14:00:00Z',
            updatedAt: '2024-08-10T15:30:00Z'
          }
        ];
        
        set({ tasks: mockTasks });
      },

      createTask: async (taskData) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 TaskStore: Creating new task in backend...');
          
          // Create task in backend
          const newTask = await DashboardAPI.createTask(taskData);
          
          console.log('✅ TaskStore: Task created in backend:', newTask);
          
          // Add to local state
          const transformedTask = {
            id: newTask._id,
            stageId: newTask.stageId || '1',
            projectId: newTask.projectId || '1',
            title: newTask.title,
            desc: newTask.description,
            assigneeId: newTask.assignedTo?._id || newTask.assignedTo,
            responsibilityId: newTask.responsibilityId || 'project_management',
            subResponsibilityId: newTask.subResponsibilityId || 'project_planning',
            priority: newTask.priority?.toUpperCase() || 'MEDIUM',
            status: newTask.status?.toUpperCase() || 'PENDING',
            dueAt: newTask.dueDate,
            estHours: newTask.estimatedHours || 8,
            spentHours: newTask.actualHours || 0,
            createdAt: newTask.createdAt,
            updatedAt: newTask.updatedAt
          };
          
          set(state => ({
            tasks: [...state.tasks, transformedTask],
            isLoading: false
          }));
          
          console.log('✅ TaskStore: Task added to local state successfully');
        } catch (error) {
          console.error('❌ TaskStore: Error creating task:', error);
          set({ 
            isLoading: false,
            error: 'Failed to create task'
          });
        }
      },

      updateTask: async (taskId, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 TaskStore: Updating task in backend...');
          
          // Update task in backend
          const updatedTask = await DashboardAPI.updateTask(taskId, updates);
          
          console.log('✅ TaskStore: Task updated in backend:', updatedTask);
          
          // Update local state
          set(state => ({
            tasks: state.tasks.map(task => 
              task.id === taskId 
                ? {
                    ...task,
                    ...updates,
                    updatedAt: new Date().toISOString()
                  }
                : task
            ),
            isLoading: false
          }));
          
          console.log('✅ TaskStore: Task updated in local state successfully');
        } catch (error) {
          console.error('❌ TaskStore: Error updating task:', error);
          set({ 
            isLoading: false,
            error: 'Failed to update task'
          });
        }
      },

      deleteTask: async (taskId) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 TaskStore: Deleting task from backend...');
          
          // Delete task from backend
          await DashboardAPI.deleteTask(taskId);
          
          console.log('✅ TaskStore: Task deleted from backend');
          
          // Remove from local state
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== taskId),
            isLoading: false
          }));
          
          console.log('✅ TaskStore: Task removed from local state successfully');
        } catch (error) {
          console.error('❌ TaskStore: Error deleting task:', error);
          set({ 
            isLoading: false,
            error: 'Failed to delete task'
          });
        }
      },

      // Helper functions
      getTasksByStatus: (status) => {
        const { tasks } = get();
        return tasks.filter(task => task.status === status);
      },

      getTasksByPriority: (priority) => {
        const { tasks } = get();
        return tasks.filter(task => task.priority === priority);
      },

      getTasksByAssignee: (assigneeId) => {
        const { tasks } = get();
        return tasks.filter(task => task.assigneeId === assigneeId);
      },

      getTaskStatistics: () => {
        const { tasks } = get();
        const total = tasks.length;
        const done = tasks.filter(t => t.status === 'DONE').length;
        const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const pending = tasks.filter(t => t.status === 'PENDING').length;
        const overdue = tasks.filter(t => {
          if (t.status === 'DONE') return false;
          return new Date(t.dueAt) < new Date();
        }).length;

        return {
          total,
          done,
          inProgress,
          pending,
          overdue,
          allStats: { total, done, inProgress, pending, overdue }
        };
      },

      getOverdueTasks: () => {
        const { tasks } = get();
        return tasks.filter(task => {
          if (task.status === 'DONE') return false;
          return new Date(task.dueAt) < new Date();
        });
      },

      getUpcomingTasks: () => {
        const { tasks } = get();
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return tasks.filter(task => {
          if (task.status === 'DONE') return false;
          const dueDate = new Date(task.dueAt);
          return dueDate >= now && dueDate <= nextWeek;
        });
      },

      getCompletionRate: () => {
        const { tasks } = get();
        if (tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'DONE').length;
        return Math.round((completed / tasks.length) * 100);
      },

      // Filter functions
      setFilter: (filterType, value) => {
        set(state => ({
          filters: {
            ...state.filters,
            [filterType]: value
          }
        }));
      },

      getFilteredTasks: () => {
        const { tasks, filters } = get();
        return tasks.filter(task => {
          if (filters.status !== 'all' && task.status !== filters.status) return false;
          if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
          if (filters.category !== 'all' && task.category !== filters.category) return false;
          if (filters.assignee !== 'all' && task.assigneeId !== filters.assignee) return false;
          return true;
        });
      }
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        filters: state.filters
      })
    }
  )
);