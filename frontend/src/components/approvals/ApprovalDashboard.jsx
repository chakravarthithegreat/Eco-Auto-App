import React, { useState } from 'react';
import { useNotificationStore } from '../../state/notificationStore';
import { useTaskStore } from '../../state/taskStore';
import { useTATStore } from '../../state/tatStore';
import { useAuthStore } from '../../state/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Target, 
  TrendingUp,
  AlertCircle,
  Award,
  Calendar,
  Timer,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ApprovalDashboard = () => {
  const { user } = useAuthStore();
  const { notifications, getApprovalNotifications, updateNotificationStatus } = useNotificationStore();
  const { updateTask } = useTaskStore();
  const { updateTaskTracking } = useTATStore();
  
  const [approvalNotes, setApprovalNotes] = useState({});
  const [processing, setProcessing] = useState({});

  // Get pending approval notifications
  const approvalNotifications = getApprovalNotifications().filter(
    notification => !notification.status || notification.status === 'pending'
  );

  // Handle approval
  const handleApprove = (notification) => {
    setProcessing(prev => ({ ...prev, [notification.id]: 'approving' }));
    
    try {
      // Update task status to approved
      updateTask(notification.taskId, { 
        status: 'completed',
        approved: true,
        approvedBy: user?.id,
        approvedAt: new Date().toISOString(),
        approvalNotes: approvalNotes[notification.id] || ''
      });
      
      // Update TAT record if needed
      // In a real implementation, you might want to update quality metrics here
      
      // Update notification status
      updateNotificationStatus(notification.id, 'approved');
      
      // Add success notification
      toast.success(`Approved work for ${notification.userName}`);
    } catch (error) {
      toast.error('Failed to approve work');
      console.error('Approval error:', error);
    } finally {
      setProcessing(prev => ({ ...prev, [notification.id]: false }));
    }
  };

  // Handle rejection
  const handleReject = (notification) => {
    setProcessing(prev => ({ ...prev, [notification.id]: 'rejecting' }));
    
    try {
      // Update task status to rejected
      updateTask(notification.taskId, { 
        status: 'in_progress', // Send back to in progress
        approved: false,
        rejectedBy: user?.id,
        rejectedAt: new Date().toISOString(),
        rejectionNotes: approvalNotes[notification.id] || ''
      });
      
      // Update notification status
      updateNotificationStatus(notification.id, 'rejected');
      
      // Add success notification
      toast.success(`Rejected work for ${notification.userName}`);
    } catch (error) {
      toast.error('Failed to reject work');
      console.error('Rejection error:', error);
    } finally {
      setProcessing(prev => ({ ...prev, [notification.id]: false }));
    }
  };

  // Handle timer extension
  const handleExtendTimer = (notification) => {
    setProcessing(prev => ({ ...prev, [notification.id]: 'extending' }));
    
    try {
      // Update task status to in progress with extension
      updateTask(notification.taskId, { 
        status: 'in_progress',
        extended: true,
        extendedBy: user?.id,
        extendedAt: new Date().toISOString(),
        extensionNotes: approvalNotes[notification.id] || ''
      });
      
      // Update notification status
      updateNotificationStatus(notification.id, 'extended');
      
      // Add success notification
      toast.success(`Extended timer for ${notification.userName}`);
    } catch (error) {
      toast.error('Failed to extend timer');
      console.error('Extension error:', error);
    } finally {
      setProcessing(prev => ({ ...prev, [notification.id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
              Approval Dashboard
            </h1>
            <p className="text-surface-600 mt-1">
              Review and approve work completion requests
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats with gradient cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Pending Approvals</h3>
                <div className="text-3xl font-bold">
                  {approvalNotifications.length}
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Approved</h3>
                <div className="text-3xl font-bold">
                  {notifications.filter(n => n.status === 'approved').length}
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Rejected</h3>
                <div className="text-3xl font-bold">
                  {notifications.filter(n => n.status === 'rejected').length}
                </div>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-500" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvalNotifications.length > 0 ? (
            <div className="space-y-6">
              {approvalNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className="p-6 bg-surface-50 rounded-2xl border border-surface-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-surface-900">
                          {notification.userName}
                        </h3>
                        <p className="text-surface-600">
                          Completed task: {notification.taskName}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="primary" 
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
                    >
                      Pending
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
                      <div className="flex items-center text-sm text-surface-500 mb-2">
                        <Timer className="w-4 h-4 mr-2" />
                        <span>Time Spent</span>
                      </div>
                      <div className="text-2xl font-bold text-primary-600">
                        {notification.timeSpent?.toFixed(2) || 0}h
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
                      <div className="flex items-center text-sm text-surface-500 mb-2">
                        <Star className="w-4 h-4 mr-2" />
                        <span>Quality Rating</span>
                      </div>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-amber-500 mr-2">
                          {notification.qualityRating || 0}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= (notification.qualityRating || 0) ? 'text-amber-400 fill-current' : 'text-surface-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
                      <div className="flex items-center text-sm text-surface-500 mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Submitted</span>
                      </div>
                      <div className="text-lg font-bold text-surface-900">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Approval Notes
                    </label>
                    <textarea
                      value={approvalNotes[notification.id] || ''}
                      onChange={(e) => setApprovalNotes(prev => ({
                        ...prev,
                        [notification.id]: e.target.value
                      }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm hover:shadow-md transition-shadow"
                      placeholder="Add approval notes..."
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => handleApprove(notification)}
                      disabled={processing[notification.id]}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <CheckCircle className="h-5 w-5" />
                      {processing[notification.id] === 'approving' ? 'Approving...' : 'Approve'}
                    </Button>
                    
                    <Button
                      onClick={() => handleReject(notification)}
                      disabled={processing[notification.id]}
                      variant="outline"
                      className="flex items-center gap-2 px-5 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <XCircle className="h-5 w-5" />
                      {processing[notification.id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                    </Button>
                    
                    <Button
                      onClick={() => handleExtendTimer(notification)}
                      disabled={processing[notification.id]}
                      variant="secondary"
                      className="flex items-center gap-2 px-5 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Clock className="h-5 w-5" />
                      {processing[notification.id] === 'extending' ? 'Extending...' : 'Extend Timer'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-surface-900 mb-2">No Pending Approvals</h3>
              <p className="text-surface-600 max-w-md mx-auto">
                All work completion requests have been processed. Great job staying on top of approvals!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalDashboard;