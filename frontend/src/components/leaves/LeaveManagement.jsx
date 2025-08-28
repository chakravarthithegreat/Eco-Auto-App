import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useLeaveStore } from '../../state/leaveStore';
import { useAuthStore } from '../../state/authStore';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageSquare,
  Eye,
  Filter,
  User,
  FileText,
  Settings,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const LeaveManagement = () => {
  const { user, isManager } = useAuthStore();
  const {
    leaves,
    leaveSettings,
    applyForLeave,
    updateLeaveStatus,
    addComment,
    getPendingRequests,
    getLeaveRequestsByEmployee,
    getLeaveStatistics,
    calculateLeaveBalance
  } = useLeaveStore();
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'appliedAt', direction: 'desc' });
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'paid',
    reason: '',
    isAdvanceNotice: false
  });
  
  const statistics = getLeaveStatistics();
  const pendingRequests = getPendingRequests();
  const userRequests = isManager() ? leaves : getLeaveRequestsByEmployee(user?.id || 1);
  const userLeaveBalance = calculateLeaveBalance(user?.id || 1);
  
  // Filter requests based on selected filter and search term
  const filteredRequests = userRequests.filter(request => {
    const matchesFilter = selectedFilter === 'all' || request.status === selectedFilter;
    const matchesSearch = searchTerm === '' || 
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });
  
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };
  
  const getLeaveTypeColor = (type) => {
    const leaveType = leaveSettings.leaveTypes.find(lt => lt.id === type);
    return leaveType ? leaveType.color : 'default';
  };
  
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'danger';
      case 'high': return 'warning';
      case 'normal': return 'primary';
      case 'low': return 'default';
      default: return 'default';
    }
  };
  
  const handleApprove = (requestId) => {
    updateLeaveStatus(requestId, 'approved', 'Request approved by manager');
  };
  
  const handleReject = () => {
    if (selectedRequest && rejectionReason.trim()) {
      updateLeaveStatus(selectedRequest.id, 'rejected', rejectionReason);
      setShowRejectionModal(false);
      setSelectedRequest(null);
      setRejectionReason('');
    }
  };
  
  const openRejectionModal = (request) => {
    setSelectedRequest(request);
    setShowRejectionModal(true);
  };
  
  const openDetailsModal = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };
  
  const handleSubmitRequest = async () => {
    if (newLeaveRequest.startDate && newLeaveRequest.endDate && newLeaveRequest.reason) {
      const result = await applyForLeave({
        ...newLeaveRequest,
        userId: user?.id || 1,
        employeeName: user?.name || 'Current User'
      });
      
      if (result.success) {
        setShowRequestForm(false);
        setNewLeaveRequest({
          startDate: '',
          endDate: '',
          leaveType: 'paid',
          reason: '',
          isAdvanceNotice: false
        });
      }
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <MainLayout currentPage="leaves">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading-bold text-slate-900">
              {isManager() ? 'Leave Management' : 'My Leave Requests'}
            </h1>
            <p className="text-surface-600 mt-1">
              {isManager() 
                ? 'Review and manage team leave requests'
                : 'Request time off and track your leave balance'
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-surface-300 rounded-card focus:ring-2 focus:ring-primary-500"
              />
            </div>
            {!isManager() && (
              <Button onClick={() => setShowRequestForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isManager() ? (
            // Manager view - team statistics
            <>
              <Card className="border-warning-200 bg-warning-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-warning-600 font-medium">Pending Requests</p>
                      <p className="text-2xl font-heading-bold text-slate-900">{statistics.pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-warning-500 rounded-card flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Approved</p>
                      <p className="text-2xl font-heading-bold text-slate-900">{statistics.approved}</p>
                      <p className="text-xs text-green-600">{statistics.approvalRate}% rate</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-card flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Rejected</p>
                      <p className="text-2xl font-heading-bold text-slate-900">{statistics.rejected}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-card flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Days</p>
                      <p className="text-2xl font-heading-bold text-slate-900">{statistics.approvedDays}</p>
                      <p className="text-xs text-blue-600">approved</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-card flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            // Team member view - personal leave balance
            <>
              <Card className="border-primary-200 bg-primary-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-primary-600 font-medium">Paid Leave</p>
                      <p className="text-2xl font-heading-bold text-slate-900">
                        {userLeaveBalance.paid.remaining}
                      </p>
                      <p className="text-xs text-primary-600">
                        of {userLeaveBalance.paid.total} remaining
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary-500 rounded-card flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Sick Leave</p>
                      <p className="text-2xl font-heading-bold text-slate-900">
                        {userLeaveBalance.sick.remaining}
                      </p>
                      <p className="text-xs text-green-600">
                        of {userLeaveBalance.sick.total} remaining
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-card flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Casual Leave</p>
                      <p className="text-2xl font-heading-bold text-slate-900">
                        {userLeaveBalance.casual.remaining}
                      </p>
                      <p className="text-xs text-purple-600">
                        of {userLeaveBalance.casual.total} remaining
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-card flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Pending Requests</p>
                      <p className="text-2xl font-heading-bold text-slate-900">
                        {userRequests.filter(r => r.status === 'pending').length}
                      </p>
                      <p className="text-xs text-orange-600">awaiting approval</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-card flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>
                {isManager() ? 'Team Leave Requests' : 'My Leave Requests'}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedFilter === 'all' ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFilter('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant={selectedFilter === 'pending' ? 'warning' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFilter('pending')}
                  >
                    Pending
                  </Button>
                  <Button 
                    variant={selectedFilter === 'approved' ? 'success' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFilter('approved')}
                  >
                    Approved
                  </Button>
                  <Button 
                    variant={selectedFilter === 'rejected' ? 'danger' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedFilter('rejected')}
                  >
                    Rejected
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th 
                      className="text-left py-3 text-sm font-medium text-surface-600 cursor-pointer"
                      onClick={() => requestSort('employeeName')}
                    >
                      <div className="flex items-center gap-1">
                        Employee
                        {sortConfig.key === 'employeeName' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left py-3 text-sm font-medium text-surface-600 cursor-pointer"
                      onClick={() => requestSort('startDate')}
                    >
                      <div className="flex items-center gap-1">
                        Dates
                        {sortConfig.key === 'startDate' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left py-3 text-sm font-medium text-surface-600 cursor-pointer"
                      onClick={() => requestSort('leaveType')}
                    >
                      <div className="flex items-center gap-1">
                        Type
                        {sortConfig.key === 'leaveType' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Days</th>
                    <th 
                      className="text-left py-3 text-sm font-medium text-surface-600 cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {sortConfig.key === 'status' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-surface-600">Reason</th>
                    <th 
                      className="text-left py-3 text-sm font-medium text-surface-600 cursor-pointer"
                      onClick={() => requestSort('appliedAt')}
                    >
                      <div className="flex items-center gap-1">
                        Applied
                        {sortConfig.key === 'appliedAt' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="text-right py-3 text-sm font-medium text-surface-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRequests.length > 0 ? (
                    sortedRequests.map((request) => (
                      <tr key={request.id} className="border-b border-surface-100 hover:bg-surface-50">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {request.employeeName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{request.employeeName}</p>
                              <p className="text-sm text-surface-600">{request.designation || 'Team Member'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-slate-900">
                            {formatDate(request.startDate)}
                          </div>
                          <div className="text-sm text-surface-600">
                            to {formatDate(request.endDate)}
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant={getLeaveTypeColor(request.leaveType)}>
                            {leaveSettings.leaveTypes.find(lt => lt.id === request.leaveType)?.name || request.leaveType}
                          </Badge>
                        </td>
                        <td className="py-4 text-slate-900">
                          {calculateLeaveDays(request.startDate, request.endDate)} days
                        </td>
                        <td className="py-4">
                          <Badge variant={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 max-w-xs">
                          <div className="text-slate-900 truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </td>
                        <td className="py-4 text-surface-600">
                          {new Date(request.appliedAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openDetailsModal(request)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {isManager() && request.status === 'pending' && (
                              <>
                                <Button 
                                  variant="success" 
                                  size="sm" 
                                  onClick={() => handleApprove(request.id)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="danger" 
                                  size="sm" 
                                  onClick={() => openRejectionModal(request)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-surface-500">
                        No leave requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Leave Request Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Leave Request
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newLeaveRequest.startDate}
                  onChange={(e) => setNewLeaveRequest({...newLeaveRequest, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newLeaveRequest.endDate}
                  onChange={(e) => setNewLeaveRequest({...newLeaveRequest, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Leave Type
                </label>
                <select
                  value={newLeaveRequest.leaveType}
                  onChange={(e) => setNewLeaveRequest({...newLeaveRequest, leaveType: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {leaveSettings.leaveTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={newLeaveRequest.reason}
                  onChange={(e) => setNewLeaveRequest({...newLeaveRequest, reason: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please provide a reason for your leave request..."
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="advanceNotice"
                  checked={newLeaveRequest.isAdvanceNotice}
                  onChange={(e) => setNewLeaveRequest({...newLeaveRequest, isAdvanceNotice: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                />
                <label htmlFor="advanceNotice" className="ml-2 block text-sm text-slate-900">
                  Advance Notice (7+ days)
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-surface-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRequestForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRequest}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Leave Request Details
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">Employee</label>
                  <p className="font-medium text-slate-900">{selectedRequest.employeeName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">Status</label>
                  <Badge variant={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">Leave Type</label>
                  <Badge variant={getLeaveTypeColor(selectedRequest.leaveType)}>
                    {leaveSettings.leaveTypes.find(lt => lt.id === selectedRequest.leaveType)?.name || selectedRequest.leaveType}
                  </Badge>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">Applied On</label>
                  <p className="text-slate-900">{new Date(selectedRequest.appliedAt).toLocaleDateString('en-IN')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">Start Date</label>
                  <p className="text-slate-900">{formatDate(selectedRequest.startDate)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">End Date</label>
                  <p className="text-slate-900">{formatDate(selectedRequest.endDate)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">Total Days</label>
                  <p className="text-slate-900">
                    {calculateLeaveDays(selectedRequest.startDate, selectedRequest.endDate)} days
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">Advance Notice</label>
                  <p className="text-slate-900">
                    {selectedRequest.isAdvanceNotice ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-surface-600 mb-1">Reason</label>
                <p className="text-slate-900 bg-surface-50 p-3 rounded-card">
                  {selectedRequest.reason}
                </p>
              </div>
              
              {selectedRequest.remarks && (
                <div>
                  <label className="block text-sm font-medium text-surface-600 mb-1">Manager Remarks</label>
                  <p className="text-slate-900 bg-surface-50 p-3 rounded-card">
                    {selectedRequest.remarks}
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-surface-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-surface-200">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Reject Leave Request
              </h3>
            </div>
            <div className="p-6">
              <p className="text-surface-600 mb-4">
                Please provide a reason for rejecting this leave request:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter rejection reason..."
              />
            </div>
            <div className="p-6 border-t border-surface-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectionModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default LeaveManagement;