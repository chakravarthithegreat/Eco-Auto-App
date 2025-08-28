import React, { useState } from 'react';
import AdminDashboard from '../dashboard/AdminDashboard';
import EnhancedManagerDashboard from '../dashboard/EnhancedManagerDashboard';
import TeamMemberDashboard from '../dashboard/TeamMemberDashboard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const DirectDashboardView = () => {
  const [currentView, setCurrentView] = useState('admin');

  const renderDashboard = () => {
    switch (currentView) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <EnhancedManagerDashboard />;
      case 'team-member':
        return <TeamMemberDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <Card className="max-w-7xl mx-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Direct Dashboard Access</h1>
            <p className="text-gray-600">
              View dashboards directly without routing issues
            </p>
          </div>

          {/* View Selector */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={() => setCurrentView('admin')}
              variant={currentView === 'admin' ? 'default' : 'outline'}
              className="px-4 py-2"
            >
              Admin Dashboard
            </Button>
            <Button
              onClick={() => setCurrentView('manager')}
              variant={currentView === 'manager' ? 'default' : 'outline'}
              className="px-4 py-2"
            >
              Manager Dashboard
            </Button>
            <Button
              onClick={() => setCurrentView('team-member')}
              variant={currentView === 'team-member' ? 'default' : 'outline'}
              className="px-4 py-2"
            >
              Team Member Dashboard
            </Button>
          </div>

          {/* Dashboard Display */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentView === 'admin' && 'Admin Dashboard'}
                {currentView === 'manager' && 'Manager Dashboard'}
                {currentView === 'team-member' && 'Team Member Dashboard'}
              </h2>
            </div>
            <div className="p-4">
              {renderDashboard()}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-900 mb-2">Dashboard Visibility Solution</h3>
            <p className="text-blue-800 text-sm mb-3">
              If you can see the dashboards here but not in the main application, the issue is in the routing or authentication flow.
            </p>
            <ul className="text-blue-800 text-sm list-disc pl-5 space-y-1">
              <li>The dashboard components are working correctly</li>
              <li>The issue is likely in the navigation store or authentication redirect logic</li>
              <li>Check the browser console for any error messages</li>
              <li>Try using the "Dashboard Fix" option in the main navigation</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DirectDashboardView;