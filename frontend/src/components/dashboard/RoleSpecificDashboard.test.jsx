import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAuthStore } from '../../state/authStore';
import RoleSpecificDashboard from './RoleSpecificDashboard';

// Mock the useAuthStore hook
vi.mock('../../state/authStore', () => ({
  useAuthStore: () => ({
    user: { role: 'admin', name: 'Admin User' }
  }),
}));

// Mock the EnhancedManagerDashboard component
vi.mock('./EnhancedManagerDashboard', () => ({
  default: () => <div>Enhanced Manager Dashboard</div>,
}));

describe('RoleSpecificDashboard', () => {
  it('should render admin dashboard when user is admin', () => {
    render(<RoleSpecificDashboard />);
    // Check for elements that are specific to the admin dashboard
    // Use a more flexible matcher since the greeting changes based on time of day
    expect(screen.getByText(/Admin User/)).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });
});