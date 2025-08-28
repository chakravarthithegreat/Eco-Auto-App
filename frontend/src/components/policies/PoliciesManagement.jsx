import React, { useState } from 'react';
import { usePayrollPolicyStore } from '../../state/payrollPolicyStore';
import { useAttendancePolicyStore } from '../../state/attendancePolicyStore';
import { useLeavePolicyStore } from '../../state/leavePolicyStore';
import { useRewardsStore } from '../../state/rewardsStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  Settings, 
  DollarSign, 
  Clock, 
  Calendar, 
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  Edit2
} from 'lucide-react';

const PoliciesManagement = () => {
  const [activeTab, setActiveTab] = useState('payroll');
  const [isEditing, setIsEditing] = useState(false);

  // Store hooks
  const payrollStore = usePayrollPolicyStore();
  const attendanceStore = useAttendancePolicyStore();
  const leaveStore = useLeavePolicyStore();
  const rewardsStore = useRewardsStore();

  const tabs = [
    { id: 'payroll', name: 'Payroll Policies', icon: DollarSign, color: 'text-success-600' },
    { id: 'attendance', name: 'Attendance Rules', icon: Clock, color: 'text-info-600' },
    { id: 'leave', name: 'Leave Policies', icon: Calendar, color: 'text-warning-600' },
    { id: 'rewards', name: 'Rewards System', icon: Award, color: 'text-primary-600' }
  ];

  // Payroll Policies Component
  const PayrollPoliciesTab = () => {
    const { salaryPolicies, getSalaryStatistics } = payrollStore;
    const stats = getSalaryStatistics();

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalEmployees || 0}</p>
                </div>
                <Users className="w-8 h-8 text-primary-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Cost</p>
                  <p className="text-2xl font-semibold text-success-600">
                    ₹{((stats?.totalMonthlyCost || 0) / 100000).toFixed(1)}L
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-success-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Salary</p>
                  <p className="text-2xl font-semibold text-info-600">
                    ₹{((stats?.averageSalary || 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-info-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Salary Range</p>
                  <p className="text-lg font-semibold text-warning-600">
                    ₹{((stats?.minSalary || 0) / 1000).toFixed(0)}K - ₹{((stats?.maxSalary || 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <Settings className="w-8 h-8 text-warning-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Base Salary Structure */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Base Salary Structure</CardTitle>
            <Button variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Structure
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Role</th>
                    <th className="text-right p-2 font-medium">Fresher</th>
                    <th className="text-right p-2 font-medium">1-2 Years</th>
                    <th className="text-right p-2 font-medium">3-5 Years</th>
                    <th className="text-right p-2 font-medium">Senior</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(salaryPolicies.baseSalaryStructure).map(([role, salaries]) => (
                    <tr key={role} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{role}</td>
                      <td className="p-2 text-right">₹{(salaries.fresher / 1000).toFixed(0)}K</td>
                      <td className="p-2 text-right">₹{(salaries['1-2_years'] / 1000).toFixed(0)}K</td>
                      <td className="p-2 text-right">₹{(salaries['3-5_years'] / 1000).toFixed(0)}K</td>
                      <td className="p-2 text-right">₹{(salaries.senior / 1000).toFixed(0)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Bonuses */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Bonus Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Efficiency Bonus */}
              <div>
                <h4 className="font-medium mb-3">Efficiency Bonus</h4>
                <div className="space-y-2">
                  {Object.entries(salaryPolicies.performanceBonuses.efficiencyBonus).map(([level, bonus]) => (
                    <div key={level} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm capitalize">{level.replace('_', ' ')}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{bonus.percentage}% + ₹{bonus.fixedAmount}</div>
                        <div className="text-xs text-gray-600">{bonus.threshold}%+ efficiency</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Bonus */}
              <div>
                <h4 className="font-medium mb-3">Quality Bonus</h4>
                <div className="space-y-2">
                  {Object.entries(salaryPolicies.performanceBonuses.qualityBonus).map(([level, bonus]) => (
                    <div key={level} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm capitalize">{level.replace('_', ' ')}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{bonus.percentage}% + ₹{bonus.fixedAmount}</div>
                        <div className="text-xs text-gray-600">{bonus.threshold}+ rating</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Bonus */}
              <div>
                <h4 className="font-medium mb-3">Attendance Bonus</h4>
                <div className="space-y-2">
                  {Object.entries(salaryPolicies.performanceBonuses.attendanceBonus).map(([level, bonus]) => (
                    <div key={level} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm capitalize">{level.replace('_', ' ')}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{bonus.percentage}% + ₹{bonus.fixedAmount}</div>
                        <div className="text-xs text-gray-600">{bonus.threshold}%+ attendance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Attendance Policies Component
  const AttendancePoliciesTab = () => {
    const { attendancePolicies, getAttendanceAnalytics } = attendanceStore;
    const analytics = getAttendanceAnalytics();

    return (
      <div className="space-y-6">
        {/* Working Hours Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Working Hours Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Standard Hours</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Start Time:</span>
                    <span className="font-medium">{attendancePolicies.workingHours.standardStartTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Time:</span>
                    <span className="font-medium">{attendancePolicies.workingHours.standardEndTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Hours:</span>
                    <span className="font-medium">{attendancePolicies.workingHours.minimumWorkingHours}h</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">On-Time Rules</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Grace Period:</span>
                    <span className="font-medium">{attendancePolicies.onTimeRules.gracePerod} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Early Bonus:</span>
                    <span className="font-medium text-success-600">₹{attendancePolicies.onTimeRules.earlyArrivalBonus.bonusAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render main component
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Business Policies Management</h2>
          <p className="text-gray-600 mt-1">Configure and manage all business policies and rules</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'payroll' && <PayrollPoliciesTab />}
        {activeTab === 'attendance' && <AttendancePoliciesTab />}
        {activeTab === 'leave' && (
          <div className="p-8 text-center text-gray-600">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Leave Policies</h3>
            <p>Leave management policies configuration coming soon.</p>
          </div>
        )}
        {activeTab === 'rewards' && (
          <div className="p-8 text-center text-gray-600">
            <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Rewards System</h3>
            <p>Rewards system configuration interface coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliciesManagement;