import React, { useState, useEffect } from 'react';
import { useEmployeeSignUpStore } from '../../state/employeeSignUpStore';
import { useAuthStore } from '../../state/authStore';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { 
  User, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Mail,
  Phone,
  FileText,
  Building,
  CreditCard,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Pause,
  Bell
} from 'lucide-react';

const ApprovalDashboard = () => {
  const { 
    pendingApprovals, 
    fetchPendingApprovals, 
    approveEmployee,
    holdEmployee,
    rejectEmployee,
    isLoading, 
    error,
    clearError
  } = useEmployeeSignUpStore();
  
  const { user, token } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [approvalData, setApprovalData] = useState({
    approvalStatus: 'approved',
    approvalComments: '',
    rejectionReason: '',
    holdReason: ''
  });
  const [expandedSections, setExpandedSections] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Fetch pending approvals when component mounts
  useEffect(() => {
    if (user && token) {
      fetchPendingApprovals(token);
    }
  }, [user, token, fetchPendingApprovals]);

  // Request notification permission when component mounts
  useEffect(() => {
    const requestPermissions = async () => {
      // In a real app, we would import these from the notificationUtils file
      // For now, we'll just log that we should request permissions
      console.log('Requesting notification permissions for admin/manager alerts');
    };
    
    requestPermissions();
  }, []);

  // Check for selected employee from notifications
  useEffect(() => {
    const selectedEmployeeId = localStorage.getItem('selectedEmployeeForApproval');
    if (selectedEmployeeId && pendingApprovals.length > 0) {
      const employee = pendingApprovals.find(emp => emp._id === selectedEmployeeId);
      if (employee) {
        handleViewDetails(employee);
        // Remove the item from localStorage after using it
        localStorage.removeItem('selectedEmployeeForApproval');
      }
    }
  }, [pendingApprovals]);

  // Filter employees based on search term and status
  const filteredEmployees = pendingApprovals?.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.profileStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setApprovalData({
      approvalStatus: 'approved',
      approvalComments: '',
      rejectionReason: '',
      holdReason: ''
    });
  };

  const handleApprove = async () => {
    if (!selectedEmployee || !token) return;
    
    const result = await approveEmployee(selectedEmployee._id, {
      ...approvalData,
      approvedBy: user?.name || 'admin'
    }, token);
    
    if (result.success) {
      setShowApprovalModal(false);
      setSelectedEmployee(null);
      
      // Show success message with employee credentials
      if (result.auth) {
        const message = `Employee approved successfully!\n\nLogin Credentials:\nUsername: ${result.auth.username}\nPassword: ${selectedEmployee.password}\n\nEmployee can now login to the system.`;
        alert(message);
      }
      
      // Refresh the list
      fetchPendingApprovals(token);
    }
  };

  const handleHold = async () => {
    if (!selectedEmployee || !token) return;
    
    const result = await holdEmployee(selectedEmployee._id, {
      holdReason: approvalData.holdReason,
      heldBy: user?.name || 'admin'
    }, token);
    
    if (result.success) {
      setShowApprovalModal(false);
      setSelectedEmployee(null);
      // Refresh the list
      fetchPendingApprovals(token);
    }
  };

  const handleReject = async () => {
    if (!selectedEmployee || !token) return;
    
    const result = await rejectEmployee(selectedEmployee._id, {
      rejectionReason: approvalData.rejectionReason,
      rejectedBy: user?.name || 'admin'
    }, token);
    
    if (result.success) {
      setShowApprovalModal(false);
      setSelectedEmployee(null);
      // Refresh the list
      fetchPendingApprovals(token);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'on-hold':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">On Hold</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const renderEmployeeList = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'No employees match your search criteria.' 
              : 'There are no pending employee approvals at this time.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center text-white font-semibold">
                      {employee.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.fullName}</h3>
                      <p className="text-sm text-gray-500">{employee.jobTitle}</p>
                    </div>
                  </div>
                  {getStatusBadge(employee.profileStatus)}
                </div>
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>{employee.email}</span>
                </div>
                
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>{employee.phoneNumber}</span>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewDetails(employee)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  {employee.profileStatus === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowApprovalModal(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;
    
    const employee = selectedEmployee;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary-green flex items-center justify-center text-white font-semibold text-xl">
              {employee.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{employee.fullName}</h2>
              <p className="text-gray-500">{employee.jobTitle}</p>
              <div className="flex items-center mt-1">
                {getStatusBadge(employee.profileStatus)}
                <span className="ml-2 text-sm text-gray-500">
                  Submitted on {new Date(employee.approvalWorkflow?.submittedAt || employee.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => setSelectedEmployee(null)}
          >
            Back to List
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                  <p className="font-medium">{employee.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                  <p className="font-medium">{new Date(employee.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Address</Label>
                <p className="font-medium">
                  {employee.address?.street}, {employee.address?.city}, {employee.address?.state} {employee.address?.zipCode}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="font-medium">{employee.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* ID Proof */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                ID Proof
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">ID Type</Label>
                  <p className="font-medium">{employee.idProof?.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">ID Number</Label>
                  <p className="font-medium">{employee.idProof?.number}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Job Title</Label>
                  <p className="font-medium">{employee.jobTitle}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Joining Date</Label>
                  <p className="font-medium">{new Date(employee.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Bank Name</Label>
                <p className="font-medium">{employee.bankDetails?.bankName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Holder</Label>
                  <p className="font-medium">{employee.bankDetails?.accountHolderName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Number</Label>
                  <p className="font-medium">{employee.bankDetails?.accountNumber}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">IFSC Code</Label>
                <p className="font-medium">{employee.bankDetails?.ifscCode}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Optional Sections */}
        <div className="space-y-4">
          {/* Emergency Contact */}
          {employee.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('emergencyContact')}
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Emergency Contact
                  </span>
                  {expandedSections.emergencyContact ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </CardTitle>
              </CardHeader>
              {expandedSections.emergencyContact && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p className="font-medium">{employee.emergencyContact.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Relationship</Label>
                      <p className="font-medium">{employee.emergencyContact.relationship}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone</Label>
                      <p className="font-medium">{employee.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="font-medium">{employee.emergencyContact.email}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )}
          
          {/* Previous Employment */}
          {employee.previousEmployment && employee.previousEmployment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('previousEmployment')}
                >
                  <span className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Previous Employment
                  </span>
                  {expandedSections.previousEmployment ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </CardTitle>
              </CardHeader>
              {expandedSections.previousEmployment && (
                <CardContent className="space-y-4">
                  {employee.previousEmployment.map((employment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Company</Label>
                          <p className="font-medium">{employment.company}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Position</Label>
                          <p className="font-medium">{employment.position}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Duration</Label>
                          <p className="font-medium">{employment.duration}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Reason for Leaving</Label>
                          <p className="font-medium">{employment.reasonForLeaving}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )}
          
          {/* Education */}
          {employee.education && employee.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('education')}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </span>
                  {expandedSections.education ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </CardTitle>
              </CardHeader>
              {expandedSections.education && (
                <CardContent className="space-y-4">
                  {employee.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Degree</Label>
                          <p className="font-medium">{edu.degree}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Institution</Label>
                          <p className="font-medium">{edu.institution}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Year of Completion</Label>
                          <p className="font-medium">{edu.yearOfCompletion}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Percentage</Label>
                          <p className="font-medium">{edu.percentage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )}
          
          {/* Personal Interests */}
          {employee.personalInterests && employee.personalInterests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('personalInterests')}
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Personal Interests
                  </span>
                  {expandedSections.personalInterests ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </CardTitle>
              </CardHeader>
              {expandedSections.personalInterests && (
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.personalInterests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
        
        {/* Approval Actions */}
        {employee.profileStatus === 'pending' && (
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => {
                setApprovalData(prev => ({ ...prev, approvalStatus: 'rejected' }));
                setShowApprovalModal(true);
              }}
              className="flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setApprovalData(prev => ({ ...prev, approvalStatus: 'on-hold' }));
                setShowApprovalModal(true);
              }}
              className="flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Hold
            </Button>
            <Button 
              onClick={() => {
                setApprovalData(prev => ({ ...prev, approvalStatus: 'approved' }));
                setShowApprovalModal(true);
              }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderApprovalModal = () => {
    if (!showApprovalModal || !selectedEmployee) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {approvalData.approvalStatus === 'approved' ? 'Approve Employee' : 
               approvalData.approvalStatus === 'on-hold' ? 'Hold Employee Registration' : 
               'Reject Employee Registration'}
            </h3>
            
            <div className="space-y-4">
              {approvalData.approvalStatus === 'approved' && (
                <div>
                  <Label htmlFor="approvalComments">
                    Approval Comments *
                  </Label>
                  <Textarea
                    id="approvalComments"
                    value={approvalData.approvalComments}
                    onChange={(e) => {
                      setApprovalData(prev => ({ ...prev, approvalComments: e.target.value }));
                    }}
                    placeholder="Add any comments for the approval..."
                    rows={4}
                  />
                </div>
              )}
              
              {approvalData.approvalStatus === 'on-hold' && (
                <div>
                  <Label htmlFor="holdReason">
                    Hold Reason *
                  </Label>
                  <Textarea
                    id="holdReason"
                    value={approvalData.holdReason}
                    onChange={(e) => {
                      setApprovalData(prev => ({ ...prev, holdReason: e.target.value }));
                    }}
                    placeholder="Please provide a reason for holding this registration..."
                    rows={4}
                  />
                </div>
              )}
              
              {approvalData.approvalStatus === 'rejected' && (
                <div>
                  <Label htmlFor="rejectionReason">
                    Rejection Reason *
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    value={approvalData.rejectionReason}
                    onChange={(e) => {
                      setApprovalData(prev => ({ ...prev, rejectionReason: e.target.value }));
                    }}
                    placeholder="Please provide a reason for rejection..."
                    rows={4}
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowApprovalModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (approvalData.approvalStatus === 'approved') {
                    handleApprove();
                  } else if (approvalData.approvalStatus === 'on-hold') {
                    handleHold();
                  } else {
                    handleReject();
                  }
                }}
                disabled={isLoading || 
                  (approvalData.approvalStatus === 'approved' && !approvalData.approvalComments.trim()) ||
                  (approvalData.approvalStatus === 'on-hold' && !approvalData.holdReason.trim()) ||
                  (approvalData.approvalStatus === 'rejected' && !approvalData.rejectionReason.trim())}
              >
                {isLoading ? 'Processing...' : 
                  (approvalData.approvalStatus === 'approved' ? 'Approve Employee' : 
                   approvalData.approvalStatus === 'on-hold' ? 'Hold Registration' : 
                   'Reject Registration')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Icons that were referenced but not imported
  const GraduationCap = () => <span className="inline-block w-5 h-5">🎓</span>;
  const Heart = () => <span className="inline-block w-5 h-5">❤️</span>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Employee Approval Dashboard</h1>
          <p className="text-gray-500">
            Review and manage employee registrations
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Employee Registrations
              </span>
              <Badge variant="secondary" className="text-sm">
                {filteredEmployees.length} pending
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {selectedEmployee ? renderEmployeeDetails() : renderEmployeeList()}
          </CardContent>
        </Card>
        
        {renderApprovalModal()}
      </div>
    </div>
  );
};

export default ApprovalDashboard;