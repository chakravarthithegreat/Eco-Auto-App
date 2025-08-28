import React from 'react';
import { AuthProvider } from '../../state/authStore';
import RoleSpecificDashboard from '../dashboard/RoleSpecificDashboard';

// Mock provider that sets a specific user role for testing
const MockAuthProvider = ({ role = 'admin', children }) => {
  // This is a simplified mock - in a real test, you'd want to mock the entire store
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

const DashboardTestWithMock = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Test with Mock Auth</h1>
      <MockAuthProvider role="admin">
        <RoleSpecificDashboard />
      </MockAuthProvider>
    </div>
  );
};

export default DashboardTestWithMock;