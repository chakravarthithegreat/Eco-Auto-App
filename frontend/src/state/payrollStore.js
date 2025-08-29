import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = '/api';

export const usePayrollStore = create(
  persist(
    (set, get) => ({
      // State
      employees: [
        {
          id: 1,
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@artgifts.com',
          role: 'Manager',
          subRole: 'Production Manager',
          department: 'Production',
          baseSalary: 75000,
          isActive: true,
          joinDate: '2022-01-15',
          phone: '+91-9876543210',
          skills: ['Production Planning', 'Quality Control', 'Team Management'],
          shift: 'morning'
        },
        {
          id: 2,
          name: 'Priya Sharma',
          email: 'priya.sharma@artgifts.com',
          role: 'Manager',
          subRole: 'Quality Manager',
          department: 'Quality Control',
          baseSalary: 65000,
          isActive: true,
          joinDate: '2022-03-20',
          phone: '+91-9876543212',
          skills: ['Quality Assurance', 'ISO Standards', 'Inspection'],
          shift: 'morning'
        },
        {
          id: 3,
          name: 'Amit Patel',
          email: 'amit.patel@artgifts.com',
          role: 'Team Member',
          subRole: 'Assembly Technician',
          department: 'Assembly',
          baseSalary: 45000,
          isActive: true,
          joinDate: '2022-06-10',
          phone: '+91-9876543214',
          skills: ['Trophy Assembly', 'Equipment Operation', 'Safety Protocols'],
          shift: 'morning'
        },
        {
          id: 4,
          name: 'Sneha Reddy',
          email: 'sneha.reddy@artgifts.com',
          role: 'Team Member',
          subRole: 'Packaging Specialist',
          department: 'Packaging',
          baseSalary: 40000,
          isActive: true,
          joinDate: '2022-08-05',
          phone: '+91-9876543216',
          skills: ['Packaging Design', 'Material Handling', 'Inventory Management'],
          shift: 'afternoon'
        },
        {
          id: 5,
          name: 'Vikram Singh',
          email: 'vikram.singh@artgifts.com',
          role: 'Team Member',
          subRole: 'Warehouse Operator',
          department: 'Warehouse',
          baseSalary: 38000,
          isActive: true,
          joinDate: '2022-09-12',
          phone: '+91-9876543218',
          skills: ['Inventory Management', 'Forklift Operation', 'Logistics'],
          shift: 'night'
        },
        {
          id: 6,
          name: 'Meera Iyer',
          email: 'meera.iyer@artgifts.com',
          role: 'Admin',
          subRole: 'General Manager',
          department: 'Management',
          baseSalary: 85000,
          isActive: true,
          joinDate: '2021-12-01',
          phone: '+91-9876543220',
          skills: ['Strategic Planning', 'Leadership', 'Operations Management'],
          shift: 'morning'
        }
      ],
      payrollData: [],
      currentPayroll: null,
      payrollPolicy: {
        baseSalary: 50000,           // Base salary in INR
        performanceBonus: 10000,     // Performance-linked bonus
        attendanceBonus: 5000,       // Perfect attendance bonus
        onTimeThreshold: '09:00',    // On-time arrival threshold
        lateThreshold: '09:30',      // Late threshold
        latePenalty: 50,             // Penalty per late arrival in INR
        overtimeRate: 1.5,           // Overtime multiplier
        workingDaysPerMonth: 22,     // Standard working days
        workingHoursPerDay: 8,       // Standard working hours
        taxRate: 0.10,               // 10% tax rate
        pfRate: 0.12,                // 12% Provident Fund
        esiRate: 0.0175              // 1.75% ESI
      },
      isLoading: false,
      error: null,

      // Actions
      fetchEmployees: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/employees`);
          
          if (response.ok) {
            const employees = await response.json();
            // Transform backend data to match frontend format
            const transformedEmployees = employees.map(emp => ({
              id: emp._id || emp.id,
              name: emp.name,
              email: emp.email,
              role: emp.role || 'team_member',
              subRole: emp.position,
              department: emp.department,
              baseSalary: emp.salary,
              isActive: emp.status === 'active',
              joinDate: emp.hireDate,
              phone: emp.phone,
              skills: emp.skills || [],
              shift: emp.shift
            }));
            set({ employees: transformedEmployees, isLoading: false });
          } else {
            throw new Error('Failed to fetch employees');
          }
        } catch (error) {
          console.error('Error fetching employees from backend, checking localStorage:', error);
          
          // Check localStorage for newly created employees
          const localStorageEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
          
          if (localStorageEmployees.length > 0) {
            // Transform localStorage employees to match frontend format
            const transformedEmployees = localStorageEmployees.map(emp => ({
              id: emp._id || emp.id,
              name: emp.name,
              email: emp.email,
              role: emp.role || 'team_member',
              subRole: emp.position,
              department: emp.department,
              baseSalary: emp.salary,
              isActive: emp.status === 'active',
              joinDate: emp.hireDate,
              phone: emp.phoneNumber,
              skills: emp.skills || [],
              shift: emp.shift || 'morning'
            }));
            
            // Merge with existing demo employees
            const existingEmployees = get().employees;
            const allEmployees = [...existingEmployees, ...transformedEmployees];
            
            set({ employees: allEmployees, isLoading: false });
          } else {
            // Use existing demo data if no localStorage employees
            const currentEmployees = get().employees;
            if (currentEmployees.length === 0) {
              // If no demo data exists, use the default demo data
              set({ isLoading: false, error: null });
            } else {
              set({ isLoading: false, error: null });
            }
          }
        }
      },

      fetchPayrollData: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/payroll/summary`);
          
          if (response.ok) {
            const payrollData = await response.json();
            set({ payrollData: [payrollData], isLoading: false });
          } else {
            throw new Error('Failed to fetch payroll data');
          }
        } catch (error) {
          console.error('Error fetching payroll data:', error);
          set({ isLoading: false, error: error.message });
        }
      },

      // Add employee
      addEmployee: (employeeData) => {
        const newEmployee = {
          ...employeeData,
          id: employeeData.id || Date.now(),
          joinDate: employeeData.joinDate || new Date().toISOString().split('T')[0]
        };
        
        set((state) => ({
          employees: [...state.employees, newEmployee]
        }));
        
        return newEmployee;
      },

      // Update employee
      updateEmployee: (employeeId, updates) => {
        set((state) => ({
          employees: state.employees.map(emp => 
            emp.id === employeeId ? { ...emp, ...updates } : emp
          )
        }));
      },

      // Remove employee
      removeEmployee: (employeeId) => {
        set((state) => ({
          employees: state.employees.filter(emp => emp.id !== employeeId)
        }));
      },

      // Get employee by ID
      getEmployee: (employeeId) => {
        return get().employees.find(emp => emp.id === employeeId);
      },

      // Get employees by role
      getEmployeesByRole: (role) => {
        return get().employees.filter(emp => emp.role === role);
      },

      // Calculate monthly payroll with enhanced integration
      calculateMonthlyPayroll: async (userId, month, year, attendanceData, taskData, rewardPoints) => {
        set({ isLoading: true, error: null });
        
        try {
          const { payrollPolicy } = get();
          
          // Calculate attendance metrics
          const attendanceMetrics = get().calculateAttendanceMetrics(attendanceData);
          
          // Base salary calculation
          const dailySalary = payrollPolicy.baseSalary / payrollPolicy.workingDaysPerMonth;
          const earnedSalary = dailySalary * attendanceMetrics.presentDays;
          
          // Performance bonus calculation based on task completion and quality
          let performanceBonus = 0;
          if (taskData && taskData.performanceRating) {
            const ratingMultiplier = {
              5: 1.0,   // Excellent
              4: 0.8,   // Good
              3: 0.6,   // Average
              2: 0.4,   // Below Average
              1: 0.2    // Poor
            };
            performanceBonus = payrollPolicy.performanceBonus * (ratingMultiplier[taskData.performanceRating] || 0.6);
          }
          
          // Attendance bonus (perfect attendance)
          const attendanceBonus = attendanceMetrics.attendancePercentage >= 95 ? payrollPolicy.attendanceBonus : 0;
          
          // Task completion bonus
          let taskCompletionBonus = 0;
          if (taskData && taskData.completedTasks) {
            // Bonus based on number of tasks completed without missing deadlines
            const completionRate = taskData.missedDeadlines === 0 ? 1.0 : 
                                 taskData.missedDeadlines <= 2 ? 0.7 : 0.4;
            taskCompletionBonus = taskData.completedTasks * 100 * completionRate;
          }
          
          // Reward points bonus (1 INR per reward point)
          const rewardPointsBonus = rewardPoints || 0;
          
          // Overtime calculation
          const overtimePay = get().calculateOvertimePay(attendanceMetrics.overtimeHours);
          
          // Leave deductions (from leave store integration)
          const leaveDeductions = get().calculateLeaveDeductions(attendanceData);
          
          // Late penalties
          const latePenalty = attendanceMetrics.lateDays * payrollPolicy.latePenalty;
          
          // Missed deadline penalties
          let missedDeadlinePenalty = 0;
          if (taskData && taskData.missedDeadlines) {
            missedDeadlinePenalty = taskData.missedDeadlines * 200; // 200 INR per missed deadline
          }
          
          // Absenteeism penalties
          const absentPenalty = attendanceMetrics.absentDays * (dailySalary * 0.5); // 50% of daily salary per absent day
          
          // Total bonuses and penalties
          const totalBonuses = performanceBonus + attendanceBonus + taskCompletionBonus + rewardPointsBonus + overtimePay;
          const totalPenalties = latePenalty + missedDeadlinePenalty + absentPenalty + leaveDeductions;
          
          // Gross salary calculation
          const grossSalary = earnedSalary + totalBonuses;
          
          // Tax and statutory deductions
          const taxDeduction = grossSalary * payrollPolicy.taxRate;
          const pfDeduction = earnedSalary * payrollPolicy.pfRate;
          const esiDeduction = earnedSalary * payrollPolicy.esiRate;
          const totalStatutoryDeductions = taxDeduction + pfDeduction + esiDeduction;
          
          // Total deductions
          const totalDeductions = totalPenalties + totalStatutoryDeductions;
          
          // Net salary calculation
          const netSalary = grossSalary - totalDeductions;
          
          const payrollData = {
            userId,
            month,
            year,
            baseSalary: payrollPolicy.baseSalary,
            earnedSalary: Math.round(earnedSalary),
            performanceBonus: Math.round(performanceBonus),
            attendanceBonus: Math.round(attendanceBonus),
            taskCompletionBonus: Math.round(taskCompletionBonus),
            rewardPointsBonus: Math.round(rewardPointsBonus),
            overtimePay: Math.round(overtimePay),
            grossSalary: Math.round(grossSalary),
            latePenalty: Math.round(latePenalty),
            missedDeadlinePenalty: Math.round(missedDeadlinePenalty),
            absentPenalty: Math.round(absentPenalty),
            leaveDeductions: Math.round(leaveDeductions),
            totalBonuses: Math.round(totalBonuses),
            totalPenalties: Math.round(totalPenalties),
            taxDeduction: Math.round(taxDeduction),
            pfDeduction: Math.round(pfDeduction),
            esiDeduction: Math.round(esiDeduction),
            totalStatutoryDeductions: Math.round(totalStatutoryDeductions),
            totalDeductions: Math.round(totalDeductions),
            netSalary: Math.round(netSalary),
            attendanceMetrics,
            taskData,
            rewardPoints,
            calculatedAt: new Date().toISOString(),
            status: 'calculated'
          };

          set((state) => ({
            currentPayroll: payrollData,
            payrollData: [...state.payrollData, payrollData],
            isLoading: false
          }));

          return { success: true, payroll: payrollData };
        } catch (error) {
          console.error('Payroll calculation error:', error);
          set({ isLoading: false, error: 'Failed to calculate payroll' });
          return { success: false };
        }
      },

      // Calculate attendance metrics
      calculateAttendanceMetrics: (attendanceData) => {
        const { payrollPolicy } = get();
        
        const totalRecords = attendanceData.length;
        const presentDays = attendanceData.filter(record => record.status === 'present').length;
        const absentDays = attendanceData.filter(record => record.status === 'absent').length;
        const lateDays = attendanceData.filter(record => {
          if (record.status !== 'present') return false;
          const arrivalTime = new Date(`1970-01-01T${record.arrivalTime}`);
          const threshold = new Date(`1970-01-01T${payrollPolicy.onTimeThreshold}`);
          return arrivalTime > threshold;
        }).length;

        const onTimeDays = presentDays - lateDays;
        const attendancePercentage = (presentDays / payrollPolicy.workingDaysPerMonth) * 100;
        
        // Calculate overtime hours
        const overtimeHours = attendanceData.reduce((total, record) => {
          if (record.status === 'present' && record.hoursWorked > payrollPolicy.workingHoursPerDay) {
            return total + (record.hoursWorked - payrollPolicy.workingHoursPerDay);
          }
          return total;
        }, 0);

        return {
          totalRecords,
          presentDays,
          absentDays,
          lateDays,
          onTimeDays,
          attendancePercentage: Math.round(attendancePercentage * 100) / 100,
          overtimeHours: Math.round(overtimeHours * 100) / 100
        };
      },

      // Calculate overtime pay
      calculateOvertimePay: (overtimeHours) => {
        const { payrollPolicy } = get();
        const hourlyRate = payrollPolicy.baseSalary / (payrollPolicy.workingDaysPerMonth * payrollPolicy.workingHoursPerDay);
        return overtimeHours * hourlyRate * payrollPolicy.overtimeRate;
      },

      // Calculate leave deductions
      calculateLeaveDeductions: (attendanceData) => {
        const { payrollPolicy } = get();
        const dailySalary = payrollPolicy.baseSalary / payrollPolicy.workingDaysPerMonth;
        
        // Count unpaid leave days
        const unpaidLeaveDays = attendanceData.filter(record => 
          record.status === 'leave' && record.leaveType === 'unpaid'
        ).length;
        
        return unpaidLeaveDays * dailySalary;
      },

      // Generate payslip
      generatePayslip: (payrollData) => {
        const payslip = {
          ...payrollData,
          payslipNumber: `PAY-${payrollData.userId}-${payrollData.month}-${payrollData.year}`,
          generatedAt: new Date().toISOString(),
          breakdown: {
            earnings: {
              baseSalary: payrollData.earnedSalary,
              performanceBonus: payrollData.performanceBonus,
              attendanceBonus: payrollData.attendanceBonus,
              taskCompletionBonus: payrollData.taskCompletionBonus,
              rewardPointsBonus: payrollData.rewardPointsBonus,
              overtimePay: payrollData.overtimePay
            },
            deductions: {
              latePenalty: payrollData.latePenalty,
              missedDeadlinePenalty: payrollData.missedDeadlinePenalty,
              absentPenalty: payrollData.absentPenalty,
              leaveDeductions: payrollData.leaveDeductions,
              tax: payrollData.taxDeduction,
              pf: payrollData.pfDeduction,
              esi: payrollData.esiDeduction
            }
          }
        };

        return payslip;
      },

      // Get payroll summary
      getPayrollSummary: (userId) => {
        const { payrollData } = get();
        const userPayrolls = payrollData.filter(p => p.userId === userId);
        
        if (userPayrolls.length === 0) {
          return null;
        }

        const currentYear = new Date().getFullYear();
        const yearlyPayrolls = userPayrolls.filter(p => p.year === currentYear);
        
        const totalEarnings = yearlyPayrolls.reduce((sum, p) => sum + p.grossSalary, 0);
        const totalDeductions = yearlyPayrolls.reduce((sum, p) => sum + p.totalDeductions, 0);
        const totalNetPay = yearlyPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
        
        const avgAttendance = yearlyPayrolls.reduce((sum, p) => 
          sum + p.attendanceMetrics.attendancePercentage, 0) / yearlyPayrolls.length;

        return {
          currentYear,
          monthsProcessed: yearlyPayrolls.length,
          totalEarnings: Math.round(totalEarnings),
          totalDeductions: Math.round(totalDeductions),
          totalNetPay: Math.round(totalNetPay),
          averageAttendance: Math.round(avgAttendance * 100) / 100,
          latestPayroll: userPayrolls[userPayrolls.length - 1]
        };
      },

      // Get monthly totals for overview
      getMonthlyTotals: (month) => {
        const { payrollData } = get();
        const monthlyRecords = payrollData.filter(record => record.month === month);
        
        return {
          totalFinalPay: monthlyRecords.reduce((sum, record) => sum + record.netSalary, 0),
          totalBonuses: monthlyRecords.reduce((sum, record) => sum + record.totalBonuses, 0),
          totalPenalties: monthlyRecords.reduce((sum, record) => sum + record.totalPenalties, 0),
          employeeCount: monthlyRecords.length
        };
      },

      // Calculate payroll for an employee (simplified version)
      calculatePayroll: (employeeId, month, year) => {
        const employee = get().getEmployee(employeeId);
        if (!employee) return null;

        const policy = get().payrollPolicy;
        const baseSalary = employee.baseSalary || policy.baseSalary;
        
        // Calculate bonuses
        const performanceBonus = baseSalary * 0.1; // 10% performance bonus
        const attendanceBonus = baseSalary * 0.05; // 5% attendance bonus
        const totalBonuses = performanceBonus + attendanceBonus;
        
        // Calculate deductions
        const taxDeduction = baseSalary * policy.taxRate;
        const pfDeduction = baseSalary * policy.pfRate;
        const esiDeduction = baseSalary * policy.esiRate;
        const totalDeductions = taxDeduction + pfDeduction + esiDeduction;
        
        // Calculate net salary
        const grossSalary = baseSalary + totalBonuses;
        const netSalary = grossSalary - totalDeductions;

        return {
          employeeId,
          month,
          year,
          baseSalary,
          performanceBonus,
          attendanceBonus,
          totalBonuses,
          taxDeduction,
          pfDeduction,
          esiDeduction,
          totalDeductions,
          grossSalary,
          netSalary,
          status: 'calculated',
          calculatedAt: new Date().toISOString()
        };
      },

      // Add payroll record
      addPayrollRecord: (record) => {
        set((state) => ({
          payrollData: [...state.payrollData, record]
        }));
      },

      // Process payroll (mark as processed)
      processPayroll: (recordId) => {
        set((state) => ({
          payrollData: state.payrollData.map(record => 
            record.id === recordId ? { ...record, status: 'processed' } : record
          )
        }));
      },

      // Update payroll policy (admin only)
      updatePayrollPolicy: (newPolicy) => {
        set((state) => ({
          payrollPolicy: { ...state.payrollPolicy, ...newPolicy }
        }));
      },

      // Get payroll policy
      getPayrollPolicy: () => {
        return get().payrollPolicy;
      },

      // Approve payroll (manager/admin action)
      approvePayroll: async (payrollId) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_BASE_URL}/payroll/${payrollId}/approve`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              payrollData: state.payrollData.map(p => 
                p.id === payrollId ? { ...p, status: 'approved', approvedAt: new Date().toISOString() } : p
              ),
              isLoading: false
            }));
            return { success: true };
          } else {
            set({ isLoading: false, error: 'Failed to approve payroll' });
            return { success: false };
          }
        } catch (error) {
          set({ isLoading: false, error: 'Network error' });
          return { success: false };
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'eco-auto-payroll',
      partialize: (state) => ({
        payrollData: state.payrollData,
        payrollPolicy: state.payrollPolicy
      }),
    }
  )
);