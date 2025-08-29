import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

const LocalStorageDebug = () => {
  const [signUps, setSignUps] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const loadLocalStorageData = () => {
    try {
      const signUpsData = JSON.parse(localStorage.getItem('employeeSignUps') || '[]');
      const notificationsData = JSON.parse(localStorage.getItem('employeeNotifications') || '[]');
      setSignUps(signUpsData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading localStorage data:', error);
    }
  };

  useEffect(() => {
    loadLocalStorageData();
  }, []);

  const clearAllData = () => {
    localStorage.removeItem('employeeSignUps');
    localStorage.removeItem('employeeNotifications');
    loadLocalStorageData();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Local Storage Debug</h1>
        <p className="text-gray-500">
          Debugging employee sign-ups and notifications
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={loadLocalStorageData}>Refresh Data</Button>
        <Button variant="destructive" onClick={clearAllData}>Clear All Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee SignUps ({signUps.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {signUps.length === 0 ? (
              <p className="text-gray-500">No sign-ups found</p>
            ) : (
              <div className="space-y-4">
                {signUps.map((signUp, index) => (
                  <div key={index} className="border p-3 rounded">
                    <p><strong>Name:</strong> {signUp.fullName}</p>
                    <p><strong>Email:</strong> {signUp.email}</p>
                    <p><strong>Status:</strong> {signUp.profileStatus}</p>
                    <p><strong>ID:</strong> {signUp._id}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Notifications ({notifications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications found</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <div key={index} className="border p-3 rounded">
                    <p><strong>Title:</strong> {notification.title}</p>
                    <p><strong>Message:</strong> {notification.message}</p>
                    <p><strong>Type:</strong> {notification.type}</p>
                    <p><strong>Employee ID:</strong> {notification.employeeId}</p>
                    <p><strong>Read:</strong> {notification.read ? 'Yes' : 'No'}</p>
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

export default LocalStorageDebug;