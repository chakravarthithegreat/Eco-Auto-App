import React from 'react';
import RewardsWallet from '../rewards/RewardsWallet';
import AttendanceTracker from '../attendance/AttendanceTracker';

export const PomodoroPage = () => {
  return (
    <div className="bg-white rounded-3xl shadow-card p-6 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]">
      <h1 className="text-2xl font-bold text-surface-900 leading-tight mb-3 sm:text-3xl sm:mb-4">Focus Timer</h1>
      <p>Pomodoro technique timer and productivity tracking coming soon...</p>
      <div className="mt-6 text-center">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-purple-200 flex items-center justify-center">
          <span className="text-2xl font-bold text-purple-600">25:00</span>
        </div>
        <button className="inline-flex items-center justify-center px-6 py-3 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 select-none bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 focus:ring-primary-500 rounded-xl">Start Focus Session</button>
      </div>
    </div>
  );
};

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-card p-6 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]">
        <h1 className="text-2xl font-bold text-surface-900 leading-tight mb-3 sm:text-3xl sm:mb-4">Settings</h1>
        <p>Application and account settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-card p-6 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]">
          <h3 className="text-xl font-semibold text-surface-900 leading-tight mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Display Name</label>
              <input type="text" className="form-input" placeholder="Your display name" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="your.email@company.com" />
            </div>
            <button className="inline-flex items-center justify-center px-6 py-3 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 select-none bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 focus:ring-primary-500 rounded-xl">Save Changes</button>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-card p-6 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]">
          <h3 className="text-xl font-semibold text-surface-900 leading-tight mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input type="checkbox" className="form-checkbox" />
            </div>
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <input type="checkbox" className="form-checkbox" />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Clock-out</span>
              <input type="checkbox" className="form-checkbox" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};