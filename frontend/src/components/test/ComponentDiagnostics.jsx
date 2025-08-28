import React, { useState, useEffect } from 'react';

import AdminDashboard from '../dashboard/AdminDashboard';
import EnhancedManagerDashboard from '../dashboard/EnhancedManagerDashboard';
import TeamMemberDashboard from '../dashboard/TeamMemberDashboard';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

const ComponentDiagnostics = () => {
  const [currentTest, setCurrentTest] = useState('admin');
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState({});

  const runTest = (componentName, Component) => {
    try {
      console.log(`Testing ${componentName}...`);
      // Try to render the component
      const element = <Component />;
      setTestResults(prev => ({
        ...prev,
        [componentName]: { status: 'success', element }
      }));
      console.log(`${componentName} test passed`);
    } catch (err) {
      console.error(`${componentName} test failed:`, err);
      setTestResults(prev => ({
        ...prev,
        [componentName]: { status: 'error', error: err.message }
      }));
      setError(err);
    }
  };

  const runAllTests = () => {
    setError(null);
    setTestResults({});
    

    
    // Test individual dashboards
    runTest('AdminDashboard', AdminDashboard);
    runTest('EnhancedManagerDashboard', EnhancedManagerDashboard);
    runTest('TeamMemberDashboard', TeamMemberDashboard);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const renderTestComponent = () => {
    switch (currentTest) {
      case 'admin':
        return <AdminDashboard />;
      case 'manager':
        return <EnhancedManagerDashboard />;
      case 'team-member':
        return <TeamMemberDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Component Diagnostics</h1>
      
      {/* Test Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={runAllTests} variant="default">
              Run All Tests
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button 
              onClick={() => setCurrentTest('admin')}
              variant={currentTest === 'admin' ? 'default' : 'outline'}
              className="w-full"
            >
              Admin Dashboard
            </Button>
            <Button 
              onClick={() => setCurrentTest('manager')}
              variant={currentTest === 'manager' ? 'default' : 'outline'}
              className="w-full"
            >
              Manager Dashboard
            </Button>
            <Button 
              onClick={() => setCurrentTest('team-member')}
              variant={currentTest === 'team-member' ? 'default' : 'outline'}
              className="w-full"
            >
              Team Member Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Test Results */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(testResults).map(([componentName, result]) => (
              <div 
                key={componentName} 
                className={`p-3 rounded-lg ${
                  result.status === 'success' 
                    ? 'bg-green-100 border border-green-300' 
                    : 'bg-red-100 border border-red-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{componentName}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.status === 'success' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {result.status}
                  </span>
                </div>
                {result.status === 'error' && (
                  <p className="text-sm text-red-700 mt-1">{result.error}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Error Display */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Details</h2>
            <p className="text-red-700">{error.message}</p>
            <pre className="mt-2 p-3 bg-red-100 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </CardContent>
        </Card>
      )}
      
      {/* Component Preview */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            {currentTest === 'admin' && 'Admin Dashboard'}
            {currentTest === 'manager' && 'Manager Dashboard'}
            {currentTest === 'team-member' && 'Team Member Dashboard'}
          </h2>
          <div className="border border-gray-200 rounded-lg p-4 min-h-[500px]">
            {renderTestComponent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentDiagnostics;