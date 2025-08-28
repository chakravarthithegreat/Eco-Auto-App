import React from 'react';
import RewardsWallet from './RewardsWallet';
import { Gift, Sparkles } from 'lucide-react';

const RewardsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
              Rewards Wallet
            </h1>
            <p className="text-surface-600 mt-1">
              Collect rewards for your achievements and track your progress
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-purple-600 font-medium">Your rewards are updated in real-time</span>
        </div>
      </div>

      {/* Main Rewards Component */}
      <RewardsWallet />
    </div>
  );
};

export default RewardsPage;