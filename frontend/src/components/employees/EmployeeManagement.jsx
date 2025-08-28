import React, { useState } from 'react';
import { usePayrollStore } from '../../state/payrollStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  User, 
  Phone, 
  Mail, 
  Clock, 
  Search, 
  ChevronRight, 
  Briefcase, 
  Calendar,
  Users,
  Clock4,
  BarChart3,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Printer
} from 'lucide-react';

const EmployeeManagement = () => {
  const { employees } = usePayrollStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.subRole.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const getExperienceInYears = (employee) => {
    // This would normally calculate from joinDate, but for demo we'll return random values
    return Math.floor(Math.random() * 5) + 1;
  };
  
  const getWorkHoursData = (employee) => {
    // Mock data for work hours
    return {
      average: 46,
      change: '+0.5%',
      hours: [8, 9, 7, 8, 8, 6, 0],
      dotsActive: Array(30).fill(0).map(() => Math.random() > 0.3)
    };
  };
  
  // Get employee statistics
  const getEmployeeStats = () => {
    return {
      total: employees?.length || 0,
      active: employees?.filter(emp => emp.isActive).length || 0,
      managers: employees?.filter(emp => emp.role === 'Manager').length || 0,
      teamMembers: employees?.filter(emp => emp.role === 'Team Member').length || 0
    };
  };
  
  const employeeStats = getEmployeeStats();
  
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-500">Manage employees and track their performance</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              
              <Button className="flex items-center gap-2 bg-gradient-to-r from-primary-green to-primary-green-light text-surface-900">
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </div>
          </div>
        </div>
        
        {/* Employee Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{employeeStats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{employeeStats.active}</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 font-medium">Managers</p>
                  <p className="text-2xl font-bold text-gray-900">{employeeStats.managers}</p>
                </div>
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">{employeeStats.teamMembers}</p>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Employees
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('managers')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'managers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Managers
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'team'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Team Members
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee List/Grid */}
          <div className={selectedEmployee ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Team Members</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className="flex items-center gap-2"
                    >
                      {viewMode === 'grid' ? 'List View' : 'Grid View'}
                    </Button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredEmployees.map((employee) => (
                      <div 
                        key={employee.id}
                        onClick={() => setSelectedEmployee(employee)}
                        className={`border rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer ${
                          selectedEmployee?.id === employee.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img 
                              src={employee.image || `https://randomuser.me/api/portraits/${employee.id % 2 === 0 ? 'women' : 'men'}/${employee.id}.jpg`}
                              alt={employee.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{employee.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{employee.subRole}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {employee.role}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>46h/week</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-green-600 text-xs">Active</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="divide-y divide-gray-100">
                    {filteredEmployees.map((employee) => (
                      <div 
                        key={employee.id}
                        onClick={() => setSelectedEmployee(employee)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between ${
                          selectedEmployee?.id === employee.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src={employee.image || `https://randomuser.me/api/portraits/${employee.id % 2 === 0 ? 'women' : 'men'}/${employee.id}.jpg`}
                              alt={employee.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{employee.name}</h3>
                            <p className="text-sm text-gray-500">{employee.subRole}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {employee.role}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>46h/week</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-green-600 text-xs">Active</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Employee Details */}
          {selectedEmployee && (
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Employee Profile Card */}
                <Card className="rounded-2xl overflow-hidden">
                  <div className="p-0">
                    <div className="relative bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-6">
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                          {getExperienceInYears(selectedEmployee)}+ years experience
                        </Badge>
                      </div>
                      
                      <div className="mt-8 bg-white rounded-3xl overflow-hidden">
                        <img 
                          src={selectedEmployee.image || `https://randomuser.me/api/portraits/${selectedEmployee.id % 2 === 0 ? 'women' : 'men'}/${selectedEmployee.id}.jpg`}
                          alt={selectedEmployee.name}
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                      
                      <div className="bg-white/90 backdrop-blur-sm p-4 -mx-6 mt-6 -mb-6 border-t border-gray-100">
                        <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                        <p className="text-gray-500 text-sm">{selectedEmployee.subRole}</p>
                        
                        <div className="flex mt-3 gap-2">
                          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Phone className="w-5 h-5 text-gray-700" />
                          </button>
                          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Mail className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 pt-8">
                      <h4 className="text-gray-500 mb-2">Average work time</h4>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">46 hours</div>
                        <div className="text-green-500 font-medium">+0.5% ↑</div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="relative h-16">
                          <div className="absolute inset-0">
                            <svg className="w-full h-full" viewBox="0 0 300 80">
                              <path
                                d="M0,40 C60,10 120,70 180,40 C240,10 300,40 300,40"
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="2"
                              />
                              <path
                                d="M0,40 C60,10 120,70 180,40 C240,10 300,40 300,40"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                              />
                              <circle cx="220" cy="25" r="6" fill="white" stroke="#3b82f6" strokeWidth="2" />
                            </svg>
                          </div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                            8 Hours
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <div>0 H</div>
                          <div>4 H</div>
                          <div>8 H</div>
                          <div>10 H</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Employee Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Team Distribution */}
                  <Card className="rounded-2xl overflow-hidden">
                    <div className="team-distribution-card">
                      <div className="team-distribution-segment team-distribution-segment-primary">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="w-5 h-5" />
                          <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                            +2.6%
                          </div>
                        </div>
                        <div className="text-3xl font-bold mt-2">151%</div>
                        <div className="text-white/80 text-sm mt-1">Onsite team</div>
                      </div>
                      
                      <div className="team-distribution-segment team-distribution-segment-secondary">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-blue-600">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                            +2.6%
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-800 mt-2">38%</div>
                        <div className="text-gray-500 text-sm mt-1">Remote team</div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Working Hours Matrix */}
                  <Card className="rounded-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">Working Hours</h3>
                        <div className="p-2 rounded-full bg-blue-100">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">{getWorkHoursData(selectedEmployee).average}</span>
                        <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded mb-1">
                          {getWorkHoursData(selectedEmployee).change}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">avg hours / weeks</p>
                      
                      <div className="mt-4 grid grid-cols-10 gap-1">
                        {getWorkHoursData(selectedEmployee).dotsActive.map((active, i) => (
                          <div 
                            key={i}
                            className={`w-5 h-5 rounded-full ${active ? 'bg-blue-600/80' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
                
                {/* Salary Breakdown */}
                <Card className="rounded-2xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Salary Breakdown</h3>
                      <div className="text-sm text-gray-500">Monthly</div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="salary-component salary-component-primary">
                        <span>Basic Salary</span>
                        <span className="font-semibold">${selectedEmployee.baseSalary.toLocaleString()}</span>
                      </div>
                      
                      <div className="salary-component salary-component-secondary">
                        <span>Performance Bonus</span>
                        <span className="font-semibold">$300</span>
                      </div>
                      
                      <div className="salary-component salary-component-primary">
                        <span>Gift Bonus</span>
                        <span className="font-semibold">$200</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-gray-500 text-sm">Take Home Pay</div>
                        <div className="text-3xl font-bold text-gray-900 mt-1">
                          ${(selectedEmployee.baseSalary + 500).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-500">100%</div>
                    </div>
                  </div>
                </Card>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <Card className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;