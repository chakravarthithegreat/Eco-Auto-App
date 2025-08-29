import React, { useState } from 'react';
import { useAuthStore } from '../../state/authStore';
import { useNavigationStore } from '../../state/navigationStore';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Alert, AlertDescription } from '../ui/Alert';
import { User, Lock, Eye, EyeOff, Building, Users } from 'lucide-react';

const EmployeeLogin = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const { setCurrentPage } = useNavigationStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return;
    }
    
    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      // Navigate to appropriate dashboard based on role
      const role = result.user.role;
      if (role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (role === 'manager') {
        setCurrentPage('manager-dashboard');
      } else {
        setCurrentPage('team-dashboard');
      }
    }
  };

  const handleDemoLogin = async (role) => {
    const demoCredentials = {
      admin: { username: 'meera.iyer', password: 'password123' },
      manager: { username: 'rajesh.kumar', password: 'password123' },
      employee: { username: 'amit.patel', password: 'password123' }
    };
    
    const credentials = demoCredentials[role];
    setFormData(credentials);
    
    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      if (role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (role === 'manager') {
        setCurrentPage('manager-dashboard');
      } else {
        setCurrentPage('team-dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Eco-Auto App</h1>
          <p className="text-gray-600">Employee Portal</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <p className="text-gray-600">Sign in to your account</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username or email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !formData.username || !formData.password}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Login Buttons */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('admin')}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Demo Admin
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('manager')}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Building className="w-4 h-4 mr-2" />
                  Demo Manager
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('employee')}
                  className="w-full"
                  disabled={isLoading}
                >
                  <User className="w-4 h-4 mr-2" />
                  Demo Employee
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                New employee?{' '}
                <button
                  onClick={() => setCurrentPage('employee-signup')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create account
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Eco-Auto App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
