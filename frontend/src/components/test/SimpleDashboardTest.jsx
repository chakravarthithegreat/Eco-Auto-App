import React from 'react';
import AdminDashboard from '../dashboard/AdminDashboard';
import EnhancedManagerDashboard from '../dashboard/EnhancedManagerDashboard';
import TeamMemberDashboard from '../dashboard/TeamMemberDashboard';

const SimpleDashboardTest = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Visibility Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Admin Dashboard Test</h2>
        <div className="border rounded p-2">
          <AdminDashboard />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Manager Dashboard Test</h2>
        <div className="border rounded p-2">
          <EnhancedManagerDashboard />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Team Member Dashboard Test</h2>
        <div className="border rounded p-2">
          <TeamMemberDashboard />
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboardTest;