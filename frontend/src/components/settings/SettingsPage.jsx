import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Settings page is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
