import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useEmployeeSignUpStore } from '../../state/employeeSignUpStore';
import { useNavigationStore } from '../../state/navigationStore';
import EmployeeSignUp from './EmployeeSignUp';

// Mock the stores
vi.mock('../../state/employeeSignUpStore');
vi.mock('../../state/navigationStore');

describe('EmployeeSignUp', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock the employee sign up store
    useEmployeeSignUpStore.mockReturnValue({
      submitEmployeeSignUp: vi.fn().mockResolvedValue({ success: true }),
      isLoading: false,
      error: null,
      currentSignUp: null,
      clearError: vi.fn(),
      resetSignUp: vi.fn()
    });
    
    // Mock the navigation store
    useNavigationStore.mockReturnValue({
      setCurrentPage: vi.fn(),
      currentPage: 'employee-signup'
    });
  });

  it('renders without crashing', () => {
    render(<EmployeeSignUp />);
    expect(screen.getByText('Employee Registration')).toBeInTheDocument();
  });
});