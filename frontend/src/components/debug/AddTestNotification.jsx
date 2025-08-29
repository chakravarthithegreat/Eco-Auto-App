import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { storeNotification } from '../../utils/notificationUtils';

const AddTestNotification = () => {
  const [notificationData, setNotificationData] = useState({
    type: 'employee-registration',
    title: 'Test Employee Registration',
    message: 'This is a test notification',
    employeeId: 'test-employee-id',
    employeeName: 'Test Employee'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addNotification = () => {
    console.log('AddTestNotification: Adding notification:', notificationData);
    const result = storeNotification(notificationData);
    console.log('AddTestNotification: Stored notification result:', result);
    alert('Notification added! Check the notifications page.');
  };

  const clearNotifications = () => {
    localStorage.setItem('employeeNotifications', JSON.stringify([]));
    alert('Notifications cleared!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Test Notification</h1>
        <p className="text-gray-500">
          Manually add a test notification to localStorage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              name="type"
              value={notificationData.type}
              onChange={handleInputChange}
              placeholder="Notification type"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={notificationData.title}
              onChange={handleInputChange}
              placeholder="Notification title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              name="message"
              value={notificationData.message}
              onChange={handleInputChange}
              placeholder="Notification message"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input
              id="employeeId"
              name="employeeId"
              value={notificationData.employeeId}
              onChange={handleInputChange}
              placeholder="Employee ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employeeName">Employee Name</Label>
            <Input
              id="employeeName"
              name="employeeName"
              value={notificationData.employeeName}
              onChange={handleInputChange}
              placeholder="Employee name"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button onClick={addNotification}>Add Notification</Button>
            <Button variant="outline" onClick={clearNotifications}>Clear All Notifications</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTestNotification;