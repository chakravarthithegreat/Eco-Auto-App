import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = 'http://localhost:3001/api';

export const TASK_STATUS = {
  TODO: 'TODO',
  DOING: 'DOING',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
  BLOCKED: 'BLOCKED'
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Mock users data with capacity and current load
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    role: 'ADMIN',
    responsibilities: ['project_management', 'ui_ux_design', 'frontend_development', 'backend_development', 'quality_assurance', 'devops'],
    subResponsibilities: ['project_planning', 'resource_allocation', 'wireframing', 'visual_design', 'component_development', 'state_management', 'api_development', 'database_design', 'test_case_creation', 'automated_testing', 'ci_cd_setup', 'infrastructure_management'],
    capacityHoursPerWeek: 40,
    currentLoad: 25
  },
  {
    id: '2',
    name: 'Manager User',
    role: 'MANAGER',
    responsibilities: ['project_management', 'ui_ux_design', 'frontend_development'],
    subResponsibilities: ['project_planning', 'resource_allocation', 'wireframing', 'visual_design', 'component_development'],
    capacityHoursPerWeek: 40,
    currentLoad: 35
  },
  {
    id: '3',
    name: 'Team Member',
    role: 'TEAM_MEMBER',
    responsibilities: ['frontend_development', 'backend_development'],
    subResponsibilities: ['component_development', 'state_management', 'api_development', 'database_design'],
    capacityHoursPerWeek: 40,
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
          const response = await fetch(`${API_BASE_URL}/tasks`);
          
          if (response.ok) {
            const tasks = await response.json();
            // Transform backend data to match frontend format
            const transformedTasks = tasks.map(task => ({
              id: task._id || task.id,
              stageId: task.project || '1',
              projectId: task.project || '1',
              title: task.title,
              desc: task.description,
              assigneeId: task.assignedTo?.[0] || task.assignedBy,
              responsibilityId: task.category?.toLowerCase() || 'general',
              subResponsibilityId: task.category?.toLowerCase() || 'general',
              priority: task.priority?.toUpperCase() || 'MEDIUM',
              status: task.status?.toUpperCase() || 'TODO',
              dueAt: task.dueDate,
              estHours: task.estimatedHours || 0,
              spentHours: task.actualHours || 0,
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
              progress: task.progress || 0,
              tags: task.tags || []
            }));
            set({ tasks: transformedTasks, isLoading: false });
          } else {
            throw new Error('Failed to fetch tasks');
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
          set({ isLoading: false, error: error.message });
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
            desc: 'Design low-fidelity wireframes for key pages',
            assigneeId: '1',
            responsibilityId: 'ui_ux_design',
            subResponsibilityId: 'wireframing',
            priority: 'HIGH',
            status: 'DOING',
            dueAt: '2024-08-12T17:00:00Z',
            estHours: 16,
            spentHours: 8,
            createdAt: '2024-08-06T09:00:00Z',
            updatedAt: '2024-08-08T14:30:00Z'
          },
          {
            id: '4',
            stageId: '2',
            projectId: '1',
            title: 'Design High-Fidelity Mockups',
            desc: 'Create detailed visual designs for homepage and product pages',
            assigneeId: '1',
            responsibilityId: 'ui_ux_design',
            subResponsibilityId: 'visual_design',
            priority: 'HIGH',
            status: 'TODO',
            dueAt: '2024-08-15T17:00:00Z',
            estHours: 24,
            spentHours: 0,
            createdAt: '2024-08-06T09:00:00Z',
            updatedAt: '2024-08-06T09:00:00Z'
          },
          {
            id: '5',
            stageId: '3',
            projectId: '1',
            title: 'Implement Header Component',
            desc: 'Build responsive header with navigation and search',
            assigneeId: null,
            responsibilityId: 'frontend_development',
            subResponsibilityId: 'component_development',
            priority: 'MEDIUM',
            status: 'TODO',
            dueAt: '2024-08-20T17:00:00Z',
            estHours: 8,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          {
            id: '6',
            stageId: '3',
            projectId: '1',
            title: 'Implement Product Listing Page',
            desc: 'Create responsive product grid with filtering and sorting',
            assigneeId: null,
            responsibilityId: 'frontend_development',
            subResponsibilityId: 'component_development',
            priority: 'MEDIUM',
            status: 'TODO',
            dueAt: '2024-08-22T17:00:00Z',
            estHours: 16,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          {
            id: '7',
            stageId: '3',
            projectId: '1',
            title: 'Implement Shopping Cart',
            desc: 'Build interactive shopping cart with add/remove functionality',
            assigneeId: null,
            responsibilityId: 'frontend_development',
            subResponsibilityId: 'component_development',
            priority: 'HIGH',
            status: 'TODO',
            dueAt: '2024-08-25T17:00:00Z',
            estHours: 12,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          {
            id: '8',
            stageId: '4',
            projectId: '1',
            title: 'Design User API Endpoints',
            desc: 'Create RESTful API specifications for user management',
            assigneeId: null,
            responsibilityId: 'backend_development',
            subResponsibilityId: 'api_development',
            priority: 'HIGH',
            status: 'TODO',
            dueAt: '2024-08-28T17:00:00Z',
            estHours: 8,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          {
            id: '9',
            stageId: '4',
            projectId: '1',
            title: 'Implement Product API',
            desc: 'Build API endpoints for product management',
            assigneeId: null,
            responsibilityId: 'backend_development',
            subResponsibilityId: 'api_development',
            priority: 'HIGH',
            status: 'TODO',
            dueAt: '2024-08-30T17:00:00Z',
            estHours: 16,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          {
            id: '10',
            stageId: '5',
            projectId: '1',
            title: 'Set Up Database Schema',
            desc: 'Design and implement database schema for product catalog',
            assigneeId: null,
            responsibilityId: 'backend_development',
            subResponsibilityId: 'database_design',
            priority: 'MEDIUM',
            status: 'TODO',
            dueAt: '2024-09-02T17:00:00Z',
            estHours: 12,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          {
            id: '11',
            stageId: '6',
            projectId: '1',
            title: 'Write Unit Tests for Frontend',
            desc: 'Create comprehensive unit tests for frontend components',
            assigneeId: null,
            responsibilityId: 'quality_assurance',
            subResponsibilityId: 'test_case_creation',
            priority: 'MEDIUM',
            status: 'TODO',
            dueAt: '2024-09-05T17:00:00Z',
            estHours: 16,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          {
            id: '12',
            stageId: '6',
            projectId: '1',
            title: 'Perform Integration Testing',
            desc: 'Test integration between frontend and backend components',
            assigneeId: null,
            responsibilityId: 'quality_assurance',
            subResponsibilityId: 'automated_testing',
            priority: 'HIGH',
            status: 'TODO',
            dueAt: '2024-09-07T17:00:00Z',
            estHours: 12,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          {
            id: '13',
            stageId: '7',
            projectId: '1',
            title: 'Configure Production Deployment',
            desc: 'Set up CI/CD pipeline for production deployment',
            assigneeId: null,
            responsibilityId: 'devops',
            subResponsibilityId: 'ci_cd_setup',
            priority: 'HIGH',
            status: 'TODO',
            dueAt: '2024-09-10T17:00:00Z',
            estHours: 8,
            spentHours: 0,
            createdAt: '2024-08-08T09:00:00Z',
            updatedAt: '2024-08-08T09:00:00Z'
          },
          
          // Tasks for Mobile App Development
          {
            id: '14',
            stageId: '8',
            projectId: '2',
            title: 'Analyze Competitor Apps',
            desc: 'Research and document competitor mobile applications',
            assigneeId: '2',
            responsibilityId: 'project_management',
            subResponsibilityId: 'project_planning',
            priority: 'HIGH',
            status: 'DONE',
            dueAt: '2024-07-20T17:00:00Z',
            estHours: 12,
            spentHours: 10,
            createdAt: '2024-07-16T09:00:00Z',
            updatedAt: '2024-07-20T16:30:00Z'
          },
          {
            id: '15',
            stageId: '9',
            projectId: '2',
            title: 'Design App Architecture',
            desc: 'Create technical architecture for mobile application',
            assigneeId: '2',
            responsibilityId: 'backend_development',
            subResponsibilityId: 'database_design',
            priority: 'HIGH',
            status: 'DONE',
            dueAt: '2024-07-25T17:00:00Z',
            estHours: 16,
            spentHours: 14,
            createdAt: '2024-07-21T09:00:00Z',
            updatedAt: '2024-07-25T16:45:00Z'
          },
          {
            id: '16',
            stageId: '10',
            projectId: '2',
            title: 'Implement Login Screen',
            desc: 'Build authentication screen with validation',
            assigneeId: '3',
            responsibilityId: 'frontend_development',
            subResponsibilityId: 'component_development',
            priority: 'HIGH',
            status: 'DOING',
            dueAt: '2024-08-10T17:00:00Z',
            estHours: 8,
            spentHours: 4,
            createdAt: '2024-08-01T09:00:00Z',
            updatedAt: '2024-08-05T14:30:00Z'
          },
          {
            id: '17',
            stageId: '10',
            projectId: '2',
            title: 'Implement Dashboard Screen',
            desc: 'Create main dashboard with navigation',
            assigneeId: '3',
            responsibilityId: 'frontend_development',
            subResponsibilityId: 'component_development',
            priority: 'HIGH',
            status: 'DOING',
            dueAt: '2024-08-15T17:00:00Z',
            estHours: 12,
            spentHours: 6,
            createdAt: '2024-08-01T09:00:00Z',
            updatedAt: '2024-08-05T14:30:00Z'
          },
          {
            id: '18',
            stageId: '10',
            projectId: '2',
            title: 'Implement Product Listing',
            desc: 'Create product listing view with search functionality',
            assigneeId: '3',
            responsibilityId: 'frontend_development',
            subResponsibilityId: 'component_development',
            priority: 'MEDIUM',
            status: 'TODO',
            dueAt: '2024-08-20T17:00:00Z',
            estHours: 16,
            spentHours: 0,
            createdAt: '2024-08-01T09:00:00Z',
            updatedAt: '2024-08-01T09:00:00Z'
          },
          {
            id: '19',
            stageId: '11',
            projectId: '2',
            title: 'Prepare App Store Assets',
            desc: 'Create screenshots and descriptions for app stores',
            assigneeId: null,
            responsibilityId: 'devops',
            subResponsibilityId: 'ci_cd_setup',
            priority: 'MEDIUM',
            status: 'TODO',
            dueAt: '2024-08-25T17:00:00Z',
            estHours: 8,
            spentHours: 0,
            createdAt: '2024-08-01T09:00:00Z',
            updatedAt: '2024-08-01T09:00:00Z'
          }
        ];
        
        set({ 
          tasks: mockTasks,
          isLoading: false 
        });
        get().categorizeTasksByUser();
        console.log('TaskStore: Mock tasks initialized successfully');
      },

      fetchTasks: async () => {
        console.log('TaskStore: Fetching tasks...');
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/tasks`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            const tasks = await response.json();
            set({ 
              tasks, 
              isLoading: false 
            });
            get().categorizeTasksByUser();
            console.log('TaskStore: Tasks fetched successfully');
          } else {
            // Fallback to mock data if API is not available
            console.log('TaskStore: API not available, using mock tasks data');
            get().initializeMockTasks();
          }
        } catch (error) {
          console.error('TaskStore: Error fetching tasks:', error);
          // Fallback to mock data in case of network error
          console.log('TaskStore: Network error, using mock tasks data');
          get().initializeMockTasks();
          set({ error: 'Network error, using mock data' });
        }
      },

      // Create new task
      createTask: async (taskData) => {
        set({ isLoading: true, error: null });
        
        try {
          const task = {
            ...taskData,
            id: Date.now().toString(), // Temporary ID
            status: TASK_STATUS.TODO,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: '1', // Current user ID
            spentHours: 0
          };

          const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(task),
          });

          if (response.ok) {
            const newTask = await response.json();
            set((state) => ({
              tasks: [...state.tasks, newTask],
              isLoading: false,
            }));
            get().categorizeTasksByUser();
            return { success: true, task: newTask };
          } else {
            throw new Error('Failed to create task');
          }
        } catch (error) {
          console.error('Error creating task:', error);
          set({ isLoading: false, error: 'Failed to create task' });
          return { success: false, error: error.message };
        }
      },

      // Update task
      updateTask: async (taskId, updates) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updates),
          });

          if (response.ok) {
            const updatedTask = await response.json();
            set((state) => ({
              tasks: state.tasks.map(task => 
                task.id === taskId ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() } : task
              ),
              isLoading: false,
            }));
            get().categorizeTasksByUser();
            return { success: true, task: updatedTask };
          } else {
            throw new Error('Failed to update task');
          }
        } catch (error) {
          console.error('Error updating task:', error);
          set({ isLoading: false, error: 'Failed to update task' });
          return { success: false, error: error.message };
        }
      },

      // Delete task
      deleteTask: async (taskId) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              tasks: state.tasks.filter(task => task.id !== taskId),
              isLoading: false,
            }));
            get().categorizeTasksByUser();
            return { success: true };
          } else {
            throw new Error('Failed to delete task');
          }
        } catch (error) {
          console.error('Error deleting task:', error);
          set({ isLoading: false, error: 'Failed to delete task' });
          return { success: false, error: error.message };
        }
      },

      // Start working on task
      startTask: async (taskId) => {
        try {
          const result = await get().updateTask(taskId, { 
            status: TASK_STATUS.DOING,
            startedAt: new Date().toISOString()
          });
          
          if (result.success) {
            // toast.success('Task started successfully');
          }
          
          return result;
        } catch (error) {
          console.error('Error starting task:', error);
          // toast.error('Failed to start task');
          return { success: false };
        }
      },

      // Complete task
      completeTask: async (taskId, completionData) => {
        try {
          const updates = {
            status: TASK_STATUS.DONE,
            completedAt: new Date().toISOString(),
            ...completionData
          };
          
          const result = await get().updateTask(taskId, updates);
          
          if (result.success) {
            // toast.success('Task completed successfully');
          }
          
          return result;
        } catch (error) {
          console.error('Error completing task:', error);
          // toast.error('Failed to complete task');
          return { success: false };
        }
      },

      // Block task
      blockTask: async (taskId, reason) => {
        try {
          const result = await get().updateTask(taskId, { 
            status: TASK_STATUS.BLOCKED,
            blockedReason: reason,
            blockedAt: new Date().toISOString()
          });
          
          if (result.success) {
            // toast.success('Task blocked successfully');
          }
          
          return result;
        } catch (error) {
          console.error('Error blocking task:', error);
          // toast.error('Failed to block task');
          return { success: false };
        }
      },

      // Categorize tasks by user
      categorizeTasksByUser: () => {
        const { tasks } = get();
        const userId = '1'; // In a real app, this would come from auth store
        
        const myTasks = tasks.filter(task => task.assigneeId === userId);
        const teamTasks = tasks; // For now, all tasks are team tasks
        
        set({ myTasks, teamTasks });
      },

      // Filter tasks
      filterTasks: (filters) => {
        set({ filters });
      },

      // Get task by ID
      getTask: (taskId) => {
        const { tasks } = get();
        return tasks.find(task => task.id === taskId);
      },

      // Get tasks by status
      getTasksByStatus: (status) => {
        const { tasks } = get();
        return tasks.filter(task => task.status === status);
      },

      // Get tasks by stage
      getTasksByStage: (stageId) => {
        const { tasks } = get();
        return tasks.filter(task => task.stageId === stageId);
      },

      // Get tasks by project
      getTasksByProject: (projectId) => {
        const { tasks } = get();
        return tasks.filter(task => task.projectId === projectId);
      },

      // Get tasks by responsibility
      getTasksByResponsibility: (responsibilityId) => {
        const { tasks } = get();
        return tasks.filter(task => task.responsibilityId === responsibilityId);
      },

      // Get tasks by user
      getTasksByUser: (userId) => {
        const { tasks } = get();
        return tasks.filter(task => task.assigneeId === userId);
      },

      // Get task statistics
      getTaskStatistics: () => {
        const { tasks, myTasks, teamTasks } = get();
        
        const allStats = {
          total: tasks.length,
          todo: tasks.filter(task => task.status === TASK_STATUS.TODO).length,
          doing: tasks.filter(task => task.status === TASK_STATUS.DOING).length,
          review: tasks.filter(task => task.status === TASK_STATUS.REVIEW).length,
          done: tasks.filter(task => task.status === TASK_STATUS.DONE).length,
          blocked: tasks.filter(task => task.status === TASK_STATUS.BLOCKED).length,
          byPriority: {
            [TASK_PRIORITY.CRITICAL]: tasks.filter(task => task.priority === TASK_PRIORITY.CRITICAL).length,
            [TASK_PRIORITY.HIGH]: tasks.filter(task => task.priority === TASK_PRIORITY.HIGH).length,
            [TASK_PRIORITY.MEDIUM]: tasks.filter(task => task.priority === TASK_PRIORITY.MEDIUM).length,
            [TASK_PRIORITY.LOW]: tasks.filter(task => task.priority === TASK_PRIORITY.LOW).length
          }
        };
        
        const myStats = {
          total: myTasks.length,
          todo: myTasks.filter(task => task.status === TASK_STATUS.TODO).length,
          doing: myTasks.filter(task => task.status === TASK_STATUS.DOING).length,
          review: myTasks.filter(task => task.status === TASK_STATUS.REVIEW).length,
          done: myTasks.filter(task => task.status === TASK_STATUS.DONE).length,
          blocked: myTasks.filter(task => task.status === TASK_PRIORITY.BLOCKED).length
        };
        
        const teamStats = {
          total: teamTasks.length,
          todo: teamTasks.filter(task => task.status === TASK_STATUS.TODO).length,
          doing: teamTasks.filter(task => task.status === TASK_STATUS.DOING).length,
          review: teamTasks.filter(task => task.status === TASK_STATUS.REVIEW).length,
          done: teamTasks.filter(task => task.status === TASK_STATUS.DONE).length,
          blocked: teamTasks.filter(task => task.status === TASK_STATUS.BLOCKED).length
        };
        
        return {
          allStats,
          myStats,
          teamStats
        };
      },

      // Get completion rate
      getCompletionRate: () => {
        const { tasks } = get();
        if (tasks.length === 0) return 0;
        
        const completedTasks = tasks.filter(task => task.status === TASK_STATUS.DONE).length;
        return Math.round((completedTasks / tasks.length) * 100);
      },

      // Get upcoming tasks
      getUpcomingTasks: () => {
        const { tasks } = get();
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        return tasks.filter(task => {
          const taskDate = new Date(task.dueAt);
          return taskDate >= today && taskDate <= nextWeek && task.status !== TASK_STATUS.DONE;
        });
      },

      // Get overdue tasks
      getOverdueTasks: () => {
        const { tasks } = get();
        const today = new Date();
        return tasks.filter(task => {
          if (task.status === TASK_STATUS.DONE) return false;
          return new Date(task.dueAt) < today;
        });
      },

      // Get tasks by priority
      getTasksByPriority: (priority) => {
        const { tasks } = get();
        return tasks.filter(task => task.priority === priority);
      },

      // Get tasks by assignee
      getTasksByAssignee: (assigneeId) => {
        const { tasks } = get();
        return tasks.filter(task => task.assigneeId === assigneeId);
      },

      // Enhanced auto-assignment engine with escalation logic
      autoAssignTask: (taskId) => {
        const { tasks } = get();
        const task = tasks.find(t => t.id === taskId);
        
        if (!task || task.assigneeId) {
          return { success: false, message: 'Task not found or already assigned' };
        }
        
        // Find users with the required responsibility
        const eligibleUsers = MOCK_USERS.filter(user => 
          user.responsibilities.includes(task.responsibilityId) &&
          (task.subResponsibilityId ? user.subResponsibilities.includes(task.subResponsibilityId) : true)
        );
        
        if (eligibleUsers.length === 0) {
          // Escalate to manager if no eligible users found
          const manager = MOCK_USERS.find(user => user.role === 'MANAGER');
          if (manager) {
            return get().updateTask(taskId, { 
              assigneeId: manager.id,
              assignedAt: new Date().toISOString(),
              assignmentReason: 'No eligible users found - escalated to manager'
            });
          }
          return { success: false, message: 'No eligible users found and no manager to escalate to' };
        }
        
        // Sort users by available capacity (least loaded first)
        const sortedUsers = eligibleUsers.sort((a, b) => {
          const aUtilization = a.currentLoad / a.capacityHoursPerWeek;
          const bUtilization = b.currentLoad / b.capacityHoursPerWeek;
          return aUtilization - bUtilization;
        });
        
        // Select the user with the lowest utilization
        const selectedUser = sortedUsers[0];
        
        // Check if user has enough capacity
        const availableCapacity = selectedUser.capacityHoursPerWeek - selectedUser.currentLoad;
        if (availableCapacity < task.estHours) {
          // Check if task is high priority and needs escalation
          if (task.priority === TASK_PRIORITY.CRITICAL || task.priority === TASK_PRIORITY.HIGH) {
            // Escalate to manager for high priority tasks
            const manager = MOCK_USERS.find(user => user.role === 'MANAGER');
            if (manager) {
              return get().updateTask(taskId, { 
                assigneeId: manager.id,
                assignedAt: new Date().toISOString(),
                assignmentReason: `User ${selectedUser.name} overloaded - escalated to manager for high priority task`
              });
            }
          }
          
          // If no escalation, assign to the user anyway but mark as overloaded
          return get().updateTask(taskId, { 
            assigneeId: selectedUser.id,
            assignedAt: new Date().toISOString(),
            assignmentReason: 'Assigned despite capacity constraints',
            isOverloaded: true
          });
        }
        
        // Update user's current load
        selectedUser.currentLoad += task.estHours;
        
        // Assign task to user
        return get().updateTask(taskId, { 
          assigneeId: selectedUser.id,
          assignedAt: new Date().toISOString(),
          assignmentReason: `Auto-assigned to ${selectedUser.name} based on responsibility and capacity`
        });
      },

      // Auto-assign all unassigned tasks with proper escalation
      autoAssignAllTasks: () => {
        const { tasks } = get();
        const unassignedTasks = tasks.filter(task => !task.assigneeId);
        
        const results = [];
        for (const task of unassignedTasks) {
          const result = get().autoAssignTask(task.id);
          results.push({ taskId: task.id, ...result });
        }
        
        return results;
      },

      // Get users by responsibility and sub-responsibility
      getUsersByResponsibility: (responsibilityId, subResponsibilityId = null) => {
        return MOCK_USERS.filter(user => {
          const hasResponsibility = user.responsibilities.includes(responsibilityId);
          const hasSubResponsibility = subResponsibilityId 
            ? user.subResponsibilities.includes(subResponsibilityId)
            : true;
          return hasResponsibility && hasSubResponsibility;
        });
      },

      // Get user capacity utilization
      getUserCapacityUtilization: (userId) => {
        const user = MOCK_USERS.find(u => u.id === userId);
        if (!user) return 0;
        return Math.round((user.currentLoad / user.capacityHoursPerWeek) * 100);
      },

      // Reassign tasks from unavailable employees
      reassignTasksFromUnavailableEmployees: async (attendanceRecords, employees) => {
        try {
          // This would typically reassign tasks from employees who are currently unavailable
          // For now, we'll just log that this function was called
          console.log('Reassigning tasks from unavailable employees');
          return { success: true };
        } catch (error) {
          console.error('Error reassigning tasks:', error);
          return { success: false };
        }
      },

      // Get SLA risks (tasks approaching or past due date)
      getSLARisks: () => {
        const { tasks } = get();
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        
        return tasks.filter(task => {
          if (task.status === TASK_STATUS.DONE || task.status === TASK_STATUS.BLOCKED) return false;
          
          const dueDate = new Date(task.dueAt);
          const diffDays = Math.round(Math.abs((dueDate - today) / oneDay));
          
          // Return tasks that are due within 2 days or already overdue
          return diffDays <= 2;
        });
      },

      // Get task aging (how long tasks have been in their current status)
      getTaskAging: () => {
        const { tasks } = get();
        const today = new Date();
        
        return tasks.map(task => {
          const createdAt = new Date(task.createdAt);
          const ageInDays = Math.round(Math.abs((today - createdAt) / (24 * 60 * 60 * 1000)));
          
          return {
            ...task,
            ageInDays
          };
        });
      }
    }),
    {
      name: 'eco-auto-tasks',
      partialize: (state) => ({
        tasks: state.tasks,
        projects: state.projects,
        categories: state.categories,
        filters: state.filters
      }),
    }
  )
);