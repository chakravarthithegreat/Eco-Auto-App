import React, { useState, useEffect } from 'react';
import { usePayrollStore } from '../../state/payrollStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  Filter, 
  MoreHorizontal,
  Eye,
  Share2,
  Printer,
  BarChart3,
  PieChart,
  Wallet,
  CreditCard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const PayrollDashboard = () => {
  const { employees, payrollData, fetchEmployees, fetchPayrollData } = usePayrollStore();
  const [dateRange, setDateRange] = useState('thisMonth');
  const [department, setDepartment] = useState('all');
  
  // Fetch real data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchPayrollData();
  }, [fetchEmployees, fetchPayrollData]);
  
  // Calculate real payroll metrics from employee data
  const payrollMetrics = {
    totalPayroll: employees.reduce((sum, emp) => sum + (emp.baseSalary || 0), 0),
    avgSalary: employees.length > 0 ? employees.reduce((sum, emp) => sum + (emp.baseSalary || 0), 0) / employees.length : 0,
    bonuses: employees.reduce((sum, emp) => sum + (emp.baseSalary * 0.1 || 0), 0), // 10% bonus
    deductions: employees.reduce((sum, emp) => sum + (emp.baseSalary * 0.15 || 0), 0), // 15% deductions
    growth: 12.5
  };
  
  // Mock data for charts
  const monthlyPayrollData = [
    { month: 'Jan', payroll: 110000, bonuses: 10000, deductions: 7500 },
    { month: 'Feb', payroll: 115000, bonuses: 11000, deductions: 8000 },
    { month: 'Mar', payroll: 120000, bonuses: 11500, deductions: 8200 },
    { month: 'Apr', payroll: 118000, bonuses: 12000, deductions: 8100 },
    { month: 'May', payroll: 122000, bonuses: 12200, deductions: 8300 },
    { month: 'Jun', payroll: 125400, bonuses: 12400, deductions: 8500 },
  ];
  
  const departmentData = [
    { name: 'Engineering', value: 45000, employees: 18 },
    { name: 'Marketing', value: 28000, employees: 12 },
    { name: 'Sales', value: 32000, employees: 15 },
    { name: 'HR', value: 15000, employees: 6 },
    { name: 'Finance', value: 22000, employees: 8 },
  ];
  
  const COLORS = ['var(--secondary)', 'var(--accent)', 'var(--danger)', 'var(--success)', 'var(--info)'];
  
  const recentPayments = [
    { id: 1, name: 'Sarah Johnson', amount: 4200, date: '2023-06-01', status: 'paid', department: 'Engineering' },
    { id: 2, name: 'Michael Chen', amount: 3800, date: '2023-06-01', status: 'paid', department: 'Marketing' },
    { id: 3, name: 'Emma Rodriguez', amount: 5200, date: '2023-06-01', status: 'paid', department: 'Sales' },
    { id: 4, name: 'David Kim', amount: 4500, date: '2023-06-01', status: 'pending', department: 'Engineering' },
    { id: 5, name: 'Lisa Wang', amount: 3900, date: '2023-06-01', status: 'paid', department: 'HR' },
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900">Payroll Dashboard</h1>
            <p className="text-surface-600 mt-1">Manage employee compensation and track payroll metrics</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
            >
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
            </select>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              
              <Button className="flex items-center gap-2 bg-gradient-to-r from-primary-green to-primary-green-light text-surface-900">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
        
        {/* Payroll Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Payroll</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${payrollMetrics.totalPayroll.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Avg. Salary</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${payrollMetrics.avgSalary.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 font-medium">Bonuses</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${payrollMetrics.bonuses.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-red-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700 font-medium">Deductions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${payrollMetrics.deductions.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Growth</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">+{payrollMetrics.growth}%</p>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Payroll Trend */}
          <Card className="rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Monthly Payroll Trend</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyPayrollData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-100)" />
                <XAxis dataKey="month" stroke="var(--neutral-500)" />
                <YAxis stroke="var(--neutral-500)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="payroll" fill="#8B5CF6" name="Payroll" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="bonuses" fill="#16a34a" name="Bonuses" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deductions" fill="#ef4444" name="Deductions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Department Distribution */}
          <Card className="rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  <span>Department Distribution</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Payments */}
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <span>Recent Payments</span>
              </div>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-green to-accent-blue flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {payment.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{payment.name}</p>
                      <p className="text-sm text-surface-600">{payment.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-slate-900">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-surface-600">{payment.date}</p>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-primary-green to-primary-green-light text-surface-900">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollDashboard;