import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCategoryStore = create(
  persist(
    (set, get) => ({
      // Predefined project categories
      categories: [
        {
          id: 1,
          name: 'Product Design',
          description: 'Design and prototyping of new products and features',
          color: '#6366f1', // Indigo
          icon: 'Palette',
          isActive: true,
          createdAt: '2024-08-20',
          createdBy: 'System',
          defaultTATHours: 16,
          requiredSkills: ['Design', 'Prototyping', 'User Research'],
          budgetMultiplier: 1.2
        },
        {
          id: 2,
          name: 'Production',
          description: 'Manufacturing and production-related activities',
          color: '#059669', // Emerald
          icon: 'Factory',
          isActive: true,
          createdAt: '2024-08-20',
          createdBy: 'System',
          defaultTATHours: 8,
          requiredSkills: ['Manufacturing', 'Quality Control', 'Operations'],
          budgetMultiplier: 1.0
        },
        {
          id: 3,
          name: 'Marketing',
          description: 'Marketing campaigns, content creation, and promotional activities',
          color: '#dc2626', // Red
          icon: 'Megaphone',
          isActive: true,
          createdAt: '2024-08-20',
          createdBy: 'System',
          defaultTATHours: 12,
          requiredSkills: ['Marketing', 'Content Creation', 'Social Media'],
          budgetMultiplier: 1.1
        },
        {
          id: 4,
          name: 'Sales',
          description: 'Sales activities, client meetings, and revenue generation',
          color: '#ca8a04', // Yellow
          icon: 'TrendingUp',
          isActive: true,
          createdAt: '2024-08-20',
          createdBy: 'System',
          defaultTATHours: 6,
          requiredSkills: ['Sales', 'Client Relations', 'Negotiation'],
          budgetMultiplier: 1.3
        },
        {
          id: 5,
          name: 'Internal Training',
          description: 'Employee training, skill development, and knowledge sharing',
          color: '#7c3aed', // Violet
          icon: 'GraduationCap',
          isActive: true,
          createdAt: '2024-08-20',
          createdBy: 'System',
          defaultTATHours: 4,
          requiredSkills: ['Training', 'Knowledge Transfer', 'Mentoring'],
          budgetMultiplier: 0.8
        }
      ],

      // Category performance metrics
      categoryMetrics: {
        1: { totalProjects: 12, completedProjects: 8, averageEfficiency: 115, totalRevenue: 450000 },
        2: { totalProjects: 25, completedProjects: 20, averageEfficiency: 98, totalRevenue: 780000 },
        3: { totalProjects: 18, completedProjects: 15, averageEfficiency: 105, totalRevenue: 320000 },
        4: { totalProjects: 30, completedProjects: 28, averageEfficiency: 125, totalRevenue: 950000 },
        5: { totalProjects: 8, completedProjects: 6, averageEfficiency: 90, totalRevenue: 120000 }
      },

      // Get all active categories
      getActiveCategories: () => {
        return get().categories.filter(category => category.isActive);
      },

      // Get category by ID
      getCategoryById: (id) => {
        return get().categories.find(category => category.id === id);
      },

      // Get category by name
      getCategoryByName: (name) => {
        return get().categories.find(category => 
          category.name.toLowerCase() === name.toLowerCase()
        );
      },

      // Create new category
      createCategory: (categoryData) => {
        const newCategory = {
          id: Date.now(),
          name: categoryData.name,
          description: categoryData.description || '',
          color: categoryData.color || '#6b7280',
          icon: categoryData.icon || 'Folder',
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: categoryData.createdBy || 'Admin',
          defaultTATHours: categoryData.defaultTATHours || 8,
          requiredSkills: categoryData.requiredSkills || [],
          budgetMultiplier: categoryData.budgetMultiplier || 1.0
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
          categoryMetrics: {
            ...state.categoryMetrics,
            [newCategory.id]: {
              totalProjects: 0,
              completedProjects: 0,
              averageEfficiency: 100,
              totalRevenue: 0
            }
          }
        }));

        return newCategory;
      },

      // Update existing category
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map(category =>
            category.id === id 
              ? { 
                  ...category, 
                  ...updates,
                  updatedAt: new Date().toISOString().split('T')[0]
                }
              : category
          )
        }));
      },

      // Delete category (soft delete by setting isActive to false)
      deleteCategory: (id) => {
        // Check if category is being used in projects
        const isInUse = get().isCategoryInUse(id);
        
        if (isInUse) {
          throw new Error('Cannot delete category that is currently being used in projects');
        }

        set((state) => ({
          categories: state.categories.map(category =>
            category.id === id 
              ? { ...category, isActive: false, deletedAt: new Date().toISOString().split('T')[0] }
              : category
          )
        }));
      },

      // Check if category is being used in projects
      isCategoryInUse: (categoryId) => {
        // This would check against the project store
        // For now, we'll assume it's safe to delete
        return false;
      },

      // Update category metrics
      updateCategoryMetrics: (categoryId, metrics) => {
        set((state) => ({
          categoryMetrics: {
            ...state.categoryMetrics,
            [categoryId]: {
              ...state.categoryMetrics[categoryId],
              ...metrics
            }
          }
        }));
      },

      // Get category performance analytics
      getCategoryAnalytics: () => {
        const { categories, categoryMetrics } = get();
        
        return categories
          .filter(cat => cat.isActive)
          .map(category => {
            const metrics = categoryMetrics[category.id] || {
              totalProjects: 0,
              completedProjects: 0,
              averageEfficiency: 100,
              totalRevenue: 0
            };
            
            const completionRate = metrics.totalProjects > 0 
              ? Math.round((metrics.completedProjects / metrics.totalProjects) * 100)
              : 0;
            
            const averageRevenue = metrics.completedProjects > 0
              ? Math.round(metrics.totalRevenue / metrics.completedProjects)
              : 0;
            
            return {
              ...category,
              ...metrics,
              completionRate,
              averageRevenue,
              performanceGrade: get().calculateCategoryGrade(metrics)
            };
          })
          .sort((a, b) => b.totalRevenue - a.totalRevenue);
      },

      // Calculate category performance grade
      calculateCategoryGrade: (metrics) => {
        const completionRate = metrics.totalProjects > 0 
          ? (metrics.completedProjects / metrics.totalProjects) * 100
          : 0;
        
        const efficiency = metrics.averageEfficiency || 0;
        
        // Weighted score: 40% completion rate, 60% efficiency
        const score = (completionRate * 0.4) + (efficiency * 0.6);
        
        if (score >= 110) return 'A+';
        if (score >= 100) return 'A';
        if (score >= 90) return 'B+';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C+';
        if (score >= 60) return 'C';
        return 'D';
      },

      // Get category usage statistics
      getCategoryUsageStats: () => {
        const { categories, categoryMetrics } = get();
        
        const totalProjects = Object.values(categoryMetrics)
          .reduce((sum, metrics) => sum + metrics.totalProjects, 0);
        
        const totalRevenue = Object.values(categoryMetrics)
          .reduce((sum, metrics) => sum + metrics.totalRevenue, 0);
        
        return {
          totalCategories: categories.filter(cat => cat.isActive).length,
          totalProjects,
          totalRevenue,
          averageProjectsPerCategory: Math.round(totalProjects / categories.filter(cat => cat.isActive).length),
          mostPopularCategory: get().getMostPopularCategory(),
          mostProfitableCategory: get().getMostProfitableCategory()
        };
      },

      // Get most popular category by project count
      getMostPopularCategory: () => {
        const { categories, categoryMetrics } = get();
        
        let maxProjects = 0;
        let popularCategory = null;
        
        categories.filter(cat => cat.isActive).forEach(category => {
          const metrics = categoryMetrics[category.id];
          if (metrics && metrics.totalProjects > maxProjects) {
            maxProjects = metrics.totalProjects;
            popularCategory = category;
          }
        });
        
        return popularCategory;
      },

      // Get most profitable category by revenue
      getMostProfitableCategory: () => {
        const { categories, categoryMetrics } = get();
        
        let maxRevenue = 0;
        let profitableCategory = null;
        
        categories.filter(cat => cat.isActive).forEach(category => {
          const metrics = categoryMetrics[category.id];
          if (metrics && metrics.totalRevenue > maxRevenue) {
            maxRevenue = metrics.totalRevenue;
            profitableCategory = category;
          }
        });
        
        return profitableCategory;
      },

      // Validate category data
      validateCategory: (categoryData) => {
        const errors = [];
        
        if (!categoryData.name || categoryData.name.trim().length < 2) {
          errors.push('Category name must be at least 2 characters long');
        }
        
        if (categoryData.name && categoryData.name.length > 50) {
          errors.push('Category name must be less than 50 characters');
        }
        
        if (categoryData.description && categoryData.description.length > 200) {
          errors.push('Description must be less than 200 characters');
        }
        
        if (categoryData.defaultTATHours && (categoryData.defaultTATHours < 1 || categoryData.defaultTATHours > 200)) {
          errors.push('Default TAT hours must be between 1 and 200');
        }
        
        if (categoryData.budgetMultiplier && (categoryData.budgetMultiplier < 0.1 || categoryData.budgetMultiplier > 5.0)) {
          errors.push('Budget multiplier must be between 0.1 and 5.0');
        }
        
        // Check for duplicate names
        const existingCategory = get().getCategoryByName(categoryData.name);
        if (existingCategory && existingCategory.id !== categoryData.id) {
          errors.push('Category name already exists');
        }
        
        return {
          isValid: errors.length === 0,
          errors
        };
      },

      // Import categories from JSON
      importCategories: (categoriesData) => {
        const imported = [];
        const errors = [];
        
        categoriesData.forEach((categoryData, index) => {
          const validation = get().validateCategory(categoryData);
          
          if (validation.isValid) {
            try {
              const newCategory = get().createCategory(categoryData);
              imported.push(newCategory);
            } catch (error) {
              errors.push(`Row ${index + 1}: ${error.message}`);
            }
          } else {
            errors.push(`Row ${index + 1}: ${validation.errors.join(', ')}`);
          }
        });
        
        return {
          imported: imported.length,
          errors
        };
      },

      // Export categories to JSON
      exportCategories: () => {
        return get().categories.filter(cat => cat.isActive);
      }
    }),
    {
      name: 'category-storage',
      partialize: (state) => ({
        categories: state.categories,
        categoryMetrics: state.categoryMetrics
      })
    }
  )
);

export { useCategoryStore };