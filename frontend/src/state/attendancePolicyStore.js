import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAttendancePolicyStore = create(
  persist(
    (set, get) => ({
      // Attendance policies configuration
      attendancePolicies: {
        // Working hours and timing policies
        workingHours: {
          standardStartTime: '09:00',
          standardEndTime: '18:00',
          lunchBreakStart: '13:00',
          lunchBreakEnd: '14:00',
          minimumWorkingHours: 8,
          maximumWorkingHours: 12,
          weeklyWorkingDays: 5,
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        },

        // On-time arrival policies
        onTimeRules: {
          gracePerod: 15, // 15 minutes grace period
          onTimeThreshold: '09:15', // Consider on-time if arrived before 9:15 AM
          earlyArrivalBonus: {
            threshold: '08:45', // Arrived before 8:45 AM
            bonusPoints: 5,
            bonusAmount: 50 // ₹50 bonus for early arrival
          },
          punctualityStreakReward: {
            streakThresholds: [7, 15, 30, 60, 90], // Days
            rewards: [200, 500, 1000, 2500, 5000] // ₹ amounts
          }
        },

        // Late arrival policies and penalties
        lateArrivalPolicies: {
          penalties: {
            '0-15_minutes': { amount: 0, points: 0 }, // Grace period
            '15-30_minutes': { amount: 200, points: -2 },
            '30-60_minutes': { amount: 500, points: -5 },
            '60-120_minutes': { amount: 1000, points: -10 },
            'above_120_minutes': { amount: 2000, points: -20 }
          },
          escalationPolicy: {
            warningThreshold: 3, // 3 late arrivals in a month
            disciplinaryThreshold: 5, // 5 late arrivals in a month
            terminationThreshold: 8 // 8 late arrivals in a month
          },
          lateStreakPenalty: {
            consecutiveDays: 3,
            additionalPenalty: 1000,
            mandatoryMeeting: true
          }
        },

        // Early leaving policies
        earlyLeavingPolicies: {
          minimumNoticeHours: 2, // 2 hours advance notice required
          penalties: {
            'with_notice': {
              '0-30_minutes': { amount: 0, points: 0 },
              '30-60_minutes': { amount: 300, points: -3 },
              'above_60_minutes': { amount: 800, points: -8 }
            },
            'without_notice': {
              '0-30_minutes': { amount: 500, points: -5 },
              '30-60_minutes': { amount: 1200, points: -12 },
              'above_60_minutes': { amount: 2500, points: -25 }
            }
          },
          emergencyExceptions: ['medical', 'family_emergency', 'natural_disaster']
        },

        // Absence policies
        absencePolicies: {
          authorizedAbsence: {
            advanceNoticeRequired: 24, // 24 hours advance notice
            approvalRequired: true,
            maxConsecutiveDays: 3,
            deductionPerDay: 0 // No deduction for authorized absence
          },
          unauthorizedAbsence: {
            penaltyPerDay: 1500,
            pointsDeduction: -20,
            escalationThreshold: 2, // Days in a month
            disciplinaryAction: true
          },
          sickLeave: {
            maxDaysPerMonth: 2,
            medicalCertificateRequired: 2, // Days
            fullPayDays: 12, // Per year
            halfPayDays: 18 // Per year after full pay exhausted
          }
        },

        // Overtime policies
        overtimePolicies: {
          eligibilityRules: {
            minimumWorkingHours: 8,
            requiredApproval: true,
            maximumOvertimePerDay: 4,
            maximumOvertimePerWeek: 20
          },
          compensation: {
            weekdayRate: 1.5, // 1.5x regular hourly rate
            weekendRate: 2.0, // 2x regular hourly rate
            holidayRate: 2.5, // 2.5x regular hourly rate
            nightShiftRate: 1.25 // 1.25x for work after 10 PM
          },
          approval: {
            managerApprovalRequired: true,
            hrApprovalThreshold: 20, // Hours per week
            autoApprovalLimit: 2 // Hours per day
          }
        },

        // Break time policies
        breakTimePolicies: {
          lunchBreak: {
            duration: 60, // Minutes
            mandatory: true,
            flexibleTiming: 30 // Can be taken 30 minutes before/after standard time
          },
          teaBreaks: {
            morning: { duration: 15, time: '11:00' },
            evening: { duration: 15, time: '16:00' },
            mandatory: false
          },
          maximumBreakTime: 90 // Total break time per day (minutes)
        },

        // Remote work and flexible timing policies
        flexibilityPolicies: {
          flexibleStartTime: {
            enabled: true,
            earliestStart: '08:00',
            latestStart: '10:00',
            coreHours: { start: '10:00', end: '16:00' }
          },
          remoteWork: {
            enabled: true,
            maxDaysPerWeek: 2,
            advanceNoticeRequired: 24, // Hours
            productivityTracking: true
          },
          hybridSchedule: {
            enabled: true,
            minimumOfficedays: 3,
            teamMeetingDays: ['tuesday', 'thursday']
          }
        }
      },

      // Real-time attendance tracking
      attendanceTracking: {
        1: { // Employee ID
          currentMonth: '2024-08',
          monthlyStats: {
            totalWorkingDays: 22,
            presentDays: 20,
            absentDays: 2,
            lateArrivals: 3,
            earlyLeaves: 1,
            overtimeHours: 12,
            punctualityScore: 85
          },
          dailyRecords: [
            {
              date: '2024-08-20',
              clockIn: '09:05',
              clockOut: '18:10',
              lunchBreakStart: '13:00',
              lunchBreakEnd: '14:00',
              totalWorkingHours: 8.08,
              isLate: false,
              lateBy: 0,
              earlyLeave: false,
              earlyLeaveBy: 0,
              overtimeHours: 0.17,
              status: 'present',
              penalties: 0,
              bonuses: 0,
              notes: ''
            }
          ],
          currentStreak: {
            onTimeStreak: 5,
            workingStreak: 20,
            bestOnTimeStreak: 15,
            bestWorkingStreak: 45
          }
        }
      },

      // Clock in functionality with policy validation
      clockIn: (employeeId, clockInTime = null) => {
        const currentTime = clockInTime || new Date();
        const timeString = currentTime.toLocaleTimeString('en-US', { hour12: false });
        const dateString = currentTime.toISOString().split('T')[0];

        const { workingHours, onTimeRules, lateArrivalPolicies } = get().attendancePolicies;
        
        // Calculate if late
        const standardStart = new Date(`${dateString}T${workingHours.standardStartTime}:00`);
        const onTimeThreshold = new Date(`${dateString}T${onTimeRules.onTimeThreshold}:00`);
        const isLate = currentTime > onTimeThreshold;
        const lateBy = isLate ? Math.max(0, Math.round((currentTime - standardStart) / (1000 * 60))) : 0;

        // Calculate penalties and bonuses
        let penalty = 0;
        let bonus = 0;
        let points = 0;

        if (isLate) {
          // Apply late penalty
          const penaltyBracket = get().getLateArrivalPenaltyBracket(lateBy);
          penalty = lateArrivalPolicies.penalties[penaltyBracket].amount;
          points = lateArrivalPolicies.penalties[penaltyBracket].points;
        } else {
          // Check for early arrival bonus
          const earlyThreshold = new Date(`${dateString}T${onTimeRules.earlyArrivalBonus.threshold}:00`);
          if (currentTime <= earlyThreshold) {
            bonus = onTimeRules.earlyArrivalBonus.bonusAmount;
            points = onTimeRules.earlyArrivalBonus.bonusPoints;
          }
        }

        // Update attendance record
        const attendanceRecord = {
          date: dateString,
          clockIn: timeString,
          clockOut: null,
          isLate,
          lateBy,
          penalty,
          bonus,
          points,
          status: 'clocked_in',
          totalWorkingHours: 0,
          overtimeHours: 0,
          notes: isLate ? `Late by ${lateBy} minutes` : 'On time'
        };

        get().updateDailyAttendance(employeeId, dateString, attendanceRecord);
        get().updateAttendanceStreaks(employeeId, !isLate);

        return {
          success: true,
          isLate,
          lateBy,
          penalty,
          bonus,
          message: isLate ? `Clocked in late. Penalty: ₹${penalty}` : 'Clocked in successfully!'
        };
      },

      // Clock out functionality
      clockOut: (employeeId, clockOutTime = null) => {
        const currentTime = clockOutTime || new Date();
        const timeString = currentTime.toLocaleTimeString('en-US', { hour12: false });
        const dateString = currentTime.toISOString().split('T')[0];

        const attendanceData = get().attendanceTracking[employeeId];
        if (!attendanceData) return { success: false, message: 'Employee not found' };

        const todayRecord = attendanceData.dailyRecords?.find(record => record.date === dateString);
        if (!todayRecord || !todayRecord.clockIn) {
          return { success: false, message: 'Please clock in first' };
        }

        const { workingHours, earlyLeavingPolicies, overtimePolicies } = get().attendancePolicies;
        
        // Calculate working hours
        const clockInTime = new Date(`${dateString}T${todayRecord.clockIn}`);
        const workingHours_calculated = (currentTime - clockInTime) / (1000 * 60 * 60);
        
        // Check for early leaving
        const standardEnd = new Date(`${dateString}T${workingHours.standardEndTime}:00`);
        const isEarlyLeave = currentTime < standardEnd;
        const earlyLeaveBy = isEarlyLeave ? Math.round((standardEnd - currentTime) / (1000 * 60)) : 0;

        // Calculate overtime
        const regularHours = workingHours.minimumWorkingHours;
        const overtimeHours = Math.max(0, workingHours_calculated - regularHours);

        // Calculate penalties for early leaving
        let earlyLeavePenalty = 0;
        if (isEarlyLeave && earlyLeaveBy > 0) {
          const penaltyBracket = get().getEarlyLeavePenaltyBracket(earlyLeaveBy, false); // Assume no notice for now
          earlyLeavePenalty = earlyLeavingPolicies.penalties.without_notice[penaltyBracket].amount;
        }

        // Update record
        const updatedRecord = {
          ...todayRecord,
          clockOut: timeString,
          totalWorkingHours: Math.round(workingHours_calculated * 100) / 100,
          isEarlyLeave,
          earlyLeaveBy,
          overtimeHours: Math.round(overtimeHours * 100) / 100,
          penalty: todayRecord.penalty + earlyLeavePenalty,
          status: 'completed'
        };

        get().updateDailyAttendance(employeeId, dateString, updatedRecord);
        get().updateMonthlyStats(employeeId);

        return {
          success: true,
          totalWorkingHours: updatedRecord.totalWorkingHours,
          overtimeHours: updatedRecord.overtimeHours,
          isEarlyLeave,
          penalty: earlyLeavePenalty,
          message: 'Clocked out successfully!'
        };
      },

      // Get late arrival penalty bracket
      getLateArrivalPenaltyBracket: (lateMinutes) => {
        if (lateMinutes <= 15) return '0-15_minutes';
        if (lateMinutes <= 30) return '15-30_minutes';
        if (lateMinutes <= 60) return '30-60_minutes';
        if (lateMinutes <= 120) return '60-120_minutes';
        return 'above_120_minutes';
      },

      // Get early leave penalty bracket
      getEarlyLeavePenaltyBracket: (earlyMinutes, hasNotice) => {
        const noticeType = hasNotice ? 'with_notice' : 'without_notice';
        if (earlyMinutes <= 30) return '0-30_minutes';
        if (earlyMinutes <= 60) return '30-60_minutes';
        return 'above_60_minutes';
      },

      // Update daily attendance record
      updateDailyAttendance: (employeeId, date, recordData) => {
        set((state) => {
          const employeeAttendance = state.attendanceTracking[employeeId] || {
            currentMonth: date.substring(0, 7),
            monthlyStats: {},
            dailyRecords: [],
            currentStreak: { onTimeStreak: 0, workingStreak: 0, bestOnTimeStreak: 0, bestWorkingStreak: 0 }
          };

          const existingRecordIndex = employeeAttendance.dailyRecords.findIndex(record => record.date === date);
          
          if (existingRecordIndex >= 0) {
            employeeAttendance.dailyRecords[existingRecordIndex] = {
              ...employeeAttendance.dailyRecords[existingRecordIndex],
              ...recordData
            };
          } else {
            employeeAttendance.dailyRecords.push(recordData);
          }

          return {
            attendanceTracking: {
              ...state.attendanceTracking,
              [employeeId]: employeeAttendance
            }
          };
        });
      },

      // Update attendance streaks
      updateAttendanceStreaks: (employeeId, isOnTime) => {
        set((state) => {
          const employeeAttendance = state.attendanceTracking[employeeId];
          if (!employeeAttendance) return state;

          const currentStreak = { ...employeeAttendance.currentStreak };
          
          if (isOnTime) {
            currentStreak.onTimeStreak += 1;
            currentStreak.workingStreak += 1;
            currentStreak.bestOnTimeStreak = Math.max(currentStreak.bestOnTimeStreak, currentStreak.onTimeStreak);
            currentStreak.bestWorkingStreak = Math.max(currentStreak.bestWorkingStreak, currentStreak.workingStreak);
          } else {
            currentStreak.onTimeStreak = 0; // Reset on-time streak if late
            currentStreak.workingStreak += 1; // Still working, so working streak continues
          }

          return {
            attendanceTracking: {
              ...state.attendanceTracking,
              [employeeId]: {
                ...employeeAttendance,
                currentStreak
              }
            }
          };
        });
      },

      // Update monthly statistics
      updateMonthlyStats: (employeeId) => {
        const attendanceData = get().attendanceTracking[employeeId];
        if (!attendanceData) return;

        const currentMonth = new Date().toISOString().substring(0, 7);
        const monthlyRecords = attendanceData.dailyRecords.filter(record => 
          record.date.startsWith(currentMonth)
        );

        const totalWorkingDays = get().getWorkingDaysInMonth(currentMonth);
        const presentDays = monthlyRecords.filter(record => record.status !== 'absent').length;
        const absentDays = totalWorkingDays - presentDays;
        const lateArrivals = monthlyRecords.filter(record => record.isLate).length;
        const earlyLeaves = monthlyRecords.filter(record => record.isEarlyLeave).length;
        const totalOvertimeHours = monthlyRecords.reduce((sum, record) => sum + (record.overtimeHours || 0), 0);
        
        const punctualityScore = presentDays > 0 ? 
          Math.round(((presentDays - lateArrivals) / presentDays) * 100) : 0;

        const monthlyStats = {
          totalWorkingDays,
          presentDays,
          absentDays,
          lateArrivals,
          earlyLeaves,
          overtimeHours: Math.round(totalOvertimeHours * 100) / 100,
          punctualityScore,
          attendancePercentage: Math.round((presentDays / totalWorkingDays) * 100)
        };

        set((state) => ({
          attendanceTracking: {
            ...state.attendanceTracking,
            [employeeId]: {
              ...state.attendanceTracking[employeeId],
              monthlyStats,
              currentMonth
            }
          }
        }));
      },

      // Get working days in month
      getWorkingDaysInMonth: (monthYear) => {
        const [year, month] = monthYear.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        let workingDays = 0;

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month - 1, day);
          const dayOfWeek = date.getDay();
          // Assuming Monday=1, Tuesday=2, ..., Friday=5 are working days
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            workingDays++;
          }
        }

        return workingDays;
      },

      // Get attendance summary for employee
      getAttendanceSummary: (employeeId) => {
        const attendanceData = get().attendanceTracking[employeeId];
        if (!attendanceData) return null;

        return {
          monthlyStats: attendanceData.monthlyStats,
          currentStreak: attendanceData.currentStreak,
          recentRecords: attendanceData.dailyRecords
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 7)
        };
      },

      // Calculate attendance-based penalties and bonuses
      calculateAttendanceImpact: (employeeId) => {
        const attendanceData = get().attendanceTracking[employeeId];
        if (!attendanceData) return { penalties: 0, bonuses: 0 };

        const { onTimeRules } = get().attendancePolicies;
        let totalPenalties = 0;
        let totalBonuses = 0;

        // Calculate from daily records
        attendanceData.dailyRecords.forEach(record => {
          totalPenalties += record.penalty || 0;
          totalBonuses += record.bonus || 0;
        });

        // Check for punctuality streak rewards
        const currentStreak = attendanceData.currentStreak.onTimeStreak;
        onTimeRules.punctualityStreakReward.streakThresholds.forEach((threshold, index) => {
          if (currentStreak >= threshold) {
            totalBonuses += onTimeRules.punctualityStreakReward.rewards[index];
          }
        });

        return {
          penalties: totalPenalties,
          bonuses: totalBonuses,
          netImpact: totalBonuses - totalPenalties
        };
      },

      // Update attendance policies
      updateAttendancePolicies: (section, updates) => {
        set((state) => ({
          attendancePolicies: {
            ...state.attendancePolicies,
            [section]: {
              ...state.attendancePolicies[section],
              ...updates
            }
          }
        }));
      },

      // Get attendance analytics for all employees
      getAttendanceAnalytics: () => {
        const { attendanceTracking } = get();
        
        const analytics = Object.entries(attendanceTracking).map(([employeeId, data]) => ({
          employeeId: parseInt(employeeId),
          ...data.monthlyStats,
          currentStreaks: data.currentStreak,
          impact: get().calculateAttendanceImpact(employeeId)
        }));

        const totalEmployees = analytics.length;
        const averageAttendance = analytics.reduce((sum, emp) => sum + (emp.attendancePercentage || 0), 0) / totalEmployees;
        const averagePunctuality = analytics.reduce((sum, emp) => sum + (emp.punctualityScore || 0), 0) / totalEmployees;

        return {
          employeeAnalytics: analytics,
          overallStats: {
            totalEmployees,
            averageAttendance: Math.round(averageAttendance),
            averagePunctuality: Math.round(averagePunctuality),
            totalOvertimeHours: analytics.reduce((sum, emp) => sum + (emp.overtimeHours || 0), 0)
          }
        };
      }
    }),
    {
      name: 'attendance-policy-storage',
      partialize: (state) => ({
        attendancePolicies: state.attendancePolicies,
        attendanceTracking: state.attendanceTracking
      })
    }
  )
);

export { useAttendancePolicyStore };