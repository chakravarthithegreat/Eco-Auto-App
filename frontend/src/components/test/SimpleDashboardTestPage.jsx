import React from 'react';
import AdminDashboard from '../dashboard/AdminDashboard';
import EnhancedManagerDashboard from '../dashboard/EnhancedManagerDashboard';
import TeamMemberDashboard from '../dashboard/TeamMemberDashboard';

const SimpleDashboardTestPage = () => {
  // Mock user data for testing
  const mockAdminUser = {
    id: '1',
    username: 'admin',
    role: 'ADMIN',
    name: 'Admin User',
    email: 'admin@ecoauto.com'
  };

  const mockManagerUser = {
    id: '2',
    username: 'manager',
    role: 'MANAGER',
    name: 'Manager User',
    email: 'manager@ecoauto.com'
  };

  const mockTeamMemberUser = {
    id: '3',
    username: 'member',
    role: 'TEAM_MEMBER',
    name: 'Team Member',
    email: 'member@ecoauto.com'
  };

  // For testing purposes, we'll just render all dashboards to see if they work
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Component Test</h1>
      <p className="mb-6 text-gray-600">If you can see the dashboards below, the components are working correctly.</p>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
        <div className="border rounded-lg p-4 bg-white">
          <AdminDashboard />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manager Dashboard</h2>
        <div className="border rounded-lg p-4 bg-white">
          <EnhancedManagerDashboard />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Team Member Dashboard</h2>
        <div className="border rounded-lg p-4 bg-white">
          <TeamMemberDashboard />
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboardTestPage;