import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const EmployeeNotificationsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Employee Notification Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Employee notifications page is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeNotificationsPage;
