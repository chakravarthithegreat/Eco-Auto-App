import React from 'react';
import { useNavigationStore } from './state/navigationStore';
import { DarkModeProvider } from './contexts/DarkModeContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import TaskDashboard from './components/tasks/TaskDashboard';
import AttendancePage from './components/attendance/AttendancePage';
import ProjectManagement from './components/projects/ProjectManagement';
import { AnalyticsPage, RewardsPage, PomodoroPage, SettingsPage } from './components/common/PlaceholderPages';

import './global.css';

function App() {
  const { currentPage } = useNavigationStore();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskDashboard />;
      case 'attendance':
        return <AttendancePage />;
      case 'projects':
        return <ProjectManagement />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'rewards':
        return <RewardsPage />;
      case 'pomodoro':
        return <PomodoroPage />;
      case 'settings':
        return <SettingsPage />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <DarkModeProvider>
      <MainLayout>
        {renderCurrentPage()}
      </MainLayout>
    </DarkModeProvider>
  );
}

export default App;