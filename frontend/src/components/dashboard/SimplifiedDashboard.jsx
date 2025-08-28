import React from 'react';
import { useAuthStore } from '../../state/authStore';

const SimplifiedDashboard = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Simplified Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <p>Your role is: {user?.role}</p>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p>This is a simplified dashboard to test if the components are rendering correctly.</p>
      </div>
    </div>
  );
};

export default SimplifiedDashboard;