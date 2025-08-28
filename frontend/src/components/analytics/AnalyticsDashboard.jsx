import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAnalyticsStore } from '../../state/analyticsStore';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  MoreHorizontal,
  ChevronRight,
  Eye,
  Share2,
  Printer,
  Zap,
  UserCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const {
    productivityData,
    attendanceData,
    taskData,
    rewardData,
    projectData,
    payrollData,
    timeTrackingData,
    efficiencyMetrics,
    isLoading,
    error,
    fetchAnalyticsData,
    updateReportSettings,
    exportReport
  } = useAnalyticsStore();
  
  const [dateRange, setDateRange] = useState('last30days');
  const [department, setDepartment] = useState('all');
  const [employee, setEmployee] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    fetchAnalyticsData();
  }, []);
  
  useEffect(() => {
    updateReportSettings({ dateRange, department, employee });
  }, [dateRange, department, employee]);
  
  const COLORS = ['var(--secondary)', 'var(--accent)', 'var(--danger)', 'var(--success)', 'var(--info)', 'var(--warning)'];
  
  const handleExport = (format) => {
    exportReport(format);
    alert(`Report exported in ${format} format`);
  };
  
  // Mock data for additional charts
  const performanceData = [
    { name: 'Mon', performance: 78, target: 85 },
    { name: 'Tue', performance: 82, target: 85 },
    { name: 'Wed', performance: 75, target: 85 },
    { name: 'Thu', performance: 88, target: 85 },
    { name: 'Fri', performance: 90, target: 85 },
    { name: 'Sat', performance: 70, target: 85 },
    { name: 'Sun', performance: 85, target: 85 },
  ];
  
  const skillData = [
    { subject: 'Communication', A: 120, B: 110, fullMark: 150 },
    { subject: 'Technical', A: 98, B: 130, fullMark: 150 },
    { subject: 'Leadership', A: 86, B: 130, fullMark: 150 },
    { subject: 'Problem Solving', A: 99, B: 100, fullMark: 150 },
    { subject: 'Creativity', A: 85, B: 90, fullMark: 150 },
    { subject: 'Time Management', A: 65, B: 85, fullMark: 150 },
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading analytics data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-900">Analytics Dashboard</h1>
            <p className="text-surface-600 mt-1">Comprehensive productivity and performance insights</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Tab Navigation */}
      <div className="flex border-b border-surface-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 font-medium text-sm border-b-2 transition-all duration-300 ${
            activeTab === 'overview'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-5 py-3 font-medium text-sm border-b-2 transition-all duration-300 ${
            activeTab === 'team'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          Team Performance
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-5 py-3 font-medium text-sm border-b-2 transition-all duration-300 ${
            activeTab === 'projects'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          Projects
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="flex flex-wrap items-center gap-4 p-5 bg-surface-50 rounded-2xl border border-surface-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-surface-600" />
          <span className="text-sm font-medium text-surface-700">Filters:</span>
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm hover:shadow-md transition-shadow"
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last90days">Last 90 Days</option>
          <option value="thisYear">This Year</option>
        </select>
        
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm hover:shadow-md transition-shadow"
        >
          <option value="all">All Departments</option>
          <option value="design">Design</option>
          <option value="development">Development</option>
          <option value="marketing">Marketing</option>
          <option value="sales">Sales</option>
        </select>
        
        <div className="ml-auto flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleExport('pdf')} 
            className="flex items-center gap-2 px-4 py-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleExport('csv')} 
            className="flex items-center gap-2 px-4 py-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Efficiency Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Productivity</h3>
                <div className="text-3xl font-bold">87%</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Attendance</h3>
                <div className="text-3xl font-bold">92%</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Task Completion</h3>
                <div className="text-3xl font-bold">78%</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">On Time</h3>
                <div className="text-3xl font-bold">85%</div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-500" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
                  <XAxis dataKey="name" stroke="var(--neutral-500)" />
                  <YAxis stroke="var(--neutral-500)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid var(--neutral-200)', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                  />
                  <Area type="monotone" dataKey="performance" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="target" stroke="var(--success)" fill="var(--success)" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Distribution */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary-500" />
              Skill Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="var(--neutral-200)" />
                  <PolarAngleAxis dataKey="subject" stroke="var(--neutral-500)" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="var(--neutral-500)" />
                  <Radar name="Current" dataKey="A" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.3} />
                  <Radar name="Target" dataKey="B" stroke="var(--success)" fill="var(--success)" fillOpacity={0.2} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyan-100 rounded-xl">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-bold text-cyan-800">Team Growth</h3>
            </div>
            <div className="text-3xl font-bold text-cyan-900 mb-1">+12%</div>
            <div className="text-sm text-cyan-700">From last month</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-violet-100 rounded-xl">
                <Target className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-bold text-violet-800">Goal Achievement</h3>
            </div>
            <div className="text-3xl font-bold text-violet-900 mb-1">89%</div>
            <div className="text-sm text-violet-700">Quarterly targets</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Award className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-rose-800">Recognition</h3>
            </div>
            <div className="text-3xl font-bold text-rose-900 mb-1">42</div>
            <div className="text-sm text-rose-700">Rewards given</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;