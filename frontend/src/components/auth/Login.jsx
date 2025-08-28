import React, { useState } from 'react';
import { useAuthStore } from '../../state/authStore';
import { Eye, EyeOff, User, Lock, LogIn, ArrowRight, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error, clearError } = useAuthStore();

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
    
    // Basic validation
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      console.log('Login successful:', result.user);
    } else {
      console.error('Login failed:', result.error);
    }
  };

  const handleQuickLogin = async (role) => {
    const credentials = {
      admin: { username: 'meera.iyer@artgifts.com', password: 'password123' },
      manager: { username: 'rajesh.kumar@artgifts.com', password: 'password123' },
      team_member: { username: 'amit.patel@artgifts.com', password: 'password123' }
    };

    const creds = credentials[role];
    if (creds) {
      setFormData(creds);
      await login(creds);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-primary-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.05),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 animate-fadeIn border border-surface-100/50 hover:shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 transform hover:scale-105 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 mb-2">Welcome to Eco-Auto</h1>
            <p className="text-surface-600 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-100 rounded-xl text-danger-700 text-sm animate-slide-down flex items-center gap-3 shadow-sm">
              <svg className="w-5 h-5 shrink-0 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-surface-700">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 text-sm bg-white text-surface-700 shadow-sm hover:shadow-md group"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-surface-700">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 text-sm bg-white text-surface-700 shadow-sm hover:shadow-md group"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-surface-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
              className="w-full py-3 rounded-xl font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-surface-500">Or continue with</span>
            </div>
          </div>

          {/* Quick Login Section */}
          <div className="space-y-4">
            <p className="text-xs text-surface-500 text-center">Quick login for testing:</p>
            <div className="flex justify-center gap-3">
              <Button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={isLoading}
                variant="outline"
                className="text-xs px-4 py-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors text-surface-700 shadow-sm hover:shadow-md"
              >
                Admin
              </Button>
              <Button
                type="button"
                onClick={() => handleQuickLogin('manager')}
                disabled={isLoading}
                variant="outline"
                className="text-xs px-4 py-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors text-surface-700 shadow-sm hover:shadow-md"
              >
                Manager
              </Button>
              <Button
                type="button"
                onClick={() => handleQuickLogin('team_member')}
                disabled={isLoading}
                variant="outline"
                className="text-xs px-4 py-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors text-surface-700 shadow-sm hover:shadow-md"
              >
                Member
              </Button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-100 text-center">
            <p className="text-xs text-primary-700 font-medium mb-2 flex items-center justify-center gap-1">
              <Shield className="w-4 h-4" />
              Demo Credentials
            </p>
            <div className="text-xs text-primary-600 space-y-1">
              <div><span className="inline-block px-2 py-0.5 rounded bg-white text-primary-700 mr-1 font-medium shadow-sm">Admin</span> meera.iyer@artgifts.com / password123</div>
              <div><span className="inline-block px-2 py-0.5 rounded bg-white text-primary-700 mr-1 font-medium shadow-sm">Manager</span> rajesh.kumar@artgifts.com / password123</div>
              <div><span className="inline-block px-2 py-0.5 rounded bg-white text-primary-700 mr-1 font-medium shadow-sm">Member</span> amit.patel@artgifts.com / password123</div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-xs text-surface-500">
          © 2025 Eco-Auto. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;