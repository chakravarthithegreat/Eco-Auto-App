import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { usePayrollStore } from '../../state/payrollStore';
import { useAttendanceStore } from '../../state/attendanceStore';
import { useTaskStore } from '../../state/taskStore';
import { useRewardsStore } from '../../state/rewardsStore';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calculator,
  Download,
  Eye,
  Edit,
  Plus,
  Settings,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Send,
  UserCheck,
  BarChart3
} from 'lucide-react';

const PayrollOverview = () => {
  const {
    payrollData,
    payrollPolicy,
    getMonthlyTotals,
    calculateMonthlyPayroll,
    addPayrollRecord,
    processPayroll,
    generatePayslip,
    updatePayrollPolicy
  } = usePayrollStore();
  
  const { attendanceRecords } = useAttendanceStore();
  const { tasks } = useTaskStore();
  const { totalStars, totalButterflies, totalChocolates } = useRewardsStore();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [localPolicy, setLocalPolicy] = useState(payrollPolicy);
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Alex Johnson', role: 'Developer', baseSalary: 65000, isActive: true },
    { id: 2, name: 'Maria Garcia', role: 'Designer', baseSalary: 58000, isActive: true },
    { id: 3, name: 'James Wilson', role: 'Project Manager', baseSalary: 75000, isActive: true },
    { id: 4, name: 'Sarah Chen', role: 'QA Engineer', baseSalary: 52000, isActive: true },
    { id: 5, name: 'Robert Davis', role: 'DevOps Engineer', baseSalary: 70000, isActive: true }
  ]);
  
  const currentMonthTotals = getMonthlyTotals(selectedMonth);
  const currentMonthRecords = payrollData.filter(record => record.month === selectedMonth);
  
  // Generate months for dropdown
  const generateMonths = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      months.push({ value: monthStr, label: monthName });
    }
    return months;
  };
  
  const months = generateMonths();
  
  // Mock data for demonstration
  const mockAttendanceData = {
    1: [
      { date: '2024-08-01', status: 'present', arrivalTime: '08:55:00', hoursWorked: 8.5 },
      { date: '2024-08-02', status: 'present', arrivalTime: '09:10:00', hoursWorked: 8 },
      { date: '2024-08-03', status: 'absent', arrivalTime: null, hoursWorked: 0 },
      { date: '2024-08-04', status: 'present', arrivalTime: '08:45:00', hoursWorked: 9 },
      // ... more data
    ],
    2: [
      { date: '2024-08-01', status: 'present', arrivalTime: '09:05:00', hoursWorked: 8 },
      { date: '2024-08-02', status: 'present', arrivalTime: '08:50:00', hoursWorked: 8.5 },
      // ... more data
    ]
  };
  
  const mockTaskData = {
    1: { completedTasks: 12, missedDeadlines: 2, performanceRating: 4.2 },
    2: { completedTasks: 15, missedDeadlines: 2, performanceRating: 4.5 },
    3: { completedTasks: 10, missedDeadlines: 1, performanceRating: 3.8 },
    4: { completedTasks: 8, missedDeadlines: 0, performanceRating: 4.0 },
    5: { completedTasks: 11, missedDeadlines: 3, performanceRating: 3.5 }
  };
  
  const mockRewardPoints = {
    1: totalStars + totalButterflies + totalChocolates,
    2: 1580,
    3: 980,
    4: 1120,
    5: 856
  };
  
  const handleCalculatePayroll = async (employeeId) => {
    const attendanceData = mockAttendanceData[employeeId] || [];
    const taskData = mockTaskData[employeeId];
    const rewardPoints = mockRewardPoints[employeeId] || 0;
    
    const [year, month] = selectedMonth.split('-');
    
    const result = await calculateMonthlyPayroll(
      employeeId, 
      selectedMonth, 
      parseInt(year), 
      attendanceData, 
      taskData, 
      rewardPoints
    );
    
    if (result.success) {
      addPayrollRecord(result.payroll);
    }
  };
  
  const handleCalculateAll = async () => {
    for (const employee of employees) {
      await handleCalculatePayroll(employee.id);
    }
  };
  
  const getEmployeeRecord = (employeeId) => {
    return currentMonthRecords.find(record => record.userId === employeeId);
  };
  
  const handleSavePolicy = () => {
    updatePayrollPolicy(localPolicy);
    setShowPolicyModal(false);
  };
  
  const exportPayroll = () => {
    // Mock export functionality
    alert(`Exporting payroll data for ${selectedMonth}`);
  };
  
  const generatePayslipPDF = (record) => {
    const payslip = generatePayslip(record);
    console.log('Generated payslip:', payslip);
    alert(`Payslip generated for ${payslip.month}`);
  };

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading-bold text-slate-900">Payroll Overview</h1>
            <p className="text-surface-600 mt-1">Manage employee compensation and salary calculations</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-surface-300 rounded-card focus:ring-2 focus:ring-primary-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <Button variant="outline" onClick={() => setShowPolicyModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Policy
            </Button>
            <Button variant="outline" onClick={exportPayroll}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleCalculateAll}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate All
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary-200 bg-primary-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-600 font-medium">Total Payroll</p>
                  <p className="text-2xl font-heading-bold text-slate-900">
                    ₹{currentMonthTotals.totalFinalPay.toLocaleString()}
                  </p>
                  <p className="text-xs text-primary-600">Final pay after deductions</p>
                </div>
                <div className="w-12 h-12 bg-primary-500 rounded-card flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Bonuses</p>
                  <p className="text-2xl font-heading-bold text-slate-900">
                    ₹{currentMonthTotals.totalBonuses.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">Performance & rewards</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-card flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Total Penalties</p>
                  <p className="text-2xl font-heading-bold text-slate-900">
                    ₹{currentMonthTotals.totalPenalties.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-600">Late & missed deadlines</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-card flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Employees</p>
                  <p className="text-2xl font-heading-bold text-slate-900">
                    {currentMonthTotals.employeeCount}
                  </p>
                  <p className="text-xs text-blue-600">Active this month</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-card flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Payroll Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Employee Payroll - {months.find(m => m.value === selectedMonth)?.label || selectedMonth}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowPolicyModal(true)}>
                  <Settings className="w-4 h-4 mr-1" />
                  Policy
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Employee
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Employee</th>
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Base Salary</th>
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Bonuses</th>
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Penalties</th>
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Gross Pay</th>
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Final Pay</th>
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Status</th>
                    <th className="text-right py-3 text-sm font-medium text-surface-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.filter(emp => emp.isActive).map((employee) => {
                    const record = getEmployeeRecord(employee.id);
                    
                    return (
                      <tr key={employee.id} className="border-b border-surface-100 hover:bg-surface-50">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {employee.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{employee.name}</p>
                              <p className="text-sm text-surface-600">{employee.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-slate-900">₹{employee.baseSalary.toLocaleString()}</td>
                        <td className="py-4">
                          {record ? (
                            <span className="text-green-600 font-medium">+₹{record.totalBonuses.toLocaleString()}</span>
                          ) : (
                            <span className="text-surface-400">Not calculated</span>
                          )}
                        </td>
                        <td className="py-4">
                          {record ? (
                            <span className="text-orange-600 font-medium">-₹{record.totalPenalties.toLocaleString()}</span>
                          ) : (
                            <span className="text-surface-400">Not calculated</span>
                          )}
                        </td>
                        <td className="py-4 font-medium text-slate-900">
                          {record ? `₹${record.grossSalary.toLocaleString()}` : 'Not calculated'}
                        </td>
                        <td className="py-4 font-bold text-primary-600">
                          {record ? `₹${record.netSalary.toLocaleString()}` : 'Not calculated'}
                        </td>
                        <td className="py-4">
                          {record ? (
                            <Badge variant={record.status === 'processed' ? 'success' : 'warning'}>
                              {record.status === 'processed' ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Processed
                                </>
                              ) : (
                                <>
                                  <Calculator className="w-3 h-3 mr-1" />
                                  Calculated
                                </>
                              )}
                            </Badge>
                          ) : (
                            <Badge variant="default">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            {record ? (
                              <>
                                <Button variant="outline" size="sm" onClick={() => generatePayslipPDF(record)}>
                                  <FileText className="w-4 h-4 mr-1" />
                                  Payslip
                                </Button>
                                {record.status === 'calculated' && (
                                  <Button size="sm" onClick={() => processPayroll(record.id)}>
                                    <Send className="w-4 h-4 mr-1" />
                                    Process
                                  </Button>
                                )}
                              </>
                            ) : (
                              <Button size="sm" onClick={() => handleCalculatePayroll(employee.id)}>
                                <Calculator className="w-4 h-4 mr-1" />
                                Calculate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Breakdown */}
        {currentMonthRecords.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Bonus Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentMonthRecords.map((record) => {
                    const employee = employees.find(emp => emp.id === record.userId);
                    return (
                      <div key={record.id} className="p-4 bg-green-50 rounded-card border border-green-100">
                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          {employee?.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-surface-600">Performance:</span>
                            <span className="float-right font-medium">₹{record.performanceBonus}</span>
                          </div>
                          <div>
                            <span className="text-surface-600">Attendance:</span>
                            <span className="float-right font-medium">₹{record.attendanceBonus}</span>
                          </div>
                          <div>
                            <span className="text-surface-600">Tasks:</span>
                            <span className="float-right font-medium">₹{record.taskCompletionBonus}</span>
                          </div>
                          <div>
                            <span className="text-surface-600">Overtime:</span>
                            <span className="float-right font-medium">₹{record.overtimePay}</span>
                          </div>
                          <div>
                            <span className="text-surface-600">Rewards:</span>
                            <span className="float-right font-medium">₹{record.rewardPointsBonus}</span>
                          </div>
                          <div className="border-t border-green-200 pt-2 mt-1">
                            <span className="text-surface-900 font-medium">Total:</span>
                            <span className="float-right font-bold text-green-600">₹{record.totalBonuses}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                  Penalty Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentMonthRecords.map((record) => {
                    const employee = employees.find(emp => emp.id === record.userId);
                    return (
                      <div key={record.id} className="p-4 bg-orange-50 rounded-card border border-orange-100">
                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          {employee?.name}
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-surface-600">Late Days:</span>
                            <span className="float-right font-medium">-₹{record.latePenalty}</span>
                          </div>
                          <div>
                            <span className="text-surface-600">Absent Days:</span>
                            <span className="float-right font-medium">-₹{record.absentPenalty}</span>
                          </div>
                          <div>
                            <span className="text-surface-600">Missed Deadlines:</span>
                            <span className="float-right font-medium">-₹{record.missedDeadlinePenalty}</span>
                          </div>
                          <div>
                            <span className="text-surface-600">Leave Deductions:</span>
                            <span className="float-right font-medium">-₹{record.leaveDeductions}</span>
                          </div>
                          <div className="border-t border-orange-200 pt-2 mt-1">
                            <span className="text-surface-900 font-medium">Total:</span>
                            <span className="float-right font-bold text-orange-600">-₹{record.totalPenalties}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payroll Policy Modal */}
        {showPolicyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-surface-200">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Payroll Policy Settings
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Base Salary (₹)
                    </label>
                    <input
                      type="number"
                      value={localPolicy.baseSalary}
                      onChange={(e) => setLocalPolicy({...localPolicy, baseSalary: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Performance Bonus (₹)
                    </label>
                    <input
                      type="number"
                      value={localPolicy.performanceBonus}
                      onChange={(e) => setLocalPolicy({...localPolicy, performanceBonus: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Attendance Bonus (₹)
                    </label>
                    <input
                      type="number"
                      value={localPolicy.attendanceBonus}
                      onChange={(e) => setLocalPolicy({...localPolicy, attendanceBonus: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Late Penalty per Day (₹)
                    </label>
                    <input
                      type="number"
                      value={localPolicy.latePenalty}
                      onChange={(e) => setLocalPolicy({...localPolicy, latePenalty: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Overtime Rate (Multiplier)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={localPolicy.overtimeRate}
                      onChange={(e) => setLocalPolicy({...localPolicy, overtimeRate: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Working Days per Month
                    </label>
                    <input
                      type="number"
                      value={localPolicy.workingDaysPerMonth}
                      onChange={(e) => setLocalPolicy({...localPolicy, workingDaysPerMonth: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={localPolicy.taxRate * 100}
                      onChange={(e) => setLocalPolicy({...localPolicy, taxRate: Number(e.target.value) / 100})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Provident Fund Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={localPolicy.pfRate * 100}
                      onChange={(e) => setLocalPolicy({...localPolicy, pfRate: Number(e.target.value) / 100})}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-surface-200 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPolicyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePolicy}
                >
                  Save Policy
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default PayrollOverview;