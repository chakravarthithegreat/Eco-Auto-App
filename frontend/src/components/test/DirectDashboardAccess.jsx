import React, { useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useNavigationStore } from '../../state/navigationStore';
import AdminDashboard from '../dashboard/AdminDashboard';
import EnhancedManagerDashboard from '../dashboard/EnhancedManagerDashboard';
import TeamMemberDashboard from '../dashboard/TeamMemberDashboard';

const DirectDashboardAccess = () => {
  const { user, login } = useAuthStore();
  const { currentPage, setCurrentPage } = useNavigationStore();
  const [testRole, setTestRole] = React.useState('ADMIN');

  // Auto-login as admin for testing
  useEffect(() => {
    if (!user) {
      login({
        username: 'admin',
        password: 'admin123'
      });
    }
  }, [user, login]);

  const switchRole = (role) => {
    setTestRole(role);
    // In a real implementation, we would switch the user role
    // For now, we'll just update the state
  };

  const renderDashboard = () => {
    switch (testRole) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'MANAGER':
        return <EnhancedManagerDashboard />;
      case 'TEAM_MEMBER':
        return <TeamMemberDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Direct Dashboard Access</h1>
      
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Role Selection</h2>
        <div className="flex gap-4">
          <button
            onClick={() => switchRole('ADMIN')}
            className={`px-4 py-2 rounded ${
              testRole === 'ADMIN'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Admin Dashboard
          </button>
          <button
            onClick={() => switchRole('MANAGER')}
            className={`px-4 py-2 rounded ${
              testRole === 'MANAGER'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Manager Dashboard
          </button>
          <button
            onClick={() => switchRole('TEAM_MEMBER')}
            className={`px-4 py-2 rounded ${
              testRole === 'TEAM_MEMBER'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Team Member Dashboard
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {testRole === 'ADMIN' && 'Admin Dashboard'}
          {testRole === 'MANAGER' && 'Manager Dashboard'}
          {testRole === 'TEAM_MEMBER' && 'Team Member Dashboard'}
        </h2>
        <div className="border rounded-lg p-4 min-h-[500px]">
          {renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default DirectDashboardAccess;