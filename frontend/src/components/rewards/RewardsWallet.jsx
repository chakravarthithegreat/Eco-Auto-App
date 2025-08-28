import React, { useEffect, useState } from 'react';
import { useRewardsStore, REWARD_TYPES } from '../../state/rewardsStore';
import { Gift, TrendingUp, Award, Trophy, Target, Star, Zap, Heart, Shield, Crown, Medal, Flower, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const RewardsWallet = () => {
  const { userWallet, getWalletStats } = useRewardsStore();
  const [walletStats, setWalletStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setWalletStats(getWalletStats());
  }, [getWalletStats]);

  if (!walletStats) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  // Enhanced reward types with better icons and colors
  const ENHANCED_REWARD_TYPES = {
    star: {
      name: 'Star',
      value: 50,
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-400 to-yellow-600',
      description: 'Outstanding performance'
    },
    butterfly: {
      name: 'Butterfly',
      value: 30,
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-pink-400 to-pink-600',
      description: 'Good work'
    },
    trophy: {
      name: 'Trophy',
      value: 100,
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-amber-400 to-amber-600',
      description: 'Exceptional achievement'
    },
    crown: {
      name: 'Crown',
      value: 200,
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-400 to-purple-600',
      description: 'Top performer'
    },
    medal: {
      name: 'Medal',
      value: 75,
      icon: <Medal className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600',
      description: 'Consistent excellence'
    },
    shield: {
      name: 'Shield',
      value: 40,
      icon: <Shield className="w-6 h-6" />,
      color: 'from-green-400 to-green-600',
      description: 'Team protection'
    },
    heart: {
      name: 'Heart',
      value: 25,
      icon: <Heart className="w-6 h-6" />,
      color: 'from-red-400 to-red-600',
      description: 'Kindness & support'
    },
    zap: {
      name: 'Zap',
      value: 60,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-indigo-400 to-indigo-600',
      description: 'Innovation & creativity'
    },
    flower: {
      name: 'Flower',
      value: 35,
      icon: <Flower className="w-6 h-6" />,
      color: 'from-emerald-400 to-emerald-600',
      description: 'Growth & development'
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-surface-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('collection')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'collection'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          My Collection
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          History
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Wallet Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Value */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Total Wallet Value</h3>
                    <div className="text-3xl font-bold">₹{walletStats?.totalValue?.toFixed(2) || '0.00'}</div>
                    <p className="text-purple-100 text-sm mt-1">Indian Rupees</p>
                  </div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Rewards */}
            <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Total Rewards</h3>
                    <div className="text-3xl font-bold">{walletStats?.totalRewards || 0}</div>
                    <p className="text-pink-100 text-sm mt-1">Items Collected</p>
                  </div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Award className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Rewards */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Performance</h3>
                    <div className="text-3xl font-bold">{walletStats?.rewardsByCategory?.performance || 0}</div>
                    <p className="text-blue-100 text-sm mt-1">Stars & Excellence</p>
                  </div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collaboration Rewards */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Collaboration</h3>
                    <div className="text-3xl font-bold">{walletStats?.rewardsByCategory?.collaboration || 0}</div>
                    <p className="text-green-100 text-sm mt-1">Teamwork & Help</p>
                  </div>
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Target className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rewards Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Rewards Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-600">Next Milestone</span>
                    <span className="font-medium">500 points</span>
                  </div>
                  <div className="w-full bg-surface-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                  <div className="text-xs text-surface-500 mt-1">
                    325 / 500 points
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="text-purple-600 font-medium">Current Level</div>
                    <div className="text-2xl font-bold text-purple-800">Gold</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div className="text-amber-600 font-medium">Next Level</div>
                    <div className="text-2xl font-bold text-amber-800">Platinum</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'collection' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-500" />
              Your Reward Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.entries(ENHANCED_REWARD_TYPES).map(([key, reward]) => {
                const count = userWallet.rewardCounts[key] || 0;
                const totalValue = count * reward.value;
                
                return (
                  <div
                    key={key}
                    className={`bg-white rounded-2xl p-5 border border-surface-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center cursor-pointer sm:p-6 sm:rounded-3xl ${
                      count > 0 ? 'border-2 border-purple-200 shadow-sm' : 'opacity-70'
                    }`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${reward.color} flex items-center justify-center text-2xl text-white shadow-md`}>
                      {reward.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{reward.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">{reward.description}</p>
                    <div className="text-sm text-gray-700 mb-1">₹{reward.value} each</div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">{count}</div>
                    {count > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        ₹{totalValue.toFixed(2)} total
                      </div>
                    )}
                    {count === 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        Not earned yet
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Recent Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userWallet.rewards && userWallet.rewards.length > 0 ? (
                userWallet.rewards.slice(0, 10).map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ENHANCED_REWARD_TYPES[reward.type]?.color || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white`}>
                        {ENHANCED_REWARD_TYPES[reward.type]?.icon || <Gift className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="font-medium text-surface-900">{ENHANCED_REWARD_TYPES[reward.type]?.name || reward.type}</div>
                        <div className="text-sm text-surface-600">{reward.reason}</div>
                        <div className="text-xs text-surface-500">{new Date(reward.timestamp).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">+₹{ENHANCED_REWARD_TYPES[reward.type]?.value || 0}</div>
                      <div className="text-xs text-surface-500">Points</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Gift className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-surface-900 mb-1">No Rewards Yet</h3>
                  <p className="text-surface-600">Complete tasks and achieve milestones to earn rewards</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RewardsWallet;