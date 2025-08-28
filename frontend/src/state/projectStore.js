import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCategoryStore } from './categoryStore';

const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [
        {
          id: 1,
          name: 'E-Commerce Platform',
          customer: 'ShopFast Inc',
          categoryId: 1, // Product Design category
          category: 'Product Design',
          quantity: 15, // Number of deliverable units
          promiseDays: 45, // Total project timeline
          roadmapId: 1, // Added roadmapId
          status: 'in_progress',
          progress: 78,
          startDate: '2024-08-01',
          deadline: '2024-09-15',
          assignedTeam: ['Sarah M.', 'John D.', 'Mike R.'],
          priority: 'high',
          description: 'Full-featured e-commerce platform with payment integration',
          budget: 75000,
          estimatedTATHours: 16, // From category default
          perUnitTAT: 40, // Calculated from roadmap steps
          milestones: [
            { id: 1, name: 'Requirements Analysis', completed: true, dueDate: '2024-08-05' },
            { id: 2, name: 'UI/UX Design', completed: true, dueDate: '2024-08-15' },
            { id: 3, name: 'Frontend Development', completed: false, dueDate: '2024-08-30' },
            { id: 4, name: 'Backend Development', completed: false, dueDate: '2024-09-05' },
            { id: 5, name: 'Testing & Deployment', completed: false, dueDate: '2024-09-15' }
          ]
        },
        {
          id: 2,
          name: 'Mobile Banking App',
          customer: 'SecureBank Ltd',
          categoryId: 1, // Product Design category
          category: 'Product Design',
          quantity: 8,
          promiseDays: 60,
          roadmapId: 2, // Added roadmapId
          status: 'in_progress',
          progress: 45,
          startDate: '2024-07-15',
          deadline: '2024-10-01',
          assignedTeam: ['Lisa K.', 'Tom W.'],
          priority: 'critical',
          description: 'Secure mobile banking application with biometric authentication',
          budget: 120000,
          estimatedTATHours: 16,
          perUnitTAT: 29, // Calculated from roadmap steps
          milestones: [
            { id: 1, name: 'Security Architecture', completed: true, dueDate: '2024-07-25' },
            { id: 2, name: 'Core Features', completed: false, dueDate: '2024-08-30' },
            { id: 3, name: 'Security Testing', completed: false, dueDate: '2024-09-15' },
            { id: 4, name: 'Launch Preparation', completed: false, dueDate: '2024-10-01' }
          ]
        },
        {
          id: 3,
          name: 'Marketing Campaign',
          customer: 'RetailPlus Corp',
          categoryId: 3, // Marketing category
          category: 'Marketing',
          quantity: 12,
          promiseDays: 30,
          roadmapId: 1, // Added roadmapId
          status: 'completed',
          progress: 100,
          startDate: '2024-07-20',
          deadline: '2024-08-20',
          assignedTeam: ['Alex P.', 'Jenny L.'],
          priority: 'medium',
          description: 'Comprehensive marketing campaign for new product launch',
          budget: 45000,
          estimatedTATHours: 12,
          perUnitTAT: 40, // Calculated from roadmap steps
          milestones: [
            { id: 1, name: 'Strategy Development', completed: true, dueDate: '2024-07-25' },
            { id: 2, name: 'Content Creation', completed: true, dueDate: '2024-08-10' },
            { id: 3, name: 'Campaign Launch', completed: true, dueDate: '2024-08-15' },
            { id: 4, name: 'Results Analysis', completed: true, dueDate: '2024-08-20' }
          ]
        }
      ],
      
      // Project categories
      categories: [
        'Web Development',
        'Mobile Development',
        'Enterprise Software',
        'UI/UX Design',
        'Data Analytics',
        'DevOps & Infrastructure',
        'Quality Assurance',
        'Marketing & SEO'
      ],
      
      // Add new project with category integration
      addProject: (projectData) => {
        // Get category details if categoryId provided
        let categoryInfo = {};
        if (projectData.categoryId) {
          try {
            const categoryStore = useCategoryStore.getState();
            const category = categoryStore.getCategoryById(projectData.categoryId);
            if (category) {
              categoryInfo = {
                categoryId: category.id,
                category: category.name,
                estimatedTATHours: category.defaultTATHours,
                budgetMultiplier: category.budgetMultiplier,
                requiredSkills: category.requiredSkills
              };
            }
          } catch (error) {
            console.warn('Category store not available, using provided category name');
            categoryInfo = {
              category: projectData.category || 'General'
            };
          }
        }

        // Use perUnitTAT passed from the component
        let calculatedTAT = projectData.perUnitTAT || 5; // Default value

        const newProject = {
          id: Date.now(),
          ...projectData,
          ...categoryInfo,
          perUnitTAT: calculatedTAT, // Automatically calculated TAT
          status: 'planning',
          progress: 0,
          startDate: new Date().toISOString().split('T')[0],
          milestones: [],
          createdAt: new Date().toISOString(),
          createdBy: projectData.createdBy || 'Manager'
        };
        
        set((state) => ({
          projects: [...state.projects, newProject]
        }));
        
        // Update category metrics if category store is available
        try {
          const categoryStore = useCategoryStore.getState();
          if (newProject.categoryId && categoryStore.updateCategoryMetrics) {
            const currentMetrics = categoryStore.categoryMetrics[newProject.categoryId] || {
              totalProjects: 0,
              completedProjects: 0,
              averageEfficiency: 100,
              totalRevenue: 0
            };
            
            categoryStore.updateCategoryMetrics(newProject.categoryId, {
              ...currentMetrics,
              totalProjects: currentMetrics.totalProjects + 1
            });
          }
        } catch (error) {
          console.warn('Could not update category metrics');
        }
        
        return newProject.id;
      },
      
      // Update project
      updateProject: (projectId, updates) => {
        set((state) => ({
          projects: state.projects.map(project => 
            project.id === projectId 
              ? { ...project, ...updates }
              : project
          )
        }));
      },
      
      // Delete project
      deleteProject: (projectId) => {
        set((state) => ({
          projects: state.projects.filter(project => project.id !== projectId)
        }));
      },
      
      // Get project by ID
      getProject: (projectId) => {
        return get().projects.find(project => project.id === projectId);
      },
      
      // Get projects by status
      getProjectsByStatus: (status) => {
        return get().projects.filter(project => project.status === status);
      },
      
      // Get overdue projects
      getOverdueProjects: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().projects.filter(project => 
          project.status !== 'completed' && project.deadline < today
        );
      },
      
      // Calculate project metrics
      getProjectMetrics: () => {
        const projects = get().projects;
        const total = projects.length;
        const completed = projects.filter(p => p.status === 'completed').length;
        const inProgress = projects.filter(p => p.status === 'in_progress').length;
        const overdue = get().getOverdueProjects().length;
        const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
        
        return {
          total,
          completed,
          inProgress,
          overdue,
          totalBudget,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      },

      // Get projects by category
      getProjectsByCategory: (categoryId) => {
        return get().projects.filter(project => project.categoryId === categoryId);
      },

      // Get category-wise project statistics
      getCategoryWiseStats: () => {
        const projects = get().projects;
        const categoryStats = {};
        
        projects.forEach(project => {
          const categoryId = project.categoryId || 'uncategorized';
          const categoryName = project.category || 'Uncategorized';
          
          if (!categoryStats[categoryId]) {
            categoryStats[categoryId] = {
              categoryId,
              categoryName,
              totalProjects: 0,
              completedProjects: 0,
              inProgressProjects: 0,
              totalBudget: 0,
              averageProgress: 0
            };
          }
          
          const stats = categoryStats[categoryId];
          stats.totalProjects++;
          stats.totalBudget += project.budget || 0;
          
          if (project.status === 'completed') {
            stats.completedProjects++;
          } else if (project.status === 'in_progress') {
            stats.inProgressProjects++;
          }
        });
        
        // Calculate average progress for each category
        Object.values(categoryStats).forEach(stats => {
          const categoryProjects = projects.filter(p => 
            (p.categoryId || 'uncategorized') === stats.categoryId
          );
          
          if (categoryProjects.length > 0) {
            stats.averageProgress = Math.round(
              categoryProjects.reduce((sum, p) => sum + p.progress, 0) / categoryProjects.length
            );
            stats.completionRate = Math.round(
              (stats.completedProjects / stats.totalProjects) * 100
            );
          }
        });
        
        return Object.values(categoryStats);
      },

      // Update project with category change
      updateProjectCategory: (projectId, categoryId) => {
        try {
          const categoryStore = useCategoryStore.getState();
          const category = categoryStore.getCategoryById(categoryId);
          
          if (category) {
            get().updateProject(projectId, {
              categoryId: category.id,
              category: category.name,
              estimatedTATHours: category.defaultTATHours,
              budgetMultiplier: category.budgetMultiplier,
              requiredSkills: category.requiredSkills
            });
            return true;
          }
        } catch (error) {
          console.warn('Could not update project category:', error);
        }
        return false;
      },

      // Get available categories for project creation
      getAvailableCategories: () => {
        try {
          const categoryStore = useCategoryStore.getState();
          return categoryStore.getActiveCategories();
        } catch (error) {
          console.warn('Category store not available, using fallback categories');
          return get().categories.map((name, index) => ({
            id: index + 1,
            name,
            description: `${name} projects`,
            defaultTATHours: 8,
            budgetMultiplier: 1.0
          }));
        }
      },

      // Validate project data with category requirements
      validateProjectData: (projectData) => {
        const errors = [];
        
        // Basic validations
        if (!projectData.name || projectData.name.trim().length < 3) {
          errors.push('Project name must be at least 3 characters long');
        }
        
        if (!projectData.customer || projectData.customer.trim().length < 2) {
          errors.push('Customer name is required');
        }
        
        if (!projectData.categoryId && !projectData.category) {
          errors.push('Project category is required');
        }
        
        if (!projectData.quantity || projectData.quantity < 1) {
          errors.push('Quantity must be at least 1');
        }
        
        if (!projectData.promiseDays || projectData.promiseDays < 1) {
          errors.push('Promise days must be at least 1');
        }
        
        if (projectData.budget && projectData.budget < 0) {
          errors.push('Budget cannot be negative');
        }
        
        // Category-specific validations
        if (projectData.categoryId) {
          try {
            const categoryStore = useCategoryStore.getState();
            const category = categoryStore.getCategoryById(projectData.categoryId);
            
            if (!category) {
              errors.push('Selected category does not exist');
            } else {
              // Check if required skills are mentioned
              const requiredSkills = category.requiredSkills || [];
              if (requiredSkills.length > 0 && projectData.description) {
                const hasSkillMention = requiredSkills.some(skill => 
                  projectData.description.toLowerCase().includes(skill.toLowerCase())
                );
                
                if (!hasSkillMention) {
                  errors.push(`Project should mention required skills: ${requiredSkills.join(', ')}`);
                }
              }
            }
          } catch (error) {
            console.warn('Could not validate category requirements');
          }
        }
        
        return {
          isValid: errors.length === 0,
          errors
        };
      }
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        projects: state.projects,
        categories: state.categories
      })
    }
  )
);

export { useProjectStore };