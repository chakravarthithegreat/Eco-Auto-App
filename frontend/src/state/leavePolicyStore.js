import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLeavePolicyStore = create(
  persist(
    (set, get) => ({
      // Leave policies configuration
      leavePolicies: {
        // Annual leave entitlements
        annualLeaveEntitlements: {
          'probation': { totalDays: 12, paidDays: 8, unpaidDays: 4 },
          '1-2_years': { totalDays: 18, paidDays: 15, unpaidDays: 3 },
          '3-5_years': { totalDays: 24, paidDays: 21, unpaidDays: 3 },
          'senior': { totalDays: 30, paidDays: 27, unpaidDays: 3 }
        },

        // Leave types and their specific policies
        leaveTypes: {
          'casual_leave': {
            name: 'Casual Leave',
            annualQuota: 12,
            carryForward: false,
            maxConsecutiveDays: 5,
            advanceNoticeRequired: 1, // Days
            approvalRequired: false, // For <= 2 days
            canBeTakenHalfDay: true,
            payType: 'paid'
          },
          'sick_leave': {
            name: 'Sick Leave',
            annualQuota: 10,
            carryForward: true,
            maxCarryForward: 5,
            maxConsecutiveDays: 7,
            advanceNoticeRequired: 0, // Can be taken same day
            approvalRequired: false,
            medicalCertificateRequired: 3, // Days
            canBeTakenHalfDay: true,
            payType: 'paid'
          },
          'annual_leave': {
            name: 'Annual Leave',
            annualQuota: 21,
            carryForward: true,
            maxCarryForward: 5,
            maxConsecutiveDays: 15,
            advanceNoticeRequired: 7, // 7 days advance notice
            approvalRequired: true,
            canBeTakenHalfDay: false,
            payType: 'paid',
            blackoutPeriods: ['2024-12-15_2024-12-31', '2024-03-15_2024-03-31'] // Year-end and quarter-end
          },
          'maternity_leave': {
            name: 'Maternity Leave',
            annualQuota: 180, // 6 months
            carryForward: false,
            maxConsecutiveDays: 180,
            advanceNoticeRequired: 30,
            approvalRequired: true,
            canBeTakenHalfDay: false,
            payType: 'paid',
            eligibilityMonths: 12 // Must be employed for 12 months
          },
          'paternity_leave': {
            name: 'Paternity Leave',
            annualQuota: 15,
            carryForward: false,
            maxConsecutiveDays: 15,
            advanceNoticeRequired: 7,
            approvalRequired: true,
            canBeTakenHalfDay: false,
            payType: 'paid'
          },
          'emergency_leave': {
            name: 'Emergency Leave',
            annualQuota: 5,
            carryForward: false,
            maxConsecutiveDays: 3,
            advanceNoticeRequired: 0, // Emergency, no advance notice
            approvalRequired: true, // Post-approval within 24 hours
            canBeTakenHalfDay: true,
            payType: 'paid'
          },
          'unpaid_leave': {
            name: 'Unpaid Leave',
            annualQuota: 30,
            carryForward: false,
            maxConsecutiveDays: 10,
            advanceNoticeRequired: 15,
            approvalRequired: true,
            canBeTakenHalfDay: false,
            payType: 'unpaid'
          }
        },

        // Advance notice policies and penalties
        advanceNoticePolicies: {
          // 7-day advance notice for paid leaves
          sevenDayNotice: {
            applicableLeaves: ['annual_leave'],
            benefits: {
              fullPay: true,
              noDocumentationRequired: true,
              priorityApproval: true
            }
          },
          
          // 3-day advance notice
          threeDayNotice: {
            applicableLeaves: ['casual_leave'],
            benefits: {
              fullPay: true,
              fastTrackApproval: true
            }
          },

          // Same day or short notice (less than required)
          shortNotice: {
            penalties: {
              // Penalty based on notice period deficit
              casualLeave: {
                '0_days': { payDeduction: 0.5, approvalDifficulty: 'high' }, // Same day
                '1-2_days': { payDeduction: 0.25, approvalDifficulty: 'medium' },
                '3-6_days': { payDeduction: 0, approvalDifficulty: 'normal' }
              },
              annualLeave: {
                '0-1_days': { payDeduction: 1.0, approvalDifficulty: 'very_high' }, // Emergency only
                '2-3_days': { payDeduction: 0.75, approvalDifficulty: 'high' },
                '4-6_days': { payDeduction: 0.5, approvalDifficulty: 'medium' },
                '7_days': { payDeduction: 0, approvalDifficulty: 'normal' }
              }
            }
          },

          // Emergency leave exceptions
          emergencyExceptions: {
            acceptableReasons: [
              'medical_emergency',
              'family_death',
              'natural_disaster',
              'accident',
              'government_duty',
              'court_appearance'
            ],
            documentationRequired: true,
            payProtection: true, // Full pay even without advance notice
            approvalRequired: true // But approval within 24-48 hours
          }
        },

        // Leave deduction and pay calculation policies
        payCalculationPolicies: {
          // Paid leave calculation
          paidLeave: {
            fullPayConditions: ['advance_notice_met', 'within_quota', 'approved'],
            dailyPayCalculation: 'monthly_salary / 30', // days
            halfDayCalculation: 'daily_pay / 2'
          },

          // Unpaid leave or penalty deductions
          unpaidLeave: {
            // Emergency notice penalty (e.g., 2 days off = 4 days pay deduction)
            emergencyNoticeRatio: {
              '0_days_notice': 2.0, // 1 day leave = 2 days pay deduction
              '1_day_notice': 1.5,  // 1 day leave = 1.5 days pay deduction
              '2_days_notice': 1.25,
              '3_days_notice': 1.0  // Normal 1:1 ratio
            },
            
            // Unnotified leave (no notice at all)
            unnotifiedLeave: {
              payDeductionRatio: 2.0, // 1 day leave = 2 days pay deduction
              additionalPenalty: 1000, // Fixed penalty amount
              disciplinaryAction: true
            }
          },

          // Leave encashment policies
          encashment: {
            casualLeave: { encashable: false },
            sickLeave: { encashable: false },
            annualLeave: { 
              encashable: true, 
              maxDays: 10, 
              minimumBalance: 5,
              rate: 1.0 // Full daily wage
            }
          }
        },

        // Holiday and weekend policies
        holidayPolicies: {
          nationalHolidays: [
            '2024-01-26', // Republic Day
            '2024-08-15', // Independence Day
            '2024-10-02', // Gandhi Jayanti
            '2024-12-25'  // Christmas
          ],
          
          festivalHolidays: [
            '2024-03-08', // Holi
            '2024-04-14', // Ram Navami
            '2024-10-12', // Dussehra
            '2024-11-01'  // Diwali
          ],

          weekendPolicy: {
            weekends: ['saturday', 'sunday'],
            compensatoryOff: true, // If worked on weekend
            weekendWorkApproval: true
          },

          sandwichLeave: {
            policy: 'discouraged',
            managerApprovalRequired: true,
            additionalDocumentation: true
          }
        }
      },

      // Employee leave balances and tracking
      employeeLeaveBalances: {
        1: { // Employee ID
          employeeId: 1,
          name: 'Sarah M.',
          joiningDate: '2023-01-15',
          experienceCategory: '1-2_years',
          currentYear: '2024',
          
          leaveBalances: {
            casual_leave: { entitled: 12, used: 3, remaining: 9, carryForward: 0 },
            sick_leave: { entitled: 10, used: 2, remaining: 8, carryForward: 2 },
            annual_leave: { entitled: 21, used: 8, remaining: 13, carryForward: 3 },
            emergency_leave: { entitled: 5, used: 1, remaining: 4, carryForward: 0 }
          },

          leaveHistory: [
            {
              id: 1,
              type: 'annual_leave',
              startDate: '2024-08-15',
              endDate: '2024-08-17',
              days: 3,
              halfDay: false,
              reason: 'Family vacation',
              advanceNoticeDays: 10,
              status: 'approved',
              approvedBy: 'Manager',
              appliedDate: '2024-08-05',
              payImpact: 'full_pay',
              documents: []
            }
          ]
        }
      },

      // Leave application management
      leaveApplications: [
        {
          id: 1,
          employeeId: 1,
          employeeName: 'Sarah M.',
          type: 'annual_leave',
          startDate: '2024-09-10',
          endDate: '2024-09-12',
          days: 3,
          halfDay: false,
          reason: 'Personal work',
          appliedDate: '2024-08-20',
          advanceNoticeDays: 21,
          status: 'pending',
          approvedBy: null,
          approvedDate: null,
          managerComments: '',
          hrComments: '',
          payImpact: 'full_pay',
          documents: [],
          emergencyJustification: null
        }
      ],

      // Apply for leave
      applyForLeave: (leaveApplication) => {
        const { employeeId, type, startDate, endDate, reason, documents } = leaveApplication;
        
        // Calculate days and advance notice
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const advanceNoticeDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));

        // Validate leave application
        const validation = get().validateLeaveApplication({
          ...leaveApplication,
          days,
          advanceNoticeDays
        });

        if (!validation.isValid) {
          return {
            success: false,
            errors: validation.errors,
            warnings: validation.warnings
          };
        }

        // Calculate pay impact
        const payImpact = get().calculatePayImpact(employeeId, type, days, advanceNoticeDays);

        // Create application
        const application = {
          id: Date.now(),
          employeeId,
          employeeName: get().getEmployeeName(employeeId),
          type,
          startDate,
          endDate,
          days,
          halfDay: leaveApplication.halfDay || false,
          reason,
          appliedDate: new Date().toISOString().split('T')[0],
          advanceNoticeDays: Math.max(0, advanceNoticeDays),
          status: 'pending',
          approvedBy: null,
          approvedDate: null,
          managerComments: '',
          hrComments: '',
          payImpact: payImpact.type,
          payDeduction: payImpact.deduction,
          additionalPenalty: payImpact.penalty,
          documents: documents || [],
          emergencyJustification: leaveApplication.emergencyJustification || null
        };

        set((state) => ({
          leaveApplications: [...state.leaveApplications, application]
        }));

        return {
          success: true,
          application,
          payImpact,
          message: 'Leave application submitted successfully'
        };
      },

      // Validate leave application
      validateLeaveApplication: (application) => {
        const { employeeId, type, days, advanceNoticeDays } = application;
        const errors = [];
        const warnings = [];

        // Check leave type policies
        const leaveType = get().leavePolicies.leaveTypes[type];
        if (!leaveType) {
          errors.push('Invalid leave type');
          return { isValid: false, errors, warnings };
        }

        // Check advance notice requirement
        if (advanceNoticeDays < leaveType.advanceNoticeRequired) {
          if (type === 'emergency_leave' || get().isEmergencyException(application.reason)) {
            warnings.push('Emergency leave - documentation required for approval');
          } else {
            warnings.push(`Insufficient advance notice. Required: ${leaveType.advanceNoticeRequired} days, Provided: ${advanceNoticeDays} days. Pay may be deducted.`);
          }
        }

        // Check leave balance
        const balance = get().getLeaveBalance(employeeId, type);
        if (!balance || balance.remaining < days) {
          errors.push(`Insufficient leave balance. Available: ${balance?.remaining || 0} days, Requested: ${days} days`);
        }

        // Check maximum consecutive days
        if (days > leaveType.maxConsecutiveDays) {
          errors.push(`Maximum consecutive days for ${leaveType.name} is ${leaveType.maxConsecutiveDays} days`);
        }

        // Check blackout periods for annual leave
        if (type === 'annual_leave') {
          const isBlackout = get().isBlackoutPeriod(application.startDate, application.endDate);
          if (isBlackout) {
            errors.push('Leave dates fall within blackout period');
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings
        };
      },

      // Calculate pay impact for leave
      calculatePayImpact: (employeeId, leaveType, days, advanceNoticeDays) => {
        const { payCalculationPolicies, leaveTypes } = get().leavePolicies;
        const leavePolicy = leaveTypes[leaveType];
        
        let payDeduction = 0;
        let penalty = 0;
        let payType = 'full_pay';

        // Check if it's paid or unpaid leave
        if (leavePolicy.payType === 'unpaid') {
          payDeduction = days;
          payType = 'unpaid';
        } else {
          // Check advance notice penalties
          const requiredNotice = leavePolicy.advanceNoticeRequired;
          
          if (advanceNoticeDays < requiredNotice) {
            // Apply short notice penalties
            const penalties = payCalculationPolicies.unpaidLeave.emergencyNoticeRatio;
            
            let ratio = 1.0;
            if (advanceNoticeDays === 0) ratio = penalties['0_days_notice'];
            else if (advanceNoticeDays === 1) ratio = penalties['1_day_notice'];
            else if (advanceNoticeDays === 2) ratio = penalties['2_days_notice'];
            else if (advanceNoticeDays === 3) ratio = penalties['3_days_notice'];
            
            payDeduction = days * ratio - days; // Additional deduction
            penalty = 0; // Could add fixed penalties here
            payType = 'partial_pay';
          }

          // Special case for unnotified leave (applied on same day without emergency reason)
          if (advanceNoticeDays === 0 && leaveType !== 'emergency_leave') {
            const unnotifiedPolicy = payCalculationPolicies.unpaidLeave.unnotifiedLeave;
            payDeduction = days * unnotifiedPolicy.payDeductionRatio - days;
            penalty = unnotifiedPolicy.additionalPenalty;
            payType = 'penalty_applied';
          }
        }

        return {
          type: payType,
          deduction: Math.round(payDeduction * 100) / 100,
          penalty: penalty,
          message: get().getPayImpactMessage(payType, payDeduction, penalty)
        };
      },

      // Get pay impact message
      getPayImpactMessage: (payType, deduction, penalty) => {
        switch (payType) {
          case 'full_pay':
            return 'Full pay will be provided';
          case 'partial_pay':
            return `Partial pay deduction: ${deduction} days due to short notice`;
          case 'unpaid':
            return 'Unpaid leave - no pay for leave days';
          case 'penalty_applied':
            return `Pay deduction: ${deduction} days + penalty: ₹${penalty} for unnotified leave`;
          default:
            return 'Pay impact calculated';
        }
      },

      // Check if reason qualifies for emergency exception
      isEmergencyException: (reason) => {
        const emergencyReasons = get().leavePolicies.advanceNoticePolicies.emergencyExceptions.acceptableReasons;
        return emergencyReasons.some(emergency => 
          reason.toLowerCase().includes(emergency.replace('_', ' '))
        );
      },

      // Check if dates fall in blackout period
      isBlackoutPeriod: (startDate, endDate) => {
        const blackoutPeriods = get().leavePolicies.leaveTypes.annual_leave.blackoutPeriods;
        
        return blackoutPeriods.some(period => {
          const [blackoutStart, blackoutEnd] = period.split('_');
          return (
            (startDate >= blackoutStart && startDate <= blackoutEnd) ||
            (endDate >= blackoutStart && endDate <= blackoutEnd) ||
            (startDate <= blackoutStart && endDate >= blackoutEnd)
          );
        });
      },

      // Get employee leave balance
      getLeaveBalance: (employeeId, leaveType) => {
        const employee = get().employeeLeaveBalances[employeeId];
        return employee?.leaveBalances[leaveType];
      },

      // Get employee name
      getEmployeeName: (employeeId) => {
        const employee = get().employeeLeaveBalances[employeeId];
        return employee?.name || 'Unknown Employee';
      },

      // Approve/reject leave application
      processLeaveApplication: (applicationId, action, comments, approvedBy) => {
        set((state) => ({
          leaveApplications: state.leaveApplications.map(app => {
            if (app.id === applicationId) {
              const updatedApp = {
                ...app,
                status: action, // 'approved' or 'rejected'
                approvedBy,
                approvedDate: new Date().toISOString().split('T')[0],
                managerComments: comments
              };

              // If approved, update leave balance
              if (action === 'approved') {
                get().updateLeaveBalance(app.employeeId, app.type, app.days);
              }

              return updatedApp;
            }
            return app;
          })
        }));
      },

      // Update leave balance after approval
      updateLeaveBalance: (employeeId, leaveType, days) => {
        set((state) => {
          const employee = state.employeeLeaveBalances[employeeId];
          if (!employee) return state;

          const updatedBalance = {
            ...employee.leaveBalances[leaveType],
            used: employee.leaveBalances[leaveType].used + days,
            remaining: employee.leaveBalances[leaveType].remaining - days
          };

          return {
            employeeLeaveBalances: {
              ...state.employeeLeaveBalances,
              [employeeId]: {
                ...employee,
                leaveBalances: {
                  ...employee.leaveBalances,
                  [leaveType]: updatedBalance
                }
              }
            }
          };
        });
      },

      // Get pending leave applications for manager
      getPendingApplications: () => {
        return get().leaveApplications.filter(app => app.status === 'pending');
      },

      // Get employee leave applications
      getEmployeeApplications: (employeeId) => {
        return get().leaveApplications
          .filter(app => app.employeeId === employeeId)
          .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
      },

      // Get leave analytics
      getLeaveAnalytics: () => {
        const { leaveApplications, employeeLeaveBalances } = get();
        
        const totalApplications = leaveApplications.length;
        const approvedApplications = leaveApplications.filter(app => app.status === 'approved').length;
        const pendingApplications = leaveApplications.filter(app => app.status === 'pending').length;
        const rejectedApplications = leaveApplications.filter(app => app.status === 'rejected').length;

        // Leave type distribution
        const leaveTypeStats = leaveApplications.reduce((stats, app) => {
          if (!stats[app.type]) stats[app.type] = 0;
          stats[app.type]++;
          return stats;
        }, {});

        // Average advance notice
        const avgAdvanceNotice = leaveApplications.length > 0
          ? leaveApplications.reduce((sum, app) => sum + app.advanceNoticeDays, 0) / leaveApplications.length
          : 0;

        return {
          totalApplications,
          approvedApplications,
          pendingApplications,
          rejectedApplications,
          approvalRate: totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0,
          leaveTypeStats,
          avgAdvanceNotice: Math.round(avgAdvanceNotice),
          employeeBalances: Object.values(employeeLeaveBalances)
        };
      },

      // Initialize employee leave balance
      initializeEmployeeLeave: (employeeData) => {
        const { id, name, joiningDate, experience } = employeeData;
        const currentYear = new Date().getFullYear().toString();
        
        // Get entitlements based on experience
        const entitlements = get().leavePolicies.annualLeaveEntitlements[experience] || 
                           get().leavePolicies.annualLeaveEntitlements['1-2_years'];

        const leaveBalances = {};
        Object.entries(get().leavePolicies.leaveTypes).forEach(([type, policy]) => {
          leaveBalances[type] = {
            entitled: policy.annualQuota,
            used: 0,
            remaining: policy.annualQuota,
            carryForward: 0
          };
        });

        set((state) => ({
          employeeLeaveBalances: {
            ...state.employeeLeaveBalances,
            [id]: {
              employeeId: id,
              name,
              joiningDate,
              experienceCategory: experience,
              currentYear,
              leaveBalances,
              leaveHistory: []
            }
          }
        }));
      }
    }),
    {
      name: 'leave-policy-storage',
      partialize: (state) => ({
        leavePolicies: state.leavePolicies,
        employeeLeaveBalances: state.employeeLeaveBalances,
        leaveApplications: state.leaveApplications
      })
    }
  )
);

export { useLeavePolicyStore };