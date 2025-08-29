import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const HelpPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>
      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Help page is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
