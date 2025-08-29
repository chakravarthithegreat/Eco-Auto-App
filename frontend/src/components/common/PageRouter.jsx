import React, { Suspense, lazy } from 'react';
import { useNavigationStore } from '../../state/navigationStore';
import DashboardSkeleton from '../ui/DashboardSkeleton';

// Lazy load components with error boundaries
const Dashboard = lazy(() => import('../dashboard/Dashboard'));
const ManagerDashboard = lazy(() => import('../dashboard/ManagerDashboard'));
const AdminDashboard = lazy(() => import('../dashboard/AdminDashboard'));
const TeamMemberDashboard = lazy(() => import('../dashboard/TeamMemberDashboard'));
const TaskDashboard = lazy(() => import('../tasks/TaskDashboard'));
const AttendancePage = lazy(() => import('../attendance/AttendancePage'));
const ProjectsPage = lazy(() => import('../projects/ProjectManagement'));
const AnalyticsDashboard = lazy(() => import('../analytics/AnalyticsDashboard'));
const RewardsPage = lazy(() => import('../rewards/RewardsPage'));
const PomodoroPage = lazy(() => import('../pomodoro/PomodoroPage'));
const TATPage = lazy(() => import('../tat/TATTimer'));
const ApprovalsPage = lazy(() => import('../approvals/ApprovalDashboard'));
const EmployeesPage = lazy(() => import('../employees/EmployeeManagement'));
const PayrollPage = lazy(() => import('../payroll/PayrollDashboard'));
const AdminSettings = lazy(() => import('../admin/AdminSettings'));
const SettingsPage = lazy(() => import('../settings/SettingsPage'));
const SimpleTest = lazy(() => import('../test/SimpleTest'));
const DebugPage = lazy(() => import('../debug/DebugPage'));
const NotificationsPage = lazy(() => import('../notifications/NotificationCenter'));
const EmployeeNotificationsPage = lazy(() => import('../notifications/EmployeeNotificationsPage'));
const RoadmapsPage = lazy(() => import('../roadmaps/RoadmapBoardPage'));
const TalentManagementPage = lazy(() => import('../hiring/TalentManagement'));
const LeavesPage = lazy(() => import('../leaves/LeaveManagement'));
const HelpPage = lazy(() => import('../help/HelpPage'));
const EmployeeSignUp = lazy(() => import('../employees/EmployeeSignUp'));
const TermsAndConditionsPage = lazy(() => import('../policies/PoliciesManagement'));
const ProfileCreationPage = lazy(() => import('../profile/Profile'));
const EmployeeApprovalsPage = lazy(() => import('../employees/EmployeeApprovalsPage'));
// const NotificationSoundTestPage = lazy(() => import('../test/NotificationSoundTestPage'));

// Error Boundary Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
      <div className="text-center p-8 max-w-md">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">The page encountered an error while loading.</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

// Component with Error Boundary
const SafeComponent = ({ component: Component, fallback = <DashboardSkeleton />, ...props }) => {
  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

// Error Boundary Class
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PageRouter Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.FallbackComponent ? 
        <this.props.FallbackComponent error={this.state.error} resetErrorBoundary={() => this.setState({ hasError: false, error: null })} /> :
        <ErrorFallback error={this.state.error} resetErrorBoundary={() => this.setState({ hasError: false, error: null })} />;
    }

    return this.props.children;
  }
}

const PageRouter = () => {
  const { currentPage } = useNavigationStore();
  
  console.log('PageRouter: Rendering page:', currentPage);

  // FIXED: Add proper error handling for unknown pages
  const getPageComponent = () => {
    const pageMap = {
      'dashboard': Dashboard,
      'manager-dashboard': ManagerDashboard,
      'admin-dashboard': AdminDashboard,
      'team-member-dashboard': TeamMemberDashboard,
      'tasks': TaskDashboard,
      'attendance': AttendancePage,
      'projects': ProjectsPage,
      'analytics': AnalyticsDashboard,
      'rewards': RewardsPage,
      'pomodoro': PomodoroPage,
      'tat': TATPage,
      'approvals': ApprovalsPage,
      'employees': EmployeesPage,
      'payroll': PayrollPage,
      'admin-settings': AdminSettings,
      'settings': SettingsPage,
      'simple-test': SimpleTest,
      'debug': DebugPage,
      'notifications': NotificationsPage,
      'employee-notifications': EmployeeNotificationsPage,
      'roadmaps': RoadmapsPage,
      'talent-management': TalentManagementPage,
      'leaves': LeavesPage,
      'help': HelpPage,
      'employee-signup': EmployeeSignUp,
      'terms-and-conditions': TermsAndConditionsPage,
      'profile-creation': ProfileCreationPage,
      'employee-approvals': EmployeeApprovalsPage,
      // 'notification-sound-test': NotificationSoundTestPage,
    };

    const Component = pageMap[currentPage];
    
    if (!Component) {
      console.error('PageRouter: Unknown page:', currentPage);
      // Return a fallback component for unknown pages
      return () => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300">The page "{currentPage}" doesn't exist.</p>
          </div>
        </div>
      );
    }

    return Component;
  };

  const PageComponent = getPageComponent();

  return (
    <div className="page-router">
      <SafeComponent component={PageComponent} />
    </div>
  );
};

export default PageRouter;