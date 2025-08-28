import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isEmployeeUnavailable as checkEmployeeUnavailable } from '../utils/employeeAvailability';

const useTaskGeneratorStore = create(
  persist(
    (set, get) => ({
      // Generation templates and rules
      generationRules: {
        defaultAssignmentStrategy: 'round_robin', // round_robin, workload_based, role_based, manual
        taskNamingPattern: '{stepName} - {projectName}',
        descriptionTemplate: '{stepDescription} for {projectName} project ({customerName})',
        estimatedHoursCalculation: 'roadmap_sla', // roadmap_sla, historical_average, manual
        autoAssignment: true,
        sequentialTaskCreation: true, // Create tasks in roadmap order
        parallelTasksAllowed: false
      },
      
      // Task generation history
      generationHistory: [
        {
          id: 1,
          projectId: 1,
          projectName: 'E-Commerce Platform',
          customerId: 1,
          customerName: 'ShopFast Inc',
          roadmapId: 1,
          roadmapName: 'Web Development Roadmap',
          quantity: 1,
          tasksGenerated: 6,
          generatedBy: 'Manager',
          timestamp: '2024-08-20T10:00:00Z',
          strategy: 'round_robin',
          taskIds: [1, 3, 5, 6, 7, 8]
        },
        {
          id: 2,
          projectId: 2,
          projectName: 'Mobile Banking App',
          customerId: 2,
          customerName: 'SecureBank Ltd',
          roadmapId: 2,
          roadmapName: 'Mobile App Development',
          quantity: 1,
          tasksGenerated: 4,
          generatedBy: 'System',
          timestamp: '2024-08-22T14:30:00Z',
          strategy: 'role_based',
          taskIds: [2, 4, 9, 10]
        }
      ],
      
      // Assignment strategies
      assignmentStrategies: {
        round_robin: {
          name: 'Round Robin',
          description: 'Distribute tasks evenly among team members',
          implementation: (employees, tasks, currentTasks, attendanceRecords) => {
            // Filter out employees who are currently unavailable
            const availableEmployees = employees.filter(emp => 
              emp.isActive && !get().isEmployeeUnavailable(emp.id, attendanceRecords)
            );
            
            if (availableEmployees.length === 0) {
              console.warn('No available employees for task assignment');
              return tasks.map(task => ({
                ...task,
                assigneeId: null,
                assigneeName: 'Unassigned',
                assigneeRole: 'any'
              }));
            }
            
            let currentIndex = 0;
            
            return tasks.map(task => {
              const assignee = availableEmployees[currentIndex % availableEmployees.length];
              currentIndex++;
              return {
                ...task,
                assigneeId: assignee.id,
                assigneeName: assignee.name,
                assigneeRole: assignee.role
              };
            });
          }
        },
        workload_based: {
          name: 'Workload Based',
          description: 'Assign to team members with least current workload',
          implementation: (employees, tasks, currentTasks, attendanceRecords) => {
            // Filter out employees who are currently unavailable
            const availableEmployees = employees.filter(emp => 
              emp.isActive && !get().isEmployeeUnavailable(emp.id, attendanceRecords)
            );
            
            if (availableEmployees.length === 0) {
              console.warn('No available employees for task assignment');
              return tasks.map(task => ({
                ...task,
                assigneeId: null,
                assigneeName: 'Unassigned',
                assigneeRole: 'any'
              }));
            }
            
            const getWorkload = (employeeId) => {
              return currentTasks.filter(task => 
                task.assigneeId === employeeId && 
                ['planned', 'in_progress'].includes(task.status)
              ).length;
            };
            
            return tasks.map(task => {
              // Sort available employees by workload (ascending)
              const sortedEmployees = availableEmployees.sort((a, b) => 
                getWorkload(a.id) - getWorkload(b.id)
              );
              
              const assignee = sortedEmployees[0];
              return {
                ...task,
                assigneeId: assignee.id,
                assigneeName: assignee.name,
                assigneeRole: assignee.role
              };
            });
          }
        },
        role_based: {
          name: 'Role Based',
          description: 'Assign based on required role for each roadmap step',
          implementation: (employees, tasks, currentTasks, attendanceRecords) => {
            // Filter out employees who are currently unavailable
            const availableEmployees = employees.filter(emp => 
              emp.isActive && !get().isEmployeeUnavailable(emp.id, attendanceRecords)
            );
            
            if (availableEmployees.length === 0) {
              console.warn('No available employees for task assignment');
              return tasks.map(task => ({
                ...task,
                assigneeId: null,
                assigneeName: 'Unassigned',
                assigneeRole: 'any'
              }));
            }
            
            return tasks.map(task => {
              // Find employees with the required role
              const suitableEmployees = availableEmployees.filter(emp => 
                task.requiredRole === 'any' || emp.role.toLowerCase().includes(task.requiredRole.toLowerCase())
              );
              
              // If no suitable employees found, assign to any available employee
              const assignee = suitableEmployees.length > 0 
                ? suitableEmployees[Math.floor(Math.random() * suitableEmployees.length)] 
                : availableEmployees[0];
              
              return {
                ...task,
                assigneeId: assignee.id,
                assigneeName: assignee.name,
                assigneeRole: assignee.role
              };
            });
          }
        }
      },
      
      // Check if an employee is currently unavailable
      isEmployeeUnavailable: (employeeId, attendanceRecords) => {
        return checkEmployeeUnavailable(employeeId, attendanceRecords);
      },
      
      // Generate tasks for a project
      generateTasksForProject: (project, roadmap, employees, currentTasks = [], attendanceRecords = []) => {
        const { generationRules, assignmentStrategies } = get();
        const generatedTasks = [];
        
        // Create tasks for each quantity
        for (let unitIndex = 0; unitIndex < project.quantity; unitIndex++) {
          const unitSuffix = project.quantity > 1 ? ` (Unit ${unitIndex + 1})` : '';
          
          // Create tasks for each roadmap step
          roadmap.steps.forEach((step, stepIndex) => {
            const task = {
              id: Date.now() + stepIndex + (unitIndex * 1000), // Unique ID
              title: generationRules.taskNamingPattern
                .replace('{stepName}', step.name)
                .replace('{projectName}', project.name + unitSuffix),
              description: generationRules.descriptionTemplate
                .replace('{stepDescription}', step.description || step.name)
                .replace('{projectName}', project.name + unitSuffix)
                .replace('{customerName}', project.customerName),
              projectId: project.id,
              projectName: project.name + unitSuffix,
              customerId: project.customerId,
              customerName: project.customerName,
              roadmapStepId: step.id,
              roadmapStepName: step.name,
              requiredRole: step.role || 'any',
              machine: step.machine || 'any',
              estimatedHours: step.slaHours || 8,
              status: 'planned',
              priority: get().calculateTaskPriority(project, step, stepIndex),
              tags: [project.category, step.name.toLowerCase().replace(/\s+/g, '_')],
              startDate: get().calculateStartDate(project, stepIndex, step.slaHours),
              dueDate: get().calculateDueDate(project, stepIndex, step.slaHours),
              progress: 0,
              actualHours: 0,
              notes: '',
              attachments: [],
              createdDate: new Date().toISOString().split('T')[0],
              completedDate: null,
              unitIndex: unitIndex,
              stepIndex: stepIndex,
              dependencies: step.dependencies || []
            };
            
            generatedTasks.push(task);
          });
        }
        
        // Apply assignment strategy with attendance data
        const strategy = assignmentStrategies[generationRules.defaultAssignmentStrategy];
        const assignedTasks = strategy.implementation(employees, generatedTasks, currentTasks, attendanceRecords);
        
        // Record generation history
        const historyRecord = {
          id: Date.now(),
          projectId: project.id,
          projectName: project.name,
          customerId: project.customerId,
          customerName: project.customerName,
          roadmapId: roadmap.id,
          roadmapName: roadmap.name,
          quantity: project.quantity,
          tasksGenerated: assignedTasks.length,
          generatedBy: 'User', // Should come from auth
          timestamp: new Date().toISOString(),
          strategy: generationRules.defaultAssignmentStrategy,
          taskIds: assignedTasks.map(task => task.id)
        };
        
        set((state) => ({
          generationHistory: [historyRecord, ...state.generationHistory]
        }));
        
        return {
          tasks: assignedTasks,
          history: historyRecord,
          summary: {
            totalTasks: assignedTasks.length,
            tasksByRole: get().groupTasksByRole(assignedTasks),
            estimatedTotalHours: assignedTasks.reduce((sum, task) => sum + task.estimatedHours, 0),
            projectDuration: get().calculateProjectDuration(assignedTasks)
          }
        };
      },
      
      // Calculate task priority based on project and step
      calculateTaskPriority: (project, step, stepIndex) => {
        // Earlier steps get higher priority
        if (stepIndex === 0) return 'critical';
        if (stepIndex <= 2) return 'high';
        if (stepIndex <= 4) return 'medium';
        return 'low';
      },
      
      // Calculate start date based on project timeline and step sequence
      calculateStartDate: (project, stepIndex, stepHours) => {
        const projectStart = new Date(project.startDate || new Date());
        const workingDaysOffset = stepIndex * Math.ceil(stepHours / 8);
        
        // Add working days (skip weekends)
        let currentDate = new Date(projectStart);
        let addedDays = 0;
        
        while (addedDays < workingDaysOffset) {
          currentDate.setDate(currentDate.getDate() + 1);
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Not weekend
            addedDays++;
          }
        }
        
        return currentDate.toISOString().split('T')[0];
      },
      
      // Calculate due date based on start date and estimated hours
      calculateDueDate: (project, stepIndex, stepHours) => {
        const startDate = new Date(get().calculateStartDate(project, stepIndex, stepHours));
        const workingDaysNeeded = Math.ceil(stepHours / 8);
        
        let currentDate = new Date(startDate);
        let addedDays = 0;
        
        while (addedDays < workingDaysNeeded) {
          currentDate.setDate(currentDate.getDate() + 1);
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            addedDays++;
          }
        }
        
        return currentDate.toISOString().split('T')[0];
      },
      
      // Group tasks by required role
      groupTasksByRole: (tasks) => {
        return tasks.reduce((groups, task) => {
          const role = task.assigneeRole || task.requiredRole || 'Unassigned';
          groups[role] = (groups[role] || 0) + 1;
          return groups;
        }, {});
      },
      
      // Calculate project duration in working days
      calculateProjectDuration: (tasks) => {
        if (tasks.length === 0) return 0;
        
        const startDates = tasks.map(task => new Date(task.startDate));
        const dueDates = tasks.map(task => new Date(task.dueDate));
        
        const projectStart = new Date(Math.min(...startDates));
        const projectEnd = new Date(Math.max(...dueDates));
        
        // Calculate working days between start and end
        let workingDays = 0;
        let currentDate = new Date(projectStart);
        
        while (currentDate <= projectEnd) {
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            workingDays++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return workingDays;
      },
      
      // Bulk generate tasks for multiple projects
      bulkGenerateTasksForProjects: (projects, roadmaps, employees) => {
        const results = [];
        
        projects.forEach(project => {
          const roadmap = roadmaps.find(r => r.id === project.roadmapId);
          if (roadmap) {
            const result = get().generateTasksForProject(project, roadmap, employees);
            results.push(result);
          }
        });
        
        return {
          results,
          summary: {
            totalProjects: projects.length,
            totalTasks: results.reduce((sum, r) => sum + r.tasks.length, 0),
            totalEstimatedHours: results.reduce((sum, r) => sum + r.summary.estimatedTotalHours, 0)
          }
        };
      },
      
      // Update generation rules
      updateGenerationRules: (newRules) => {
        set((state) => ({
          generationRules: { ...state.generationRules, ...newRules }
        }));
      },
      
      // Get generation statistics
      getGenerationStats: () => {
        const { generationHistory } = get();
        
        const totalGenerations = generationHistory.length;
        const totalTasksGenerated = generationHistory.reduce((sum, h) => sum + h.tasksGenerated, 0);
        const averageTasksPerGeneration = totalGenerations > 0 ? totalTasksGenerated / totalGenerations : 0;
        
        const strategyUsage = generationHistory.reduce((stats, h) => {
          stats[h.strategy] = (stats[h.strategy] || 0) + 1;
          return stats;
        }, {});
        
        const recentGenerations = generationHistory.slice(0, 5);
        
        return {
          totalGenerations,
          totalTasksGenerated,
          averageTasksPerGeneration: Math.round(averageTasksPerGeneration * 10) / 10,
          strategyUsage,
          recentGenerations
        };
      },
      
      // Regenerate tasks for existing project (useful for changes)
      regenerateTasksForProject: (projectId, newRoadmapId, employees, currentTasks) => {
        // This would typically involve removing old tasks and creating new ones
        // For now, we'll just generate new tasks
        const project = { id: projectId }; // Would get from project store
        const roadmap = { id: newRoadmapId }; // Would get from roadmap store
        
        return get().generateTasksForProject(project, roadmap, employees, currentTasks);
      },
      
      // Validate project readiness for task generation
      validateProjectForGeneration: (project, roadmap) => {
        const errors = [];
        const warnings = [];
        
        if (!project.name) errors.push('Project name is required');
        if (!project.customerId) errors.push('Customer must be selected');
        if (!project.quantity || project.quantity < 1) errors.push('Quantity must be at least 1');
        if (!roadmap || !roadmap.steps || roadmap.steps.length === 0) {
          errors.push('Roadmap must have at least one step');
        }
        
        if (project.quantity > 10) {
          warnings.push('Large quantity may generate many tasks');
        }
        
        if (roadmap && roadmap.steps) {
          const stepsWithoutSLA = roadmap.steps.filter(step => !step.slaHours);
          if (stepsWithoutSLA.length > 0) {
            warnings.push(`${stepsWithoutSLA.length} steps missing SLA hours`);
          }
        }
        
        return {
          isValid: errors.length === 0,
          errors,
          warnings
        };
      }
    }),
    {
      name: 'task-generator-storage',
      partialize: (state) => ({
        generationHistory: state.generationHistory,
        generationRules: state.generationRules
      })
    }
  )
);

export { useTaskGeneratorStore };

// The isEmployeeUnavailable function is now exported from the utility module
// Import it from '../utils/employeeAvailability' instead
