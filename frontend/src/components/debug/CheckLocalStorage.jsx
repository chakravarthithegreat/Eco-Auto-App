import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

const CheckLocalStorage = () => {
  const [data, setData] = useState({ signUps: [], notifications: [] });

  const checkLocalStorage = () => {
    try {
      const signUps = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
      const notifications = JSON.parse(localStorage.getItem('employeeNotifications') || '[]');
      setData({ signUps, notifications });
      console.log('CheckLocalStorage: SignUps:', signUps);
      console.log('CheckLocalStorage: Notifications:', notifications);
    } catch (error) {
      console.error('CheckLocalStorage: Error reading localStorage:', error);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('employeeSignUps');
    localStorage.removeItem('employeeNotifications');
    checkLocalStorage();
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Local Storage Check</h1>
        <p className="text-gray-500">
          Checking employee sign-ups and notifications
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={checkLocalStorage}>Refresh Data</Button>
        <Button variant="destructive" onClick={clearLocalStorage}>Clear All Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee SignUps ({data.signUps.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.signUps.length === 0 ? (
              <p className="text-gray-500">No sign-ups found</p>
            ) : (
              <div className="space-y-4">
                {data.signUps.map((signUp, index) => (
                  <div key={index} className="border p-3 rounded">
                    <p><strong>Name:</strong> {signUp.fullName}</p>
                    <p><strong>Email:</strong> {signUp.email}</p>
                    <p><strong>Status:</strong> {signUp.profileStatus}</p>
                    <p><strong>ID:</strong> {signUp._id}</p>
                    <p><strong>Created:</strong> {signUp.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Notifications ({data.notifications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.notifications.length === 0 ? (
              <p className="text-gray-500">No notifications found</p>
            ) : (
              <div className="space-y-4">
                {data.notifications.map((notification, index) => (
                  <div key={index} className="border p-3 rounded">
                    <p><strong>Title:</strong> {notification.title}</p>
                    <p><strong>Message:</strong> {notification.message}</p>
                    <p><strong>Type:</strong> {notification.type}</p>
                    <p><strong>Employee ID:</strong> {notification.employeeId}</p>
                    <p><strong>Read:</strong> {notification.read ? 'Yes' : 'No'}</p>
                    <p><strong>Timestamp:</strong> {notification.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckLocalStorage;