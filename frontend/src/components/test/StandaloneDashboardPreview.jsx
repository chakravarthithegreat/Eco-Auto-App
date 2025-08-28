import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import AdminDashboard from '../dashboard/AdminDashboard';
import EnhancedManagerDashboard from '../dashboard/EnhancedManagerDashboard';
import TeamMemberDashboard from '../dashboard/TeamMemberDashboard';

const StandaloneDashboardPreview = () => {
  const { user, login, isAuthenticated } = useAuthStore();
  const [currentView, setCurrentView] = useState('admin');
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login as admin for testing
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isAuthenticated) {
        try {
          await login({
            username: 'admin',
            password: 'admin123'
          });
        } catch (error) {
          console.error('Login error:', error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [isAuthenticated, login]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Preview</h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => setCurrentView('manager')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'manager'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Manager Dashboard
              </button>
              <button
                onClick={() => setCurrentView('team-member')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'team-member'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Team Member Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentView === 'admin' && 'Admin Dashboard'}
              {currentView === 'manager' && 'Manager Dashboard'}
              {currentView === 'team-member' && 'Team Member Dashboard'}
            </h2>
            <p className="text-gray-600 text-sm">
              Previewing dashboard components directly without routing
            </p>
          </div>
          
          {/* Dashboard Preview Area */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="min-h-[600px]">
              {renderDashboard()}
            </div>
          </div>
          
          {/* Info Panel */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Dashboard Preview Information</h3>
            <p className="text-blue-800 text-sm">
              This preview shows the dashboard components directly without going through the normal 
              application routing. If you can see the dashboards here but not in the main application, 
              the issue is likely in the routing or authentication flow rather than the dashboard components themselves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandaloneDashboardPreview;