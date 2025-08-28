import React, { useEffect } from 'react';
import { useNavigationStore } from '../../state/navigationStore';
import SmartDashboard from '../dashboard/SmartDashboard';
import EnhancedManagerDashboard from '../dashboard/EnhancedManagerDashboard';
import TaskDashboard from '../tasks/TaskDashboard';
import PomodoroPage from '../pomodoro/PomodoroPage';
import RewardsPage from '../rewards/RewardsPage';
import AttendancePage from '../attendance/AttendancePage';
import ProjectManagement from '../projects/ProjectManagement';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import TATTimer from '../tat/TATTimer';
import ApprovalDashboard from '../approvals/ApprovalDashboard';
import AdminSettings from '../admin/AdminSettings';
import RoleManagement from '../admin/RoleManagement';
import LeaveManagement from '../leaves/LeaveManagement';
import PayrollOverview from '../payroll/PayrollOverview';
import EmployeeManagement from '../employees/EmployeeManagement';
import PoliciesManagement from '../policies/PoliciesManagement';
import RoadmapManager from '../roadmaps/RoadmapManager';
import TalentManagement from '../hiring/TalentManagement';
import RoadmapBoard from '../roadmaps/RoadmapBoard';
import RoadmapBoardGame from '../roadmaps/RoadmapBoardGame';
import NotificationCenter from '../notifications/NotificationCenter';
import AdminDashboard from '../dashboard/AdminDashboard';
import TeamMemberDashboard from '../dashboard/TeamMemberDashboard';
import RoadmapBoardPage from '../roadmaps/RoadmapBoardPage';
import HelpPage from '../common/HelpPage';
import Profile from '../profile/Profile';
import Onboarding from '../onboarding/Onboarding';

const PageRouter = () => {
  const { currentPage } = useNavigationStore();

  useEffect(() => {
    console.log('PageRouter: Current page changed to', currentPage);
  }, [currentPage]);

  // Map page IDs to component functions (not executed components)
  const pageComponents = {
    dashboard: SmartDashboard,
    'manager-dashboard': EnhancedManagerDashboard,
    'admin-dashboard': AdminDashboard,
    'team-member-dashboard': TeamMemberDashboard,
    tasks: TaskDashboard,
    attendance: AttendancePage,
    projects: ProjectManagement,
    analytics: AnalyticsDashboard,
    rewards: RewardsPage,
    pomodoro: PomodoroPage,
    tat: TATTimer,
    approvals: ApprovalDashboard,
    employees: EmployeeManagement,
    'admin-settings': AdminSettings,
    'role-management': RoleManagement,
    payroll: PayrollOverview,
    leaves: LeaveManagement,
    settings: AdminSettings,
    policies: PoliciesManagement,
    roadmaps: RoadmapManager,
    'talent-management': TalentManagement,
    'roadmap-board': RoadmapBoard,
    'roadmap-board-game': RoadmapBoardGame,
    notifications: NotificationCenter,
    'roadmap-board-page': RoadmapBoardPage,
    help: HelpPage,
    profile: Profile,
    onboarding: Onboarding,
  };

  // Render the appropriate component or a fallback
  const renderPage = () => {
    console.log('PageRouter: Rendering page', currentPage);
    
    // Handle special cases for pages with parameters
    if (currentPage && currentPage.startsWith('roadmap-board-')) {
      const roadmapId = currentPage.split('-').pop();
      return <RoadmapBoardGame roadmapId={roadmapId} />;
    }
    
    const Component = pageComponents[currentPage];
    
    if (Component) {
      try {
        console.log('PageRouter: Component found for', currentPage);
        return <Component />;
      } catch (error) {
        console.error('Error rendering component:', error);
        return (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-surface-900 mb-4">Component Error</h1>
            <p>There was an error loading the {currentPage} page.</p>
            <p className="text-sm text-surface-600 mt-2">Error: {error.message}</p>
          </div>
        );
      }
    }
    
    // Default to dashboard if no component found
    console.log('PageRouter: No component found for', currentPage, '- defaulting to dashboard');
    return <SmartDashboard />;
  };

  return (
    <div className="page-router">
      {renderPage()}
    </div>
  );
};

export default PageRouter;