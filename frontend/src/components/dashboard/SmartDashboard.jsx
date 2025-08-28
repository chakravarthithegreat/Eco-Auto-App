import React from 'react';
import { useAuthStore } from '../../state/authStore';
import Dashboard from './Dashboard';
import EnhancedManagerDashboard from './EnhancedManagerDashboard';
import AdminDashboard from './AdminDashboard';
import TeamMemberDashboard from './TeamMemberDashboard';

const SmartDashboard = () => {
  const { user } = useAuthStore();

  // Render appropriate dashboard based on user role
  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'MANAGER':
      return <EnhancedManagerDashboard />;
    case 'TEAM_MEMBER':
      return <TeamMemberDashboard />;
    default:
      return <Dashboard />;
  }
};

export default SmartDashboard;
