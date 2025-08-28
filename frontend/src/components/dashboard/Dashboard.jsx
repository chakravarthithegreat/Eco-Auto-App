import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useNavigationStore } from '../../state/navigationStore';
import AdminDashboard from './AdminDashboard';
import EnhancedManagerDashboard from './EnhancedManagerDashboard';
import TeamMemberDashboard from './TeamMemberDashboard';
import DashboardSkeleton from '../ui/DashboardSkeleton';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { setCurrentPage, currentPage } = useNavigationStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('Dashboard: User state changed', { user, isAuthenticated, currentPage });
      
      // Redirect to role-specific dashboard
      if (user?.role === 'ADMIN') {
        console.log('Dashboard: Redirecting ADMIN to admin-dashboard');
        setCurrentPage('admin-dashboard');
      } else if (user?.role === 'MANAGER') {
        console.log('Dashboard: Redirecting MANAGER to manager-dashboard');
        setCurrentPage('manager-dashboard');
      } else if (user?.role === 'TEAM_MEMBER') {
        console.log('Dashboard: Redirecting TEAM_MEMBER to team-member-dashboard');
        setCurrentPage('team-member-dashboard');
      } else if (isAuthenticated && !user) {
        // If authenticated but no user data, try to get user data
        console.log('Dashboard: Authenticated but no user data, staying on dashboard');
      }
    } catch (err) {
      console.error('Error in Dashboard useEffect:', err);
      setError(err);
    }
  }, [user, isAuthenticated, setCurrentPage, currentPage]);

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h2>
          <p className="text-red-700 mb-4">There was an error loading the dashboard.</p>
          <p className="text-sm text-red-600">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // If we're already on a dashboard page, don't show skeleton
  if (currentPage === 'admin-dashboard' || 
      currentPage === 'manager-dashboard' || 
      currentPage === 'team-member-dashboard') {
    return null; // Let PageRouter handle rendering
  }

  // Show skeleton while redirecting
  return <DashboardSkeleton />;
};

export default Dashboard;