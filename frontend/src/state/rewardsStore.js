import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Reward configuration
export const REWARD_TYPES = {
  star: {
    name: 'Star',
    value: 5,
    icon: '⭐',
    color: 'from-yellow-400 to-yellow-500',
    description: 'Performance excellence award'
  },
  butterfly: {
    name: 'Butterfly',
    value: 2.5,
    icon: '🦋',
    color: 'from-purple-400 to-purple-500',
    description: 'Team collaboration award'
  },
  chocolate: {
    name: 'Chocolate',
    value: 1.25,
    icon: '🍫',
    color: 'from-amber-500 to-amber-600',
    description: 'Daily participation award'
  },
  trophy: {
    name: 'Trophy',
    value: 10,
    icon: '🏆',
    color: 'from-orange-400 to-orange-500',
    description: 'Major achievement award'
  },
  medal: {
    name: 'Medal',
    value: 7.5,
    icon: '🏅',
    color: 'from-blue-400 to-blue-500',
    description: 'Special recognition award'
  },
  badge: {
    name: 'Badge',
    value: 3,
    icon: '🎖️',
    color: 'from-green-400 to-green-500',
    description: 'Skill mastery award'
  }
};

// Reward values (INR)
const REWARD_VALUES = {
  star: 5,        // 1 star = 5 INR
  butterfly: 2.5, // 1 butterfly = 2.5 INR
  chocolate: 1.25 // 1 chocolate = 1.25 INR
};

export const useRewardsStore = create(
  persist(
    (set, get) => ({
      // State
      rewards: {
        stars: 10,
        butterflies: 15,
        chocolates: 20,
        totalPoints: 100
      },
      
      userWallet: {
        rewardCounts: {
          star: 5,
          butterfly: 8,
          chocolate: 12,
          trophy: 1,
          medal: 2,
          badge: 3
        },
        totalValue: 78.75,
        recentActivity: [
          { id: 1, type: 'star', description: 'Completed project ahead of schedule', date: '2024-01-15', value: 5 },
          { id: 2, type: 'butterfly', description: 'Helped team member with task', date: '2024-01-14', value: 2.5 },
          { id: 3, type: 'chocolate', description: 'Daily check-in streak', date: '2024-01-13', value: 1.25 }
        ]
      },
      
      // Reward configuration
      rewardConfig: {
        starValue: 5,
        butterflyValue: 2.5,
        chocolateValue: 1.25,
        // TAT-based reward multipliers
        efficiencyBonus: {
          excellent: 1.5,  // 150% for efficiency > 120%
          good: 1.2,       // 120% for efficiency > 100%
          acceptable: 1.0, // 100% for efficiency > 80%
          poor: 0.8        // 80% for efficiency < 80%
        },
        qualityBonus: {
          excellent: 1.5,  // 5 stars
          good: 1.3,       // 4 stars
          acceptable: 1.1, // 3 stars
          poor: 0.9        // 1-2 stars
        },
        approvalBonus: {
          approved: 1.2,   // Approved work gets 20% bonus
          rejected: 0.5    // Rejected work gets 50% reduction
        }
      },

      isLoading: false,
      error: null,

      // Actions
      // Award rewards based on task completion with TAT metrics
      awardTATBasedRewards: (tatRecord, task) => {
        const { rewardConfig } = get();
        
        // Base reward calculation
        let baseStars = 1;
        let baseButterflies = 2;
        let baseChocolates = 3;
        
        // Efficiency bonus
        let efficiencyMultiplier = 1.0;
        if (tatRecord.efficiency >= 120) {
          efficiencyMultiplier = rewardConfig.efficiencyBonus.excellent;
        } else if (tatRecord.efficiency >= 100) {
          efficiencyMultiplier = rewardConfig.efficiencyBonus.good;
        } else if (tatRecord.efficiency >= 80) {
          efficiencyMultiplier = rewardConfig.efficiencyBonus.acceptable;
        } else {
          efficiencyMultiplier = rewardConfig.efficiencyBonus.poor;
        }
        
        // Quality bonus
        let qualityMultiplier = 1.0;
        if (tatRecord.qualityRating >= 5) {
          qualityMultiplier = rewardConfig.qualityBonus.excellent;
        } else if (tatRecord.qualityRating >= 4) {
          qualityMultiplier = rewardConfig.qualityBonus.good;
        } else if (tatRecord.qualityRating >= 3) {
          qualityMultiplier = rewardConfig.qualityBonus.acceptable;
        } else {
          qualityMultiplier = rewardConfig.qualityBonus.poor;
        }
        
        // Approval bonus
        let approvalMultiplier = 1.0;
        if (task.approved) {
          approvalMultiplier = rewardConfig.approvalBonus.approved;
        } else if (task.rejected) {
          approvalMultiplier = rewardConfig.approvalBonus.rejected;
        }
        
        // Calculate final rewards
        const finalStars = Math.floor(baseStars * efficiencyMultiplier * qualityMultiplier * approvalMultiplier);
        const finalButterflies = Math.floor(baseButterflies * efficiencyMultiplier * qualityMultiplier * approvalMultiplier);
        const finalChocolates = Math.floor(baseChocolates * efficiencyMultiplier * qualityMultiplier * approvalMultiplier);
        
        // Calculate total points value
        const totalPoints = (finalStars * rewardConfig.starValue) + 
                           (finalButterflies * rewardConfig.butterflyValue) + 
                           (finalChocolates * rewardConfig.chocolateValue);
        
        // Update rewards
        set((state) => ({
          rewards: {
            stars: state.rewards.stars + finalStars,
            butterflies: state.rewards.butterflies + finalButterflies,
            chocolates: state.rewards.chocolates + finalChocolates,
            totalPoints: state.rewards.totalPoints + totalPoints
          }
        }));
        
        return {
          stars: finalStars,
          butterflies: finalButterflies,
          chocolates: finalChocolates,
          totalPoints
        };
      },

      // Auto-reward for task completion (simpler version)
      autoRewardForTaskCompletion: async (quality = 'average') => {
        console.log('Auto-rewarding for task completion with quality:', quality);
        const qualityMultipliers = {
          excellent: 1.5,
          good: 1.2,
          average: 1.0,
          poor: 0.8
        };
        
        const multiplier = qualityMultipliers[quality] || 1.0;
        
        // Base rewards
        const stars = Math.floor(1 * multiplier);
        const butterflies = Math.floor(2 * multiplier);
        const chocolates = Math.floor(3 * multiplier);
        
        // Calculate points
        const { rewardConfig } = get();
        const points = (stars * rewardConfig.starValue) + 
                      (butterflies * rewardConfig.butterflyValue) + 
                      (chocolates * rewardConfig.chocolateValue);
        
        set((state) => ({
          rewards: {
            stars: state.rewards.stars + stars,
            butterflies: state.rewards.butterflies + butterflies,
            chocolates: state.rewards.chocolates + chocolates,
            totalPoints: state.rewards.totalPoints + points
          }
        }));
        
        console.log('Rewards awarded:', { stars, butterflies, chocolates, points });
        return { stars, butterflies, chocolates, points };
      },

      // Add reward to user wallet
      addReward: async (rewardType, description = 'Achievement unlocked') => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const reward = REWARD_TYPES[rewardType];
          if (!reward) {
            throw new Error(`Invalid reward type: ${rewardType}`);
          }
          
          set((state) => ({
            userWallet: {
              ...state.userWallet,
              rewardCounts: {
                ...state.userWallet.rewardCounts,
                [rewardType]: (state.userWallet.rewardCounts[rewardType] || 0) + 1
              },
              totalValue: state.userWallet.totalValue + reward.value,
              recentActivity: [
                {
                  id: Date.now(),
                  type: rewardType,
                  description,
                  date: new Date().toISOString().split('T')[0],
                  value: reward.value
                },
                ...state.userWallet.recentActivity.slice(0, 9) // Keep only last 10 activities
              ]
            }
          }));
          
          return { success: true, message: `Added ${reward.name} to your wallet!` };
        } catch (error) {
          console.error('Error adding reward:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Redeem rewards
      redeemRewards: async (rewardType, quantity = 1) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const reward = REWARD_TYPES[rewardType];
          if (!reward) {
            throw new Error(`Invalid reward type: ${rewardType}`);
          }
          
          set((state) => {
            const currentCount = state.userWallet.rewardCounts[rewardType] || 0;
            if (currentCount < quantity) {
              throw new Error(`Not enough ${reward.name}s to redeem`);
            }
            
            return {
              userWallet: {
                ...state.userWallet,
                rewardCounts: {
                  ...state.userWallet.rewardCounts,
                  [rewardType]: currentCount - quantity
                },
                totalValue: state.userWallet.totalValue - (reward.value * quantity)
              }
            };
          });
          
          return { success: true, message: `Redeemed ${quantity} ${reward.name}(s)!` };
        } catch (error) {
          console.error('Error redeeming reward:', error);
          set({ error: error.message });
          return { success: false, error: error.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Get wallet statistics
      getWalletStats: () => {
        const state = get();
        const { userWallet, rewardConfig } = state;
        
        return {
          totalRewards: Object.values(userWallet.rewardCounts).reduce((sum, count) => sum + count, 0),
          totalValue: userWallet.totalValue,
          rewardsByCategory: {
            performance: (userWallet.rewardCounts.star || 0) + (userWallet.rewardCounts.trophy || 0) + (userWallet.rewardCounts.medal || 0),
            collaboration: (userWallet.rewardCounts.butterfly || 0) + (userWallet.rewardCounts.badge || 0),
            participation: userWallet.rewardCounts.chocolate || 0
          }
        };
      },

      // Reset rewards (for testing)
      resetRewards: () => {
        set({
          rewards: {
            stars: 10,
            butterflies: 15,
            chocolates: 20,
            totalPoints: 100
          },
          userWallet: {
            rewardCounts: {
              star: 5,
              butterfly: 8,
              chocolate: 12,
              trophy: 1,
              medal: 2,
              badge: 3
            },
            totalValue: 78.75,
            recentActivity: [
              { id: 1, type: 'star', description: 'Completed project ahead of schedule', date: '2024-01-15', value: 5 },
              { id: 2, type: 'butterfly', description: 'Helped team member with task', date: '2024-01-14', value: 2.5 },
              { id: 3, type: 'chocolate', description: 'Daily check-in streak', date: '2024-01-13', value: 1.25 }
            ]
          }
        });
      },

      // Update reward configuration
      updateRewardConfig: (config) => {
        set((state) => ({
          rewardConfig: {
            ...state.rewardConfig,
            ...config
          }
        }));
      },
      
      // Fetch rewards (for initialization)
      fetchRewards: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // In a real app, this would fetch from an API
          console.log('Rewards fetched successfully');
          return { success: true };
        } catch (error) {
          console.error('Error fetching rewards:', error);
          set({ error: 'Failed to load rewards' });
          return { success: false, error: 'Failed to load rewards' };
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'eco-auto-rewards',
      partialize: (state) => ({
        rewards: state.rewards,
        userWallet: state.userWallet,
        rewardConfig: state.rewardConfig
      }),
    }
  )
);