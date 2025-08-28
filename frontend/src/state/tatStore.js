import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTATStore = create(
  persist(
    (set, get) => ({
      // TAT tracking records
      tatRecords: [
        {
          id: 1,
          projectId: 1,
          projectName: 'E-Commerce Platform',
          customerId: 1,
          customerName: 'ShopFast Inc',
          taskId: 1,
          taskName: 'Design Homepage UI/UX',
          roadmapStepId: 2,
          roadmapStepName: 'UI/UX Design',
          plannedStartDate: '2024-08-20',
          actualStartDate: '2024-08-20',
          plannedEndDate: '2024-08-24',
          actualEndDate: '2024-08-23',
          plannedHours: 8,
          actualHours: 6,
          status: 'completed',
          efficiency: 133, // planned/actual * 100
          timeVariance: -2, // actual - planned (negative = faster)
          dateVariance: -1, // in days
          qualityRating: 4,
          assigneeId: 1,
          assigneeName: 'Sarah M.',
          notes: 'Completed ahead of schedule with excellent quality'
        },
        {
          id: 2,
          projectId: 2,
          projectName: 'Mobile Banking App',
          customerId: 2,
          customerName: 'SecureBank Ltd',
          taskId: 2,
          taskName: 'Database Migration Script',
          roadmapStepId: 4,
          roadmapStepName: 'Backend Development',
          plannedStartDate: '2024-08-22',
          actualStartDate: '2024-08-22',
          plannedEndDate: '2024-08-23',
          actualEndDate: null, // Still in progress
          plannedHours: 4,
          actualHours: 6,
          status: 'overdue',
          efficiency: 67, // Current efficiency based on time spent
          timeVariance: 2,
          dateVariance: 1,
          qualityRating: null,
          assigneeId: 2,
          assigneeName: 'John D.',
          notes: 'Complexity higher than expected'
        }
      ],
      
      // Project-level TAT summaries
      projectTATSummaries: {
        1: {
          projectId: 1,
          projectName: 'E-Commerce Platform',
          totalPlannedHours: 40,
          totalActualHours: 35,
          totalTasks: 6,
          completedTasks: 2,
          overdueTasks: 0,
          averageEfficiency: 115,
          averageQuality: 4.2,
          onTimeDeliveryRate: 100,
          estimatedCompletionDate: '2024-09-15',
          actualCompletionDate: null,
          status: 'in_progress'
        },
        2: {
          projectId: 2,
          projectName: 'Mobile Banking App',
          totalPlannedHours: 32,
          totalActualHours: 28,
          totalTasks: 4,
          completedTasks: 1,
          overdueTasks: 1,
          averageEfficiency: 95,
          averageQuality: 4.0,
          onTimeDeliveryRate: 75,
          estimatedCompletionDate: '2024-09-10',
          actualCompletionDate: null,
          status: 'at_risk'
        }
      },
      
      // Performance benchmarks and targets
      performanceTargets: {
        efficiency: {
          excellent: 120, // 20% better than planned
          good: 100,      // On target
          acceptable: 80, // 20% slower acceptable
          poor: 60        // Below 60% needs attention
        },
        quality: {
          excellent: 4.5,
          good: 4.0,
          acceptable: 3.5,
          poor: 3.0
        },
        onTimeDelivery: {
          excellent: 95,
          good: 90,
          acceptable: 80,
          poor: 70
        }
      },
      
      // Start tracking a task
      startTaskTracking: (taskData) => {
        const record = {
          id: Date.now(),
          projectId: taskData.projectId,
          projectName: taskData.projectName,
          customerId: taskData.customerId,
          customerName: taskData.customerName,
          taskId: taskData.id,
          taskName: taskData.title,
          roadmapStepId: taskData.roadmapStepId,
          roadmapStepName: taskData.roadmapStepName,
          plannedStartDate: taskData.startDate,
          actualStartDate: new Date().toISOString().split('T')[0],
          plannedEndDate: taskData.dueDate,
          actualEndDate: null,
          plannedHours: taskData.estimatedHours,
          actualHours: 0,
          status: 'in_progress',
          efficiency: 0,
          timeVariance: 0,
          dateVariance: 0,
          qualityRating: null,
          assigneeId: taskData.assigneeId,
          assigneeName: taskData.assigneeName,
          notes: ''
        };
        
        set((state) => ({
          tatRecords: [...state.tatRecords, record]
        }));
        
        return record;
      },
      
      // Update task tracking
      updateTaskTracking: (taskId, updates) => {
        set((state) => ({
          tatRecords: state.tatRecords.map(record =>
            record.taskId === taskId 
              ? { 
                  ...record, 
                  ...updates,
                  efficiency: get().calculateEfficiency(record.plannedHours, updates.actualHours || record.actualHours),
                  timeVariance: (updates.actualHours || record.actualHours) - record.plannedHours,
                  dateVariance: updates.actualEndDate 
                    ? get().calculateDateVariance(record.plannedEndDate, updates.actualEndDate)
                    : record.dateVariance
                }
              : record
          )
        }));
        
        // Update project summary
        get().updateProjectSummary(get().tatRecords.find(r => r.taskId === taskId)?.projectId);
      },
      
      // Complete task tracking
      completeTaskTracking: (taskId, finalHours, qualityRating, notes = '') => {
        const currentDate = new Date().toISOString().split('T')[0];
        
        get().updateTaskTracking(taskId, {
          actualEndDate: currentDate,
          actualHours: finalHours,
          qualityRating,
          notes,
          status: 'completed'
        });
        
        // Award efficiency bonuses if applicable
        const record = get().tatRecords.find(r => r.taskId === taskId);
        if (record && record.efficiency > 110) {
          // Could trigger reward system here
          console.log(`Efficiency bonus earned for task ${taskId}: ${record.efficiency}%`);
        }
      },
      
      // Calculate efficiency percentage
      calculateEfficiency: (plannedHours, actualHours) => {
        if (actualHours === 0) return 0;
        return Math.round((plannedHours / actualHours) * 100);
      },
      
      // Calculate date variance in days
      calculateDateVariance: (plannedDate, actualDate) => {
        const planned = new Date(plannedDate);
        const actual = new Date(actualDate);
        const diffTime = actual - planned;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      
      // Update project-level summary
      updateProjectSummary: (projectId) => {
        const projectRecords = get().tatRecords.filter(r => r.projectId === projectId);
        
        if (projectRecords.length === 0) return;
        
        const completedRecords = projectRecords.filter(r => r.status === 'completed');
        const overdueRecords = projectRecords.filter(r => r.status === 'overdue');
        
        const totalPlannedHours = projectRecords.reduce((sum, r) => sum + r.plannedHours, 0);
        const totalActualHours = projectRecords.reduce((sum, r) => sum + r.actualHours, 0);
        
        const averageEfficiency = completedRecords.length > 0
          ? Math.round(completedRecords.reduce((sum, r) => sum + r.efficiency, 0) / completedRecords.length)
          : 0;
        
        const averageQuality = completedRecords.filter(r => r.qualityRating).length > 0
          ? completedRecords
              .filter(r => r.qualityRating)
              .reduce((sum, r) => sum + r.qualityRating, 0) / completedRecords.filter(r => r.qualityRating).length
          : 0;
        
        const onTimeDeliveryRate = projectRecords.length > 0
          ? Math.round(((projectRecords.length - overdueRecords.length) / projectRecords.length) * 100)
          : 100;
        
        const summary = {
          projectId,
          projectName: projectRecords[0].projectName,
          totalPlannedHours,
          totalActualHours,
          totalTasks: projectRecords.length,
          completedTasks: completedRecords.length,
          overdueTasks: overdueRecords.length,
          averageEfficiency,
          averageQuality: Math.round(averageQuality * 10) / 10,
          onTimeDeliveryRate,
          estimatedCompletionDate: get().calculateEstimatedCompletion(projectRecords),
          actualCompletionDate: get().calculateActualCompletion(projectRecords),
          status: get().calculateProjectStatus(averageEfficiency, onTimeDeliveryRate, overdueRecords.length)
        };
        
        set((state) => ({
          projectTATSummaries: {
            ...state.projectTATSummaries,
            [projectId]: summary
          }
        }));
      },
      
      // Calculate estimated project completion
      calculateEstimatedCompletion: (projectRecords) => {
        const inProgressRecords = projectRecords.filter(r => r.status === 'in_progress');
        if (inProgressRecords.length === 0) return null;
        
        // Simple estimation based on current progress
        const latestEndDate = Math.max(...projectRecords.map(r => new Date(r.plannedEndDate || r.actualEndDate || new Date())));
        return new Date(latestEndDate).toISOString().split('T')[0];
      },
      
      // Calculate actual project completion
      calculateActualCompletion: (projectRecords) => {
        const allCompleted = projectRecords.every(r => r.status === 'completed');
        if (!allCompleted) return null;
        
        const latestCompletion = Math.max(...projectRecords.map(r => new Date(r.actualEndDate)));
        return new Date(latestCompletion).toISOString().split('T')[0];
      },
      
      // Calculate project status
      calculateProjectStatus: (efficiency, onTimeRate, overdueCount) => {
        if (overdueCount > 0 || onTimeRate < 80) return 'at_risk';
        if (efficiency < 80 || onTimeRate < 90) return 'needs_attention';
        if (efficiency > 110 && onTimeRate > 95) return 'excellent';
        return 'on_track';
      },
      
      // Get TAT analytics for dashboard
      getTATAnalytics: () => {
        const { tatRecords, performanceTargets } = get();
        
        const completedTasks = tatRecords.filter(r => r.status === 'completed');
        const overdueTasks = tatRecords.filter(r => r.status === 'overdue');
        const inProgressTasks = tatRecords.filter(r => r.status === 'in_progress');
        
        const averageEfficiency = completedTasks.length > 0
          ? Math.round(completedTasks.reduce((sum, r) => sum + r.efficiency, 0) / completedTasks.length)
          : 0;
        
        const averageQuality = completedTasks.filter(r => r.qualityRating).length > 0
          ? completedTasks
              .filter(r => r.qualityRating)
              .reduce((sum, r) => sum + r.qualityRating, 0) / completedTasks.filter(r => r.qualityRating).length
          : 0;
        
        const onTimeDeliveryRate = tatRecords.length > 0
          ? Math.round(((tatRecords.length - overdueTasks.length) / tatRecords.length) * 100)
          : 100;
        
        return {
          totalTasks: tatRecords.length,
          completedTasks: completedTasks.length,
          overdueTasks: overdueTasks.length,
          inProgressTasks: inProgressTasks.length,
          averageEfficiency,
          averageQuality: Math.round(averageQuality * 10) / 10,
          onTimeDeliveryRate,
          performanceRating: get().calculateOverallPerformance(averageEfficiency, onTimeDeliveryRate, averageQuality),
          trendsData: get().calculateTrends()
        };
      },
      
      // Calculate overall performance rating
      calculateOverallPerformance: (efficiency, onTimeRate, quality) => {
        const { performanceTargets } = get();
        
        let score = 0;
        
        // Efficiency scoring
        if (efficiency >= performanceTargets.efficiency.excellent) score += 3;
        else if (efficiency >= performanceTargets.efficiency.good) score += 2;
        else if (efficiency >= performanceTargets.efficiency.acceptable) score += 1;
        
        // On-time delivery scoring
        if (onTimeRate >= performanceTargets.onTimeDelivery.excellent) score += 3;
        else if (onTimeRate >= performanceTargets.onTimeDelivery.good) score += 2;
        else if (onTimeRate >= performanceTargets.onTimeDelivery.acceptable) score += 1;
        
        // Quality scoring
        if (quality >= performanceTargets.quality.excellent) score += 3;
        else if (quality >= performanceTargets.quality.good) score += 2;
        else if (quality >= performanceTargets.quality.acceptable) score += 1;
        
        const maxScore = 9;
        const percentage = (score / maxScore) * 100;
        
        if (percentage >= 90) return 'excellent';
        if (percentage >= 75) return 'good';
        if (percentage >= 60) return 'acceptable';
        return 'needs_improvement';
      },
      
      // Calculate performance trends
      calculateTrends: () => {
        const { tatRecords } = get();
        const recentRecords = tatRecords
          .filter(r => r.status === 'completed')
          .sort((a, b) => new Date(b.actualEndDate) - new Date(a.actualEndDate))
          .slice(0, 10);
        
        if (recentRecords.length < 2) return { efficiency: 0, quality: 0, onTime: 0 };
        
        const midpoint = Math.floor(recentRecords.length / 2);
        const recent = recentRecords.slice(0, midpoint);
        const older = recentRecords.slice(midpoint);
        
        const recentEfficiency = recent.reduce((sum, r) => sum + r.efficiency, 0) / recent.length;
        const olderEfficiency = older.reduce((sum, r) => sum + r.efficiency, 0) / older.length;
        
        const recentQuality = recent.filter(r => r.qualityRating).reduce((sum, r) => sum + r.qualityRating, 0) / recent.filter(r => r.qualityRating).length;
        const olderQuality = older.filter(r => r.qualityRating).reduce((sum, r) => sum + r.qualityRating, 0) / older.filter(r => r.qualityRating).length;
        
        const recentOnTime = (recent.filter(r => r.dateVariance <= 0).length / recent.length) * 100;
        const olderOnTime = (older.filter(r => r.dateVariance <= 0).length / older.length) * 100;
        
        return {
          efficiency: Math.round(recentEfficiency - olderEfficiency),
          quality: Math.round((recentQuality - olderQuality) * 10) / 10,
          onTime: Math.round(recentOnTime - olderOnTime)
        };
      },
      
      // Get project performance comparison
      getProjectComparison: () => {
        const { projectTATSummaries } = get();
        
        return Object.values(projectTATSummaries)
          .sort((a, b) => b.averageEfficiency - a.averageEfficiency)
          .map(project => ({
            ...project,
            performanceGrade: get().calculateProjectGrade(project)
          }));
      },
      
      // Calculate project grade
      calculateProjectGrade: (project) => {
        const score = (project.averageEfficiency + project.onTimeDeliveryRate + (project.averageQuality * 20)) / 3;
        
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
      },
      
      // Get team member performance
      getTeamMemberPerformance: () => {
        const { tatRecords } = get();
        const memberStats = {};
        
        tatRecords.forEach(record => {
          const memberId = record.assigneeId;
          if (!memberStats[memberId]) {
            memberStats[memberId] = {
              id: memberId,
              name: record.assigneeName,
              totalTasks: 0,
              completedTasks: 0,
              totalEfficiency: 0,
              totalQuality: 0,
              onTimeTasks: 0,
              averageEfficiency: 0,
              averageQuality: 0,
              onTimeRate: 0
            };
          }
          
          const stats = memberStats[memberId];
          stats.totalTasks++;
          
          if (record.status === 'completed') {
            stats.completedTasks++;
            stats.totalEfficiency += record.efficiency;
            
            if (record.qualityRating) {
              stats.totalQuality += record.qualityRating;
            }
            
            if (record.dateVariance <= 0) {
              stats.onTimeTasks++;
            }
          }
        });
        
        // Calculate averages
        Object.values(memberStats).forEach(stats => {
          stats.averageEfficiency = stats.completedTasks > 0 
            ? Math.round(stats.totalEfficiency / stats.completedTasks)
            : 0;
          
          stats.averageQuality = stats.completedTasks > 0
            ? Math.round((stats.totalQuality / stats.completedTasks) * 10) / 10
            : 0;
          
          stats.onTimeRate = stats.totalTasks > 0
            ? Math.round((stats.onTimeTasks / stats.totalTasks) * 100)
            : 100;
        });
        
        return Object.values(memberStats)
          .sort((a, b) => b.averageEfficiency - a.averageEfficiency);
      }
    }),
    {
      name: 'tat-storage',
      partialize: (state) => ({
        tatRecords: state.tatRecords,
        projectTATSummaries: state.projectTATSummaries,
        performanceTargets: state.performanceTargets
      })
    }
  )
);

export { useTATStore };