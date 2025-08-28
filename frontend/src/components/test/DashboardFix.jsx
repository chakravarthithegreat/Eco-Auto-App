import React, { useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useNavigationStore } from '../../state/navigationStore';

const DashboardFix = () => {
  const { user, login, isAuthenticated } = useAuthStore();
  const { setCurrentPage } = useNavigationStore();

  // Auto-login and redirect to appropriate dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      // If not authenticated, login as admin for testing
      if (!isAuthenticated) {
        console.log('DashboardFix: Not authenticated, logging in as admin');
        await login({
          username: 'admin',
          password: 'admin123'
        });
      }
      
      // After authentication, redirect to appropriate dashboard
      if (user) {
        console.log('DashboardFix: User authenticated, redirecting to dashboard');
        if (user.role === 'ADMIN') {
          setCurrentPage('admin-dashboard');
        } else if (user.role === 'MANAGER') {
          setCurrentPage('manager-dashboard');
        } else if (user.role === 'TEAM_MEMBER') {
          setCurrentPage('team-member-dashboard');
        }
      }
    };

    initializeDashboard();
  }, [user, isAuthenticated, login, setCurrentPage]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Fix</h1>
      <p className="mb-4">Initializing dashboard access...</p>
      
      {!isAuthenticated && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="font-medium">Authentication in progress...</p>
          <p>Please wait while we log you in as admin for testing.</p>
        </div>
      )}
      
      {isAuthenticated && user && (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
          <p className="font-medium">Authenticated successfully!</p>
          <p>Redirecting to {user.role} dashboard...</p>
        </div>
      )}
      
      {isAuthenticated && !user && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <p className="font-medium">Authentication error</p>
          <p>User data not available. Please refresh the page.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardFix;