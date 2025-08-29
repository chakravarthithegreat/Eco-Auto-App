import React, { useEffect, useState } from 'react';
import { useAttendanceStore, ATTENDANCE_STATUS } from '../../state/attendanceStore';
import { Clock, Calendar, TrendingUp, User, CheckCircle, XCircle, AlertCircle, Timer } from 'lucide-react';

const AttendanceTracker = () => {
  const {
    todayAttendance,
    monthlyStats,
    isCheckedIn,
    currentSession,
    isLoading,
    error,
    clockIn,
    clockOut,
    getCurrentSessionTime,
    getAttendanceSummary,
    fetchAttendanceRecords,
    clearError
  } = useAttendanceStore();

  const [sessionTime, setSessionTime] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  // Update session time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (isCheckedIn) {
        setSessionTime(getCurrentSessionTime());
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isCheckedIn, getCurrentSessionTime]);

  useEffect(() => {
    fetchAttendanceRecords();
    setAttendanceSummary(getAttendanceSummary());
    
    if (isCheckedIn) {
      setSessionTime(getCurrentSessionTime());
    }
  }, [fetchAttendanceRecords, getAttendanceSummary, isCheckedIn]);

  useEffect(() => {
    if (error) {
      setTimeout(() => clearError(), 5000);
    }
  }, [error, clearError]);

  const handleClockIn = async () => {
    const result = await clockIn();
    if (result.success) {
      setAttendanceSummary(getAttendanceSummary());
      setSessionTime(getCurrentSessionTime());
    }
  };

  const handleClockOut = async () => {
    const result = await clockOut();
    if (result.success) {
      setAttendanceSummary(getAttendanceSummary());
      setSessionTime(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.present:
        return 'text-green-600 bg-green-100';
      case ATTENDANCE_STATUS.late:
        return 'text-orange-600 bg-orange-100';
      case ATTENDANCE_STATUS.absent:
        return 'text-red-600 bg-red-100';
      case ATTENDANCE_STATUS.halfDay:
        return 'text-blue-600 bg-blue-100';
      case ATTENDANCE_STATUS.leave:
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.present: return 'Present';
      case ATTENDANCE_STATUS.late: return 'Late';
      case ATTENDANCE_STATUS.absent: return 'Absent';
      case ATTENDANCE_STATUS.halfDay: return 'Half Day';
      case ATTENDANCE_STATUS.leave: return 'On Leave';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.present:
        return <CheckCircle className="w-4 h-4" />;
      case ATTENDANCE_STATUS.late:
        return <AlertCircle className="w-4 h-4" />;
      case ATTENDANCE_STATUS.absent:
        return <XCircle className="w-4 h-4" />;
      case ATTENDANCE_STATUS.halfDay:
        return <Clock className="w-4 h-4" />;
      case ATTENDANCE_STATUS.leave:
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 leading-tight mb-3 sm:text-3xl sm:mb-4">Attendance Tracker</h1>
          <p className="text-surface-600 text-sm sm:text-base">Track your work hours and attendance</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-lg font-bold text-gray-900">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Today's Status */}
      <div className="bg-white rounded-3xl shadow-card p-6 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]">
        <h3 className="text-xl font-semibold text-surface-900 leading-tight mb-6">Today's Attendance</h3>
        
        {todayAttendance ? (
          <div className="space-y-4">
            {/* Status Card */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getStatusColor(todayAttendance.status)}`}>
                  {getStatusIcon(todayAttendance.status)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {formatStatus(todayAttendance.status)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {todayAttendance.notes}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  In: {todayAttendance.checkInTime}
                </div>
                {todayAttendance.checkOutTime && (
                  <div className="text-sm text-gray-500">
                    Out: {todayAttendance.checkOutTime}
                  </div>
                )}
              </div>
            </div>

            {/* Session Timer */}
            {isCheckedIn && sessionTime && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl shadow-card p-6 border-none transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Current Session</h4>
                    <p className="text-blue-100 text-sm">Started at {todayAttendance.checkInTime}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{sessionTime.formattedTime}</div>
                    <div className="text-blue-100 text-sm">Hours worked</div>
                  </div>
                </div>
              </div>
            )}

            {/* Working Hours */}
            {todayAttendance.hoursWorked && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{todayAttendance.hoursWorked}h</div>
                  <div className="text-sm text-gray-500">Total Hours</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {todayAttendance.isOvertime ? `+${todayAttendance.overtime.toFixed(1)}h` : '0h'}
                  </div>
                  <div className="text-sm text-gray-500">Overtime</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {todayAttendance.isLate ? 'Late' : 'On Time'}
                  </div>
                  <div className="text-sm text-gray-500">Arrival</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {todayAttendance.isHalfDay ? 'Half Day' : 'Full Day'}
                  </div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No attendance marked today</h4>
            <p className="text-gray-500 mb-6">Clock in to start tracking your work hours</p>
          </div>
        )}

        {/* Clock In/Out Button */}
        <div className="mt-6 text-center">
          {!isCheckedIn ? (
            <button
              onClick={handleClockIn}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 select-none bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 focus:ring-primary-500 rounded-xl"
            >
              <Timer className="w-5 h-5" />
              Clock In
            </button>
          ) : (
            <button
              onClick={handleClockOut}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 select-none bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:scale-105 focus:ring-primary-500 rounded-xl shadow-sm"
            >
              <Timer className="w-5 h-5" />
              Clock Out
            </button>
          )}
        </div>
      </div>

      {/* Monthly Summary */}
      {attendanceSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-card p-4 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-105 sm:p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{attendanceSummary.presentDays}</div>
                <div className="text-sm text-gray-500">Present Days</div>
              </div>
            </div>
            <div className="text-green-600 text-sm font-medium">
              {attendanceSummary.presentPercentage.toFixed(1)}% attendance
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-4 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-105 sm:p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-100">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{attendanceSummary.lateDays}</div>
                <div className="text-sm text-gray-500">Late Days</div>
              </div>
            </div>
            <div className="text-orange-600 text-sm font-medium">
              {attendanceSummary.totalDays > 0 ? ((attendanceSummary.lateDays / attendanceSummary.totalDays) * 100).toFixed(1) : 0}% late rate
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-4 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-105 sm:p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{attendanceSummary.totalHours.toFixed(1)}h</div>
                <div className="text-sm text-gray-500">Total Hours</div>
              </div>
            </div>
            <div className="text-blue-600 text-sm font-medium">
              {attendanceSummary.avgHoursPerDay}h avg/day
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-4 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-105 sm:p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{attendanceSummary.totalOvertime.toFixed(1)}h</div>
                <div className="text-sm text-gray-500">Overtime</div>
              </div>
            </div>
            <div className="text-purple-600 text-sm font-medium">
              {attendanceSummary.overtimeDays} overtime days
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-3xl shadow-card p-6 border border-surface-100 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02]">
        <h3 className="text-xl font-semibold text-surface-900 leading-tight mb-4">This Month's Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{attendanceSummary?.workingDays || 0}</div>
            <div className="text-sm text-gray-600">Working Days</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{attendanceSummary?.presentDays || 0}</div>
            <div className="text-sm text-gray-600">Days Present</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">{attendanceSummary?.halfDays || 0}</div>
            <div className="text-sm text-gray-600">Half Days</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              {attendanceSummary?.attendancePercentage?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;