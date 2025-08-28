import React from 'react';
import MainLayout from '../../layouts/MainLayout';

// Mock the auth store
const mockUseAuthStore = () => ({
  user: {
    id: 1,
    name: 'Test User',
    role: 'admin',
    email: 'test@example.com'
  },
  logout: jest.fn()
});

// Mock the navigation store
const mockUseNavigationStore = () => ({
  currentPage: 'dashboard',
  setCurrentPage: jest.fn()
});

// Mock the stores
jest.mock('../../state/authStore', () => ({
  useAuthStore: mockUseAuthStore
}));

jest.mock('../../state/navigationStore', () => ({
  useNavigationStore: mockUseNavigationStore
}));

const MainLayoutTest = () => {
  return (
    <div>
      <h1>MainLayout Test</h1>
      <MainLayout />
    </div>
  );
};

export default MainLayoutTest;