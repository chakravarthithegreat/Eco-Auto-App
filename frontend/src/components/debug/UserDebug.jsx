import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../state/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

const UserDebug = () => {
  const authStore = useAuthStore();
  const { user, isAuthenticated, hasHydrated } = authStore;
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('UserDebug: Auth store state changed', { user, isAuthenticated, hasHydrated });
    setDebugInfo({ user, isAuthenticated, hasHydrated });
  }, [user, isAuthenticated, hasHydrated]);

  const loginAsAdmin = async () => {
    const { login } = authStore;
    await login({
      username: 'meera.iyer@artgifts.com',
      password: 'password123'
    });
  };

  const logout = async () => {
    const { logout } = authStore;
    await logout();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Debug</h1>
        <p className="text-gray-500">
          Debugging user authentication state
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Is Authenticated:</p>
              <p>{isAuthenticated ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="font-medium">Has Hydrated:</p>
              <p>{hasHydrated ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium">User Object:</p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button onClick={loginAsAdmin}>Login as Admin</Button>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDebug;