/**
 * Employee Availability Utility Functions
 * 
 * This module provides functions to check employee availability based on
 * attendance records, leave status, and other factors.
 */

import { ATTENDANCE_STATUS } from '../state/attendanceStore';

/**
 * Check if an employee is currently unavailable
 * @param {number} employeeId - The ID of the employee to check
 * @param {Array} attendanceRecords - Array of attendance records
 * @returns {boolean} - True if employee is unavailable, false otherwise
 */
export const isEmployeeUnavailable = (employeeId, attendanceRecords) => {
  if (!attendanceRecords || attendanceRecords.length === 0) return false;
  
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(record => 
    record.userId === employeeId && record.date === today
  );
  
  if (!todayRecord) return false;
  
  // Employee is unavailable if they are on leave, absent, or half-day
  return [ATTENDANCE_STATUS.leave, ATTENDANCE_STATUS.absent, ATTENDANCE_STATUS.halfDay]
    .includes(todayRecord.status);
};

/**
 * Get the availability status of an employee
 * @param {number} employeeId - The ID of the employee to check
 * @param {Array} attendanceRecords - Array of attendance records
 * @returns {string} - Availability status ('available', 'unavailable', 'half_day')
 */
export const getEmployeeAvailabilityStatus = (employeeId, attendanceRecords) => {
  if (!attendanceRecords || attendanceRecords.length === 0) return 'available';
  
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendanceRecords.find(record => 
    record.userId === employeeId && record.date === today
  );
  
  if (!todayRecord) return 'available';
  
  switch (todayRecord.status) {
    case ATTENDANCE_STATUS.leave:
    case ATTENDANCE_STATUS.absent:
      return 'unavailable';
    case ATTENDANCE_STATUS.halfDay:
      return 'half_day';
    default:
      return 'available';
  }
};

/**
 * Get available employees from a list
 * @param {Array} employees - Array of employee objects
 * @param {Array} attendanceRecords - Array of attendance records
 * @returns {Array} - Array of available employees
 */
export const getAvailableEmployees = (employees, attendanceRecords) => {
  return employees.filter(emp => 
    emp.isActive && !isEmployeeUnavailable(emp.id, attendanceRecords)
  );
};

/**
 * Get unavailable employees from a list
 * @param {Array} employees - Array of employee objects
 * @param {Array} attendanceRecords - Array of attendance records
 * @returns {Array} - Array of unavailable employees with their status
 */
export const getUnavailableEmployees = (employees, attendanceRecords) => {
  return employees
    .filter(emp => !emp.isActive || isEmployeeUnavailable(emp.id, attendanceRecords))
    .map(emp => ({
      ...emp,
      availabilityStatus: getEmployeeAvailabilityStatus(emp.id, attendanceRecords)
    }));
};

export default {
  isEmployeeUnavailable,
  getEmployeeAvailabilityStatus,
  getAvailableEmployees,
  getUnavailableEmployees
};