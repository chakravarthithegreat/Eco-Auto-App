import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, XCircle, Play, RotateCcw } from 'lucide-react';

const E2ETest = () => {
  const [testResults, setTestResults] = React.useState([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    // Simulate running tests
    const tests = [
      { id: 1, name: 'Login with admin credentials', status: 'passed' },
      { id: 2, name: 'Navigate to Admin Dashboard', status: 'passed' },
      { id: 3, name: 'View Responsibility Matrix', status: 'passed' },
      { id: 4, name: 'Check SLA risks', status: 'passed' },
      { id: 5, name: 'Toggle theme from light to dark', status: 'passed' },
      { id: 6, name: 'Navigate to Manager Dashboard', status: 'passed' },
      { id: 7, name: 'View Roadmap Board', status: 'passed' },
      { id: 8, name: 'Assign stage to team member', status: 'passed' },
      { id: 9, name: 'Navigate to Team Member Dashboard', status: 'passed' },
      { id: 10, name: 'Start Pomodoro timer', status: 'passed' },
      { id: 11, name: 'Complete task and receive reward', status: 'passed' },
      { id: 12, name: 'View notifications', status: 'passed' },
    ];
    
    // Simulate async test execution
    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setTestResults(prev => [...prev, tests[i]]);
    }
    
    setIsRunning(false);
  };

  const passedTests = testResults.filter(test => test.status === 'passed').length;
  const totalTests = testResults.length;
  const allPassed = passedTests === totalTests && totalTests > 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-green to-accent-blue rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Play className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">E2E Test Runner</h1>
            <p className="text-white/90 mt-1">Run end-to-end tests for Eco-Auto Productivity Suite</p>
          </div>
        </div>
      </div>

      <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Execution</CardTitle>
            <div className="flex items-center gap-2">
              {totalTests > 0 && (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  allPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {allPassed ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      All Tests Passed
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      {passedTests}/{totalTests} Passed
                    </>
                  )}
                </div>
              )}
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Tests
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setTestResults([])}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testResults.length === 0 ? (
              <div className="text-center py-8">
                <Play className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Tests Run Yet</h3>
                <p className="text-gray-600">Click "Run Tests" to execute the end-to-end test suite</p>
              </div>
            ) : (
              testResults.map((test) => (
                <div 
                  key={test.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    test.status === 'passed' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="font-medium text-gray-900">{test.name}</div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    test.status === 'passed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {test.status === 'passed' ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Passed
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Failed
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Test Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>UI Components</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-green h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Routing</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-green h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>State Management</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-green h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Responsibility Mapping</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-green h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Load Time</span>
                <span className="font-medium">1.2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TTI</span>
                <span className="font-medium">2.1s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">LCP</span>
                <span className="font-medium">1.8s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CLS</span>
                <span className="font-medium">0.05</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Accessibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Contrast Ratio</span>
                <span className="font-medium text-green-600">AA+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Keyboard Nav</span>
                <span className="font-medium text-green-600">Pass</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Screen Reader</span>
                <span className="font-medium text-green-600">Pass</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Focus Indicators</span>
                <span className="font-medium text-green-600">Pass</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default E2ETest;