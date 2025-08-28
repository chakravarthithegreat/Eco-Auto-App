import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePayrollPolicyStore = create(
  persist(
    (set, get) => ({
      // Base salary structure and policies
      salaryPolicies: {
        // Base salary tiers by role and experience
        baseSalaryStructure: {
          'Junior Developer': {
            fresher: 25000,
            '1-2_years': 35000,
            '3-5_years': 50000,
            'senior': 70000
          },
          'Senior Developer': {
            fresher: 40000,
            '1-2_years': 55000,
            '3-5_years': 75000,
            'senior': 95000
          },
          'Team Lead': {
            fresher: 60000,
            '1-2_years': 80000,
            '3-5_years': 100000,
            'senior': 125000
          },
          'Manager': {
            fresher: 80000,
            '1-2_years': 110000,
            '3-5_years': 140000,
            'senior': 180000
          },
          'Designer': {
            fresher: 22000,
            '1-2_years': 32000,
            '3-5_years': 45000,
            'senior': 65000
          },
          'Marketing Executive': {
            fresher: 20000,
            '1-2_years': 28000,
            '3-5_years': 40000,
            'senior': 55000
          },
          'Sales Executive': {
            fresher: 18000,
            '1-2_years': 25000,
            '3-5_years': 35000,
            'senior': 50000
          }
        },

        // Performance-linked bonus structure
        performanceBonuses: {
          // Efficiency-based bonuses
          efficiencyBonus: {
            excellent: { threshold: 120, percentage: 15, fixedAmount: 5000 }, // 20% above target
            good: { threshold: 110, percentage: 10, fixedAmount: 3000 },      // 10% above target
            satisfactory: { threshold: 100, percentage: 5, fixedAmount: 1500 }, // On target
            below: { threshold: 0, percentage: 0, fixedAmount: 0 }            // Below target
          },

          // Quality-based bonuses
          qualityBonus: {
            excellent: { threshold: 4.5, percentage: 8, fixedAmount: 3000 },
            good: { threshold: 4.0, percentage: 5, fixedAmount: 2000 },
            satisfactory: { threshold: 3.5, percentage: 2, fixedAmount: 1000 },
            below: { threshold: 0, percentage: 0, fixedAmount: 0 }
          },

          // Attendance-based bonuses
          attendanceBonus: {
            perfect: { threshold: 100, percentage: 5, fixedAmount: 2000 },    // 100% attendance
            excellent: { threshold: 95, percentage: 3, fixedAmount: 1200 },   // 95%+ attendance
            good: { threshold: 90, percentage: 2, fixedAmount: 800 },         // 90%+ attendance
            satisfactory: { threshold: 85, percentage: 1, fixedAmount: 400 }, // 85%+ attendance
            below: { threshold: 0, percentage: 0, fixedAmount: 0 }
          },

          // Project completion bonuses
          projectCompletionBonus: {
            onTime: { percentage: 10, fixedAmount: 2500 },
            early: { percentage: 15, fixedAmount: 4000 },
            late: { percentage: 0, fixedAmount: 0 }
          },

          // Special achievement bonuses
          achievementBonuses: {
            taskStreakBonus: { days: 30, amount: 3000 },      // 30 days consecutive task completion
            clientAppreciationBonus: 5000,                     // Client appreciation letter
            innovationBonus: 8000,                             // Process improvement suggestion
            mentorshipBonus: 2500,                             // Training new team members
            certificationBonus: 7500                           // Professional certification completed
          }
        },

        // Penalty structure
        penalties: {
          // Attendance penalties
          attendancePenalties: {
            lateArrival: {
              '0-15_minutes': 0,
              '15-30_minutes': 200,
              '30-60_minutes': 500,
              'above_60_minutes': 1000
            },
            absentWithoutNotice: {
              perDay: 1500,
              multiplier: 2 // Double penalty for repeated offenses
            },
            earlyLeaving: {
              '0-30_minutes': 0,
              '30-60_minutes': 300,
              'above_60_minutes': 800
            }
          },

          // Performance penalties
          performancePenalties: {
            missedDeadlines: {
              '1-2_days': 1000,
              '3-5_days': 2500,
              'above_5_days': 5000
            },
            qualityIssues: {
              minor: 500,
              major: 1500,
              critical: 3000
            },
            clientComplaints: {
              minor: 2000,
              major: 5000,
              severe: 10000
            }
          },

          // Behavioral penalties
          behavioralPenalties: {
            unprofessionalConduct: 2500,
            teamConflict: 1500,
            policyViolation: 3000,
            repeatedWarnings: 5000
          }
        },

        // Overtime and holiday pay policies
        overtimePolicies: {
          weekdayOvertime: {
            rate: 1.5, // 1.5x regular hourly rate
            threshold: 8 // Hours per day threshold
          },
          weekendOvertime: {
            rate: 2.0, // 2x regular hourly rate
            minimumHours: 4 // Minimum hours for weekend work
          },
          holidayOvertime: {
            rate: 2.5, // 2.5x regular hourly rate
            minimumHours: 4
          }
        },

        // Increment and appraisal policies
        incrementPolicies: {
          annualIncrement: {
            excellent: { percentage: 20, minimumAmount: 8000 },
            good: { percentage: 15, minimumAmount: 5000 },
            satisfactory: { percentage: 10, minimumAmount: 3000 },
            needsImprovement: { percentage: 5, minimumAmount: 1500 },
            unsatisfactory: { percentage: 0, minimumAmount: 0 }
          },
          promotionIncrement: {
            'Junior to Senior': { percentage: 25, minimumAmount: 10000 },
            'Senior to Lead': { percentage: 30, minimumAmount: 15000 },
            'Lead to Manager': { percentage: 35, minimumAmount: 20000 }
          }
        }
      },

      // Employee salary assignments
      employeeSalaries: {
        1: {
          employeeId: 1,
          name: 'Sarah M.',
          role: 'Senior Developer',
          experience: '3-5_years',
          baseSalary: 75000,
          customAdjustments: 0,
          effectiveFrom: '2024-01-01',
          lastReview: '2024-01-01',
          nextReview: '2025-01-01'
        },
        2: {
          employeeId: 2,
          name: 'John D.',
          role: 'Junior Developer',
          experience: '1-2_years',
          baseSalary: 35000,
          customAdjustments: 0,
          effectiveFrom: '2024-01-01',
          lastReview: '2024-01-01',
          nextReview: '2025-01-01'
        },
        3: {
          employeeId: 3,
          name: 'Mike R.',
          role: 'Designer',
          experience: '3-5_years',
          baseSalary: 45000,
          customAdjustments: 0,
          effectiveFrom: '2024-01-01',
          lastReview: '2024-01-01',
          nextReview: '2025-01-01'
        }
      },

      // Get base salary for role and experience
      getBaseSalary: (role, experience) => {
        const { baseSalaryStructure } = get().salaryPolicies;
        return baseSalaryStructure[role]?.[experience] || 0;
      },

      // Calculate performance bonus
      calculatePerformanceBonus: (baseSalary, performanceMetrics) => {
        const { performanceBonuses } = get().salaryPolicies;
        let totalBonus = 0;

        // Efficiency bonus
        const efficiency = performanceMetrics.efficiency || 0;
        Object.entries(performanceBonuses.efficiencyBonus).forEach(([level, criteria]) => {
          if (efficiency >= criteria.threshold) {
            totalBonus += Math.max(
              (baseSalary * criteria.percentage) / 100,
              criteria.fixedAmount
            );
            return;
          }
        });

        // Quality bonus
        const quality = performanceMetrics.qualityRating || 0;
        Object.entries(performanceBonuses.qualityBonus).forEach(([level, criteria]) => {
          if (quality >= criteria.threshold) {
            totalBonus += Math.max(
              (baseSalary * criteria.percentage) / 100,
              criteria.fixedAmount
            );
            return;
          }
        });

        // Attendance bonus
        const attendance = performanceMetrics.attendancePercentage || 0;
        Object.entries(performanceBonuses.attendanceBonus).forEach(([level, criteria]) => {
          if (attendance >= criteria.threshold) {
            totalBonus += Math.max(
              (baseSalary * criteria.percentage) / 100,
              criteria.fixedAmount
            );
            return;
          }
        });

        // Project completion bonus
        if (performanceMetrics.projectsCompleted) {
          const onTimeProjects = performanceMetrics.onTimeProjects || 0;
          const earlyProjects = performanceMetrics.earlyProjects || 0;
          
          totalBonus += onTimeProjects * performanceBonuses.projectCompletionBonus.onTime.fixedAmount;
          totalBonus += earlyProjects * performanceBonuses.projectCompletionBonus.early.fixedAmount;
        }

        return Math.round(totalBonus);
      },

      // Calculate penalties
      calculatePenalties: (attendanceData, performanceData, behavioralData) => {
        const { penalties } = get().salaryPolicies;
        let totalPenalties = 0;

        // Attendance penalties
        if (attendanceData) {
          // Late arrival penalties
          Object.entries(attendanceData.lateArrivals || {}).forEach(([range, count]) => {
            const penalty = penalties.attendancePenalties.lateArrival[range] || 0;
            totalPenalties += penalty * count;
          });

          // Absent without notice
          const absentDays = attendanceData.absentWithoutNotice || 0;
          totalPenalties += absentDays * penalties.attendancePenalties.absentWithoutNotice.perDay;

          // Early leaving penalties
          Object.entries(attendanceData.earlyLeaving || {}).forEach(([range, count]) => {
            const penalty = penalties.attendancePenalties.earlyLeaving[range] || 0;
            totalPenalties += penalty * count;
          });
        }

        // Performance penalties
        if (performanceData) {
          Object.entries(performanceData.missedDeadlines || {}).forEach(([range, count]) => {
            const penalty = penalties.performancePenalties.missedDeadlines[range] || 0;
            totalPenalties += penalty * count;
          });

          Object.entries(performanceData.qualityIssues || {}).forEach(([severity, count]) => {
            const penalty = penalties.performancePenalties.qualityIssues[severity] || 0;
            totalPenalties += penalty * count;
          });

          Object.entries(performanceData.clientComplaints || {}).forEach(([severity, count]) => {
            const penalty = penalties.performancePenalties.clientComplaints[severity] || 0;
            totalPenalties += penalty * count;
          });
        }

        // Behavioral penalties
        if (behavioralData) {
          Object.entries(behavioralData).forEach(([type, count]) => {
            const penalty = penalties.behavioralPenalties[type] || 0;
            totalPenalties += penalty * count;
          });
        }

        return Math.round(totalPenalties);
      },

      // Calculate overtime pay
      calculateOvertimePay: (hourlyRate, overtimeHours) => {
        const { overtimePolicies } = get().salaryPolicies;
        let overtimePay = 0;

        if (overtimeHours.weekday) {
          overtimePay += hourlyRate * overtimeHours.weekday * overtimePolicies.weekdayOvertime.rate;
        }

        if (overtimeHours.weekend) {
          overtimePay += hourlyRate * overtimeHours.weekend * overtimePolicies.weekendOvertime.rate;
        }

        if (overtimeHours.holiday) {
          overtimePay += hourlyRate * overtimeHours.holiday * overtimePolicies.holidayOvertime.rate;
        }

        return Math.round(overtimePay);
      },

      // Update employee salary
      updateEmployeeSalary: (employeeId, salaryData) => {
        set((state) => ({
          employeeSalaries: {
            ...state.employeeSalaries,
            [employeeId]: {
              ...state.employeeSalaries[employeeId],
              ...salaryData,
              lastReview: new Date().toISOString().split('T')[0]
            }
          }
        }));
      },

      // Create new employee salary record
      createEmployeeSalary: (employeeData) => {
        const baseSalary = get().getBaseSalary(employeeData.role, employeeData.experience);
        
        const salaryRecord = {
          employeeId: employeeData.id,
          name: employeeData.name,
          role: employeeData.role,
          experience: employeeData.experience,
          baseSalary: baseSalary + (employeeData.customAdjustments || 0),
          customAdjustments: employeeData.customAdjustments || 0,
          effectiveFrom: new Date().toISOString().split('T')[0],
          lastReview: new Date().toISOString().split('T')[0],
          nextReview: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
        };

        set((state) => ({
          employeeSalaries: {
            ...state.employeeSalaries,
            [employeeData.id]: salaryRecord
          }
        }));

        return salaryRecord;
      },

      // Get employee salary details
      getEmployeeSalary: (employeeId) => {
        return get().employeeSalaries[employeeId];
      },

      // Update salary policies
      updateSalaryPolicies: (section, updates) => {
        set((state) => ({
          salaryPolicies: {
            ...state.salaryPolicies,
            [section]: {
              ...state.salaryPolicies[section],
              ...updates
            }
          }
        }));
      },

      // Calculate comprehensive payroll
      calculateComprehensivePayroll: (employeeId, month, year, metricsData) => {
        const employee = get().getEmployeeSalary(employeeId);
        if (!employee) return null;

        const baseSalary = employee.baseSalary;
        const hourlyRate = baseSalary / (30 * 8); // Assuming 30 days, 8 hours per day

        // Calculate components
        const performanceBonus = get().calculatePerformanceBonus(baseSalary, metricsData.performance || {});
        const penalties = get().calculatePenalties(
          metricsData.attendance,
          metricsData.performance,
          metricsData.behavioral
        );
        const overtimePay = get().calculateOvertimePay(hourlyRate, metricsData.overtime || {});

        // Basic calculations
        const grossSalary = baseSalary + performanceBonus + overtimePay;
        const totalDeductions = penalties;
        const netSalary = grossSalary - totalDeductions;

        // Tax calculations (simplified)
        const taxableIncome = netSalary;
        const tax = get().calculateTax(taxableIncome);
        const finalSalary = netSalary - tax;

        return {
          employeeId,
          employeeName: employee.name,
          month,
          year,
          baseSalary,
          performanceBonus,
          overtimePay,
          grossSalary,
          penalties,
          totalDeductions,
          netSalary,
          tax,
          finalSalary,
          breakdown: {
            efficiency: metricsData.performance?.efficiency || 0,
            quality: metricsData.performance?.qualityRating || 0,
            attendance: metricsData.performance?.attendancePercentage || 0,
            overtimeHours: Object.values(metricsData.overtime || {}).reduce((sum, hours) => sum + hours, 0)
          }
        };
      },

      // Simplified tax calculation
      calculateTax: (income) => {
        // Simplified Indian tax calculation
        if (income <= 250000) return 0;
        if (income <= 500000) return (income - 250000) * 0.05;
        if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
        return 112500 + (income - 1000000) * 0.30;
      },

      // Get salary statistics
      getSalaryStatistics: () => {
        const { employeeSalaries } = get();
        const salaries = Object.values(employeeSalaries);

        if (salaries.length === 0) return null;

        const totalSalaries = salaries.reduce((sum, emp) => sum + emp.baseSalary, 0);
        const averageSalary = totalSalaries / salaries.length;
        const maxSalary = Math.max(...salaries.map(emp => emp.baseSalary));
        const minSalary = Math.min(...salaries.map(emp => emp.baseSalary));

        // Group by role
        const roleGroups = salaries.reduce((groups, emp) => {
          if (!groups[emp.role]) groups[emp.role] = [];
          groups[emp.role].push(emp);
          return groups;
        }, {});

        const roleStatistics = Object.entries(roleGroups).map(([role, employees]) => ({
          role,
          count: employees.length,
          averageSalary: employees.reduce((sum, emp) => sum + emp.baseSalary, 0) / employees.length,
          totalCost: employees.reduce((sum, emp) => sum + emp.baseSalary, 0)
        }));

        return {
          totalEmployees: salaries.length,
          totalMonthlyCost: totalSalaries,
          totalAnnualCost: totalSalaries * 12,
          averageSalary: Math.round(averageSalary),
          maxSalary,
          minSalary,
          roleStatistics
        };
      }
    }),
    {
      name: 'payroll-policy-storage',
      partialize: (state) => ({
        salaryPolicies: state.salaryPolicies,
        employeeSalaries: state.employeeSalaries
      })
    }
  )
);

export { usePayrollPolicyStore };