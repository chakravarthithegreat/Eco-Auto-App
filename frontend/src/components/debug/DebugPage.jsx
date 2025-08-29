import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const DebugPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Tools</h1>
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Debug page is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPage;
