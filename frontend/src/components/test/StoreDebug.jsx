import React from 'react';
import { useAuthStore } from '../../state/authStore';
import { useNavigationStore } from '../../state/navigationStore';

const StoreDebug = () => {
  const authStore = useAuthStore();
  const navigationStore = useNavigationStore();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Store Debug Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Store Debug */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Auth Store</h2>
            <div className="space-y-2 text-sm">
              <div><strong>isAuthenticated:</strong> {String(authStore.isAuthenticated)}</div>
              <div><strong>hasHydrated:</strong> {String(authStore.hasHydrated)}</div>
              <div><strong>isLoading:</strong> {String(authStore.isLoading)}</div>
              <div><strong>user:</strong> {authStore.user ? JSON.stringify(authStore.user, null, 2) : 'null'}</div>
              <div><strong>token:</strong> {authStore.token ? 'Present' : 'null'}</div>
              <div><strong>error:</strong> {authStore.error || 'null'}</div>
            </div>
          </div>

          {/* Navigation Store Debug */}
          <div className="bg-green-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Navigation Store</h2>
            <div className="space-y-2 text-sm">
              <div><strong>currentPage:</strong> {navigationStore.currentPage}</div>
              <div><strong>previousPage:</strong> {navigationStore.previousPage || 'null'}</div>
              <div><strong>breadcrumbs:</strong> {JSON.stringify(navigationStore.breadcrumbs)}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Debug Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => authStore.login({ username: 'admin', password: 'admin123' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login as Admin
            </button>
            
            <button
              onClick={() => authStore.login({ username: 'manager', password: 'manager123' })}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Login as Manager
            </button>
            
            <button
              onClick={() => authStore.login({ username: 'member', password: 'member123' })}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Login as Member
            </button>
            
            <button
              onClick={() => authStore.logout()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigationStore.setCurrentPage('admin-dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go to Admin Dashboard
            </button>
            
            <button
              onClick={() => navigationStore.setCurrentPage('manager-dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go to Manager Dashboard
            </button>
            
            <button
              onClick={() => navigationStore.setCurrentPage('team-member-dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go to Team Dashboard
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDebug;