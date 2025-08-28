import React, { useState, useEffect } from 'react';
import { useAttendanceStore, ATTENDANCE_STATUS } from '../../state/attendanceStore';
import { 
  Clock, 
  MapPin, 
  Target, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  UserCheck,
  TrendingUp,
  Award,
  Play,
  Square,
  BarChart2,
  CalendarDays,
  Timer,
  Zap,
  Coffee,
  Moon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const AttendancePage = () => {
  const attendanceStore = useAttendanceStore();
  
  // Destructure after ensuring store is initialized
  const {
    todayAttendance,
    attendancePolicy,
    isCheckedIn,
    currentSession,
    isLoading,
    error,
    clockIn,
    clockOut,
    fetchAttendanceRecords,
    getCurrentSessionTime,
    getAttendanceSummary
  } = attendanceStore;
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');

  // Initialize data
  useEffect(() => {
    console.log('AttendancePage: Initializing attendance data');
    
    // Ensure attendance records are fetched
    fetchAttendanceRecords();
    console.log('AttendancePage: Fetching attendance records');
    
    // Initialize mock data if needed
    if (!attendanceStore.attendanceRecords || attendanceStore.attendanceRecords.length === 0) {
      console.log('AttendancePage: Initializing mock attendance data');
      // The store will handle mock data initialization
    }
  }, [fetchAttendanceRecords, attendanceStore.attendanceRecords]);

  useEffect(() => {
    if (isCheckedIn && currentSession) {
      const sessionTimer = setInterval(() => {
        const sessionTime = getCurrentSessionTime();
        setSessionTime(sessionTime);
      }, 1000);
      
      return () => clearInterval(sessionTimer);
    }
  }, [isCheckedIn, currentSession, getCurrentSessionTime]);

  useEffect(() => {
    const summary = getAttendanceSummary();
    setAttendanceSummary(summary);
  }, [getAttendanceSummary]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    const result = await clockIn();
    if (result.success) {
      console.log('Clocked in successfully');
    }
  };

  const handleClockOut = async () => {
    const result = await clockOut();
    if (result.success) {
      console.log('Clocked out successfully');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.present: return 'bg-green-100 text-green-800';
      case ATTENDANCE_STATUS.late: return 'bg-yellow-100 text-yellow-800';
      case ATTENDANCE_STATUS.absent: return 'bg-red-100 text-red-800';
      case ATTENDANCE_STATUS.halfDay: return 'bg-orange-100 text-orange-800';
      case ATTENDANCE_STATUS.leave: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = () => {
    if (!attendanceSummary) return 0;
    const totalDays = attendanceSummary.totalDays || 1;
    const presentDays = attendanceSummary.presentDays || 0;
    return Math.round((presentDays / totalDays) * 100);
  };

  // Get streak information
  const getStreakInfo = () => {
    if (!attendanceStore.attendanceRecords || attendanceStore.attendanceRecords.length === 0) return { current: 0, best: 0 };
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    // Sort records by date
    const sortedRecords = [...attendanceStore.attendanceRecords].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    for (let i = 0; i < sortedRecords.length; i++) {
      const record = sortedRecords[i];
      if (record.status === ATTENDANCE_STATUS.present || record.status === ATTENDANCE_STATUS.late) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
        if (i === 0) currentStreak = tempStreak; // Current streak is only updated for most recent records
      } else {
        if (i === 0) currentStreak = 0; // Break current streak if most recent record is not present
        tempStreak = 0;
      }
    }
    
    return { current: currentStreak, best: bestStreak };
  };

  const streakInfo = getStreakInfo();

  return (
    <div className="space-y-6">
      {/* Header with enhanced styling */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-md">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
              Attendance
            </h1>
            <p className="text-surface-600 mt-1">
              Track your daily attendance and working hours
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-surface-200">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'daily'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          Daily View
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'analytics'
              ? 'text-primary-600 border-primary-500'
              : 'text-surface-500 hover:text-surface-700 border-transparent'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Current Time and Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium mb-1 opacity-90">Current Time</div>
                    <div className="text-3xl font-bold">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium mb-1 opacity-90">Date</div>
                    <div className="text-lg font-medium">
                      {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Summary Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-surface-500 mb-1">This Month</div>
                    <div className="text-2xl font-bold text-surface-900">
                      {calculateAttendancePercentage()}% 
                      <span className="text-sm font-normal text-surface-600 ml-2">Attendance</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-600">Progress</span>
                    <span className="font-medium">{attendanceSummary?.presentDays || 0}/{attendanceSummary?.totalDays || 0} days</span>
                  </div>
                  <div className="w-full bg-surface-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${calculateAttendancePercentage()}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-surface-500 mb-1">Current Streak</div>
                    <div className="text-2xl font-bold text-surface-900">
                      {streakInfo.current} <span className="text-sm font-normal text-surface-600">days</span>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-2 text-sm text-surface-600">
                  Best streak: <span className="font-medium">{streakInfo.best} days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Attendance Controls */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Daily Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-pulse">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Clock In/Out Section */}
                <div className="flex-1">
                  <div className="bg-surface-50 rounded-2xl p-6">
                    <h3 className="font-semibold text-surface-900 mb-4 text-center">Clock In/Out</h3>
                    
                    {isCheckedIn ? (
                      <div className="space-y-6">
                        <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center shadow-sm">
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="p-2 bg-green-500 rounded-full">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-green-800 text-xl">Currently Clocked In</span>
                          </div>
                          <div className="text-sm text-green-700 mb-4">
                            Clocked in at <span className="font-medium">{todayAttendance?.checkInTime}</span>
                          </div>
                          {sessionTime && (
                            <div className="mt-2 p-4 bg-white rounded-lg shadow-sm border border-green-100">
                              <div className="text-3xl font-bold text-green-800">
                                {sessionTime.formattedTime}
                              </div>
                              <div className="text-xs text-green-600 mt-1">Session Time</div>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          onClick={handleClockOut}
                          className="w-full flex items-center justify-center gap-2 py-3 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          disabled={isLoading}
                        >
                          <Square className="w-5 h-5" />
                          Clock Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <Button
                          onClick={handleClockIn}
                          className="w-full flex items-center justify-center gap-2 py-3 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          disabled={isLoading}
                        >
                          <Play className="w-5 h-5" />
                          Clock In
                        </Button>
                        
                        <div className="text-center">
                          {todayAttendance ? (
                            <div className="p-4 bg-gradient-to-r from-surface-50 to-surface-100 rounded-lg border border-surface-200">
                              <div className="text-surface-700 mb-1">
                                Clocked out at <span className="font-medium">{formatTime(todayAttendance.checkOutTime)}</span>
                              </div>
                              <div className="text-xs text-surface-500">
                                {todayAttendance.date}
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-gradient-to-r from-surface-50 to-surface-100 rounded-lg border border-surface-200">
                              <div className="text-surface-700">Not clocked in today</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Attendance Stats */}
                <div className="flex-1">
                  <div className="bg-surface-50 rounded-2xl p-6">
                    <h3 className="font-semibold text-surface-900 mb-4 text-center">Today's Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-primary-100 rounded-xl">
                            <Calendar className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <div className="font-medium text-surface-900">Status</div>
                            <div className="text-sm text-surface-600">Today's attendance</div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(todayAttendance?.status || ATTENDANCE_STATUS.absent)} px-3 py-1 text-sm`}>
                          {todayAttendance?.status ? 
                            todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1) : 
                            'Absent'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-success-100 rounded-xl">
                            <Timer className="w-5 h-5 text-success-600" />
                          </div>
                          <div>
                            <div className="font-medium text-surface-900">Work Hours</div>
                            <div className="text-sm text-surface-600">Total time today</div>
                          </div>
                        </div>
                        <div className="font-bold text-surface-900 text-lg">
                          {todayAttendance?.totalHours ? `${todayAttendance.totalHours}h` : '--'}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-warning-100 rounded-xl">
                            <Target className="w-5 h-5 text-warning-600" />
                          </div>
                          <div>
                            <div className="font-medium text-surface-900">Target</div>
                            <div className="text-sm text-surface-600">Daily requirement</div>
                          </div>
                        </div>
                        <div className="font-bold text-surface-900 text-lg">
                          {attendancePolicy?.dailyHours || 8}h
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-surface-200">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowHistory(!showHistory)}
                      >
                        {showHistory ? 'Hide History' : 'View History'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance History */}
          {showHistory && (
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Recent Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-50 border-b border-surface-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Clock In</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Clock Out</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Hours</th>
                        <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceStore.attendanceRecords?.slice(0, 7).map((record) => (
                        <tr key={record.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                          <td className="py-3 px-4 text-sm">{record.date}</td>
                          <td className="py-3 px-4 text-sm">{formatTime(record.checkInTime)}</td>
                          <td className="py-3 px-4 text-sm">{formatTime(record.checkOutTime)}</td>
                          <td className="py-3 px-4 text-sm">{record.totalHours ? `${record.totalHours}h` : '--'}</td>
                          <td className="py-3 px-4">
                            <Badge className={`${getStatusColor(record.status)} px-2 py-1 text-xs`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Enhanced Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Present Days</h3>
                    <div className="text-3xl font-bold">{attendanceSummary?.presentDays || 0}</div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Late Days</h3>
                    <div className="text-3xl font-bold">{attendanceSummary?.lateDays || 0}</div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Absent Days</h3>
                    <div className="text-3xl font-bold">{attendanceSummary?.absentDays || 0}</div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Avg Hours/Day</h3>
                    <div className="text-3xl font-bold">
                      {attendanceSummary?.averageHoursPerDay ? attendanceSummary.averageHoursPerDay.toFixed(1) : '0.0'}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Timer className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Attendance Visualization */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                Monthly Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2 pt-4">
                {/* Sample visualization - in a real app, this would be generated from data */}
                {[65, 80, 45, 90, 75, 60, 85, 70, 95, 80, 65, 85, 75, 90, 70, 85, 95, 80, 60, 75, 85, 90, 70, 80, 85, 95, 75, 80].map((height, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 group">
                    <div 
                      className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg hover:from-primary-600 hover:to-primary-500 transition-all duration-300 cursor-pointer shadow-sm group-hover:shadow-md"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-surface-600 mt-2 transform group-hover:scale-110 transition-transform">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index % 7]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-primary-500 rounded-sm"></div>
                    <span>Attendance Rate</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Weekly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Coffee className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Early Bird</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">12 days</div>
                  <div className="text-sm text-blue-700">Clocked in before 9 AM</div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-800">Streak Master</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-900">7 days</div>
                  <div className="text-sm text-amber-700">Current attendance streak</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Night Owl</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">5 days</div>
                  <div className="text-sm text-green-700">Worked past 7 PM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;