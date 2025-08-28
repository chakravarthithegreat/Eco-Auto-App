import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRoadmapStore = create(
  persist(
    (set, get) => ({
      roadmaps: [
        {
          id: '1',
          projectId: '1',
          name: 'E-Commerce Platform Development',
          description: 'Complete development workflow for e-commerce platform',
          category: 'Web Development',
          isActive: true,
          createdDate: '2024-08-01',
          stages: [
            {
              id: '1',
              roadmapId: '1',
              index: 0,
              title: 'Requirements Analysis',
              description: 'Gather and analyze project requirements',
              sla: 3, // days
              responsibilityId: 'project_management',
              subResponsibilityId: 'project_planning',
              entryCriteria: ['Project kick-off meeting completed'],
              exitCriteria: ['Requirements document approved'],
              kpis: ['Requirements completeness score', 'Stakeholder approval rate'],
              status: 'DONE', // LOCKED, READY, IN_PROGRESS, REVIEW, DONE, BLOCKED
              assignedUserId: '2',
              taskIds: ['1', '2']
            },
            {
              id: '2',
              roadmapId: '1',
              index: 1,
              title: 'UI/UX Design',
              description: 'Create wireframes and visual designs',
              sla: 5,
              responsibilityId: 'ui_ux_design',
              subResponsibilityId: 'visual_design',
              entryCriteria: ['Requirements document approved'],
              exitCriteria: ['Design prototypes approved'],
              kpis: ['Design approval rate', 'User testing score'],
              status: 'IN_PROGRESS',
              assignedUserId: '1',
              taskIds: ['3', '4']
            },
            {
              id: '3',
              roadmapId: '1',
              index: 2,
              title: 'Frontend Development',
              description: 'Implement user interface components',
              sla: 10,
              responsibilityId: 'frontend_development',
              subResponsibilityId: 'component_development',
              entryCriteria: ['Design prototypes approved'],
              exitCriteria: ['Frontend components implemented'],
              kpis: ['Component completion rate', 'Code quality score'],
              status: 'READY',
              assignedUserId: null,
              taskIds: ['5', '6', '7']
            },
            {
              id: '4',
              roadmapId: '1',
              index: 3,
              title: 'Backend Development',
              description: 'Develop server-side logic and APIs',
              sla: 12,
              responsibilityId: 'backend_development',
              subResponsibilityId: 'api_development',
              entryCriteria: ['Frontend components implemented'],
              exitCriteria: ['API endpoints completed'],
              kpis: ['API completion rate', 'Performance benchmarks'],
              status: 'LOCKED',
              assignedUserId: null,
              taskIds: ['8', '9']
            },
            {
              id: '5',
              roadmapId: '1',
              index: 4,
              title: 'Database Integration',
              description: 'Set up and integrate database systems',
              sla: 3,
              responsibilityId: 'backend_development',
              subResponsibilityId: 'database_design',
              entryCriteria: ['API endpoints completed'],
              exitCriteria: ['Database integration completed'],
              kpis: ['Data integrity score', 'Integration success rate'],
              status: 'LOCKED',
              assignedUserId: null,
              taskIds: ['10']
            },
            {
              id: '6',
              roadmapId: '1',
              index: 5,
              title: 'Testing & QA',
              description: 'Comprehensive testing and quality assurance',
              sla: 5,
              responsibilityId: 'quality_assurance',
              subResponsibilityId: 'automated_testing',
              entryCriteria: ['Database integration completed'],
              exitCriteria: ['All tests passed'],
              kpis: ['Test coverage percentage', 'Bug detection rate'],
              status: 'LOCKED',
              assignedUserId: null,
              taskIds: ['11', '12']
            },
            {
              id: '7',
              roadmapId: '1',
              index: 6,
              title: 'Deployment',
              description: 'Deploy to production environment',
              sla: 2,
              responsibilityId: 'devops',
              subResponsibilityId: 'ci_cd_setup',
              entryCriteria: ['All tests passed'],
              exitCriteria: ['Application deployed successfully'],
              kpis: ['Deployment success rate', 'Downtime minutes'],
              status: 'LOCKED',
              assignedUserId: null,
              taskIds: ['13']
            }
          ]
        },
        {
          id: '2',
          projectId: '2',
          name: 'Mobile App Development',
          description: 'Standard mobile application development process',
          category: 'Mobile Development',
          isActive: true,
          createdDate: '2024-07-15',
          stages: [
            {
              id: '8',
              roadmapId: '2',
              index: 0,
              title: 'Market Research',
              description: 'Research target market and competitors',
              sla: 4,
              responsibilityId: 'project_management',
              subResponsibilityId: 'project_planning',
              entryCriteria: ['Project initiation approved'],
              exitCriteria: ['Market research report completed'],
              kpis: ['Research completeness score', 'Competitor analysis quality'],
              status: 'DONE',
              assignedUserId: '2',
              taskIds: ['14']
            },
            {
              id: '9',
              roadmapId: '2',
              index: 1,
              title: 'App Architecture',
              description: 'Design application architecture',
              sla: 3,
              responsibilityId: 'backend_development',
              subResponsibilityId: 'database_design',
              entryCriteria: ['Market research report completed'],
              exitCriteria: ['Architecture design approved'],
              kpis: ['Design scalability score', 'Security compliance'],
              status: 'DONE',
              assignedUserId: '2',
              taskIds: ['15']
            },
            {
              id: '10',
              roadmapId: '2',
              index: 2,
              title: 'Cross-Platform Development',
              description: 'Develop for iOS and Android',
              sla: 15,
              responsibilityId: 'frontend_development',
              subResponsibilityId: 'component_development',
              entryCriteria: ['Architecture design approved'],
              exitCriteria: ['Core features implemented'],
              kpis: ['Feature completion rate', 'Code quality score'],
              status: 'IN_PROGRESS',
              assignedUserId: '3',
              taskIds: ['16', '17', '18']
            },
            {
              id: '11',
              roadmapId: '2',
              index: 3,
              title: 'App Store Submission',
              description: 'Submit to app stores and handle approval',
              sla: 7,
              responsibilityId: 'devops',
              subResponsibilityId: 'ci_cd_setup',
              entryCriteria: ['Core features implemented'],
              exitCriteria: ['Apps approved in stores'],
              kpis: ['Submission success rate', 'Approval time'],
              status: 'READY',
              assignedUserId: null,
              taskIds: ['19']
            }
          ]
        }
      ],
      
      // Add new roadmap
      addRoadmap: (roadmapData) => {
        const newRoadmap = {
          id: Date.now().toString(),
          ...roadmapData,
          createdDate: new Date().toISOString().split('T')[0],
          stages: []
        };
        set((state) => ({
          roadmaps: [...state.roadmaps, newRoadmap]
        }));
        return newRoadmap.id;
      },
      
      // Update roadmap
      updateRoadmap: (roadmapId, updates) => {
        set((state) => ({
          roadmaps: state.roadmaps.map(roadmap => 
            roadmap.id === roadmapId 
              ? { ...roadmap, ...updates, updatedAt: new Date().toISOString() }
              : roadmap
          )
        }));
      },
      
      // Delete roadmap
      deleteRoadmap: (roadmapId) => {
        set((state) => ({
          roadmaps: state.roadmaps.filter(roadmap => roadmap.id !== roadmapId)
        }));
      },
      
      // Add stage to roadmap
      addStage: (roadmapId, stageData) => {
        const newStage = {
          id: Date.now().toString(),
          roadmapId,
          ...stageData,
          status: 'LOCKED'
        };
        
        set((state) => ({
          roadmaps: state.roadmaps.map(roadmap => 
            roadmap.id === roadmapId 
              ? { ...roadmap, stages: [...roadmap.stages, newStage].sort((a, b) => a.index - b.index) }
              : roadmap
          )
        }));
        return newStage.id;
      },
      
      // Update stage
      updateStage: (roadmapId, stageId, updates) => {
        set((state) => ({
          roadmaps: state.roadmaps.map(roadmap => 
            roadmap.id === roadmapId 
              ? {
                  ...roadmap,
                  stages: roadmap.stages.map(stage => 
                    stage.id === stageId ? { ...stage, ...updates, updatedAt: new Date().toISOString() } : stage
                  ).sort((a, b) => a.index - b.index)
                }
              : roadmap
          )
        }));
      },
      
      // Delete stage
      deleteStage: (roadmapId, stageId) => {
        set((state) => ({
          roadmaps: state.roadmaps.map(roadmap => 
            roadmap.id === roadmapId 
              ? {
                  ...roadmap,
                  stages: roadmap.stages.filter(stage => stage.id !== stageId)
                }
              : roadmap
          )
        }));
      },
      
      // Get roadmap by ID
      getRoadmap: (roadmapId) => {
        return get().roadmaps.find(roadmap => roadmap.id === roadmapId);
      },
      
      // Get active roadmaps
      getActiveRoadmaps: () => {
        return get().roadmaps.filter(roadmap => roadmap.isActive);
      },
      
      // Get roadmap stages
      getRoadmapStages: (roadmapId) => {
        const roadmap = get().getRoadmap(roadmapId);
        return roadmap ? roadmap.stages : [];
      },
      
      // Get stage by ID
      getStage: (stageId) => {
        for (const roadmap of get().roadmaps) {
          const stage = roadmap.stages.find(s => s.id === stageId);
          if (stage) return stage;
        }
        return null;
      },
      
      // Calculate total TAT for a roadmap
      calculateRoadmapTAT: (roadmapId) => {
        const roadmap = get().getRoadmap(roadmapId);
        if (!roadmap) return 0;
        
        return roadmap.stages.reduce((total, stage) => total + (stage.sla || 0), 0);
      },
      
      // Get roadmap with calculated metrics
      getRoadmapWithMetrics: (roadmapId) => {
        const roadmap = get().getRoadmap(roadmapId);
        if (!roadmap) return null;
        
        const totalTAT = get().calculateRoadmapTAT(roadmapId);
        const totalStages = roadmap.stages.length;
        const completedStages = roadmap.stages.filter(stage => stage.status === 'DONE').length;
        
        return {
          ...roadmap,
          totalTAT,
          totalStages,
          completedStages,
          progress: totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0
        };
      },
      
      // Calculate roadmap metrics
      getRoadmapMetrics: () => {
        const roadmaps = get().roadmaps;
        const total = roadmaps.length;
        const active = roadmaps.filter(r => r.isActive).length;
        const totalStages = roadmaps.reduce((sum, r) => sum + r.stages.length, 0);
        const avgStagesPerRoadmap = total > 0 ? Math.round(totalStages / total) : 0;
        
        return {
          total,
          active,
          totalStages,
          avgStagesPerRoadmap
        };
      },
      
      // Get stages by responsibility
      getStagesByResponsibility: (responsibilityId) => {
        const stages = [];
        get().roadmaps.forEach(roadmap => {
          roadmap.stages.forEach(stage => {
            if (stage.responsibilityId === responsibilityId) {
              stages.push({
                ...stage,
                roadmapName: roadmap.name,
                roadmapId: roadmap.id
              });
            }
          });
        });
        return stages;
      },
      
      // Get stages by user
      getStagesByUser: (userId) => {
        const stages = [];
        get().roadmaps.forEach(roadmap => {
          roadmap.stages.forEach(stage => {
            if (stage.assignedUserId === userId) {
              stages.push({
                ...stage,
                roadmapName: roadmap.name,
                roadmapId: roadmap.id
              });
            }
          });
        });
        return stages;
      },
      
      // Get ready stages (eligible for assignment)
      getReadyStages: () => {
        const stages = [];
        get().roadmaps.forEach(roadmap => {
          roadmap.stages.forEach(stage => {
            if (stage.status === 'READY') {
              stages.push({
                ...stage,
                roadmapName: roadmap.name,
                roadmapId: roadmap.id
              });
            }
          });
        });
        return stages;
      },
      
      // Get blocked stages
      getBlockedStages: () => {
        const stages = [];
        get().roadmaps.forEach(roadmap => {
          roadmap.stages.forEach(stage => {
            if (stage.status === 'BLOCKED') {
              stages.push({
                ...stage,
                roadmapName: roadmap.name,
                roadmapId: roadmap.id
              });
            }
          });
        });
        return stages;
      },
      
      // Get stages by project
      getStagesByProject: (projectId) => {
        const roadmap = get().roadmaps.find(r => r.projectId === projectId);
        return roadmap ? roadmap.stages : [];
      },
      
      // Enhanced progression engine - Unlock next stage when exit criteria of current stage are met
      unlockNextStage: (roadmapId, stageId) => {
        const roadmap = get().getRoadmap(roadmapId);
        if (!roadmap) return;
        
        const currentIndex = roadmap.stages.findIndex(s => s.id === stageId);
        if (currentIndex === -1 || currentIndex === roadmap.stages.length - 1) return;
        
        const nextStage = roadmap.stages[currentIndex + 1];
        if (nextStage.status === 'LOCKED') {
          get().updateStage(roadmapId, nextStage.id, { status: 'READY' });
        }
      },
      
      // Complete stage and unlock next stage
      completeStage: (roadmapId, stageId) => {
        // Update current stage to DONE
        get().updateStage(roadmapId, stageId, { status: 'DONE' });
        
        // Unlock next stage
        get().unlockNextStage(roadmapId, stageId);
        
        // Notify next responsible user
        const roadmap = get().getRoadmap(roadmapId);
        if (!roadmap) return;
        
        const currentIndex = roadmap.stages.findIndex(s => s.id === stageId);
        if (currentIndex === -1 || currentIndex === roadmap.stages.length - 1) return;
        
        const nextStage = roadmap.stages[currentIndex + 1];
        // In a real implementation, this would send a notification to the next responsible user
        console.log(`Stage ${stageId} completed. Next stage ${nextStage.id} is now ready for ${nextStage.responsibilityId}`);
      },
      
      // Block stage with reason
      blockStage: (roadmapId, stageId, reason) => {
        get().updateStage(roadmapId, stageId, { 
          status: 'BLOCKED', 
          blockedReason: reason,
          blockedAt: new Date().toISOString()
        });
      },
      
      // Unblock stage
      unblockStage: (roadmapId, stageId) => {
        get().updateStage(roadmapId, stageId, { 
          status: 'READY',
          blockedReason: null,
          blockedAt: null
        });
      },
      
      // Get SLA/TTT risks (stages approaching or past SLA)
      getSLARisks: () => {
        const risks = [];
        const now = new Date();
        
        get().roadmaps.forEach(roadmap => {
          roadmap.stages.forEach(stage => {
            if (stage.status === 'IN_PROGRESS' && stage.sla) {
              // Calculate if stage is approaching or past SLA
              const createdAt = new Date(stage.createdAt || roadmap.createdDate);
              const slaDeadline = new Date(createdAt);
              slaDeadline.setDate(createdAt.getDate() + stage.sla);
              
              const daysRemaining = Math.ceil((slaDeadline - now) / (1000 * 60 * 60 * 24));
              
              if (daysRemaining <= 2) {
                risks.push({
                  ...stage,
                  roadmapName: roadmap.name,
                  roadmapId: roadmap.id,
                  daysRemaining,
                  isOverdue: daysRemaining < 0
                });
              }
            }
          });
        });
        
        return risks;
      },
      
      // Get stage aging (how long stages have been in their current status)
      getStageAging: () => {
        const aging = [];
        const now = new Date();
        
        get().roadmaps.forEach(roadmap => {
          roadmap.stages.forEach(stage => {
            if (stage.status !== 'DONE' && stage.status !== 'LOCKED') {
              const createdAt = new Date(stage.createdAt || roadmap.createdDate);
              const ageInDays = Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24));
              
              aging.push({
                ...stage,
                roadmapName: roadmap.name,
                roadmapId: roadmap.id,
                ageInDays
              });
            }
          });
        });
        
        return aging;
      },
      
      // Get stage throughput metrics
      getStageThroughput: () => {
        const throughput = {};
        
        get().roadmaps.forEach(roadmap => {
          roadmap.stages.forEach(stage => {
            if (!throughput[stage.responsibilityId]) {
              throughput[stage.responsibilityId] = {
                total: 0,
                completed: 0,
                avgDuration: 0
              };
            }
            
            throughput[stage.responsibilityId].total++;
            
            if (stage.status === 'DONE') {
              throughput[stage.responsibilityId].completed++;
              
              // Calculate average duration for completed stages
              if (stage.createdAt && stage.updatedAt) {
                const created = new Date(stage.createdAt);
                const updated = new Date(stage.updatedAt);
                const duration = (updated - created) / (1000 * 60 * 60 * 24); // in days
                throughput[stage.responsibilityId].avgDuration = 
                  (throughput[stage.responsibilityId].avgDuration + duration) / 2;
              }
            }
          });
        });
        
        return throughput;
      }
    }),
    {
      name: 'roadmap-storage',
      partialize: (state) => ({
        roadmaps: state.roadmaps
      })
    }
  )
);

export { useRoadmapStore };