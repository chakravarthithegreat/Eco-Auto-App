import React from 'react';
import { 
  Home, 
  FileText, 
  CreditCard, 
  User, 
  CheckSquare, 
  Settings,
  BarChart3,
  Users,
  Bell,
  Gift,
  Clock,
  Target,
  CheckCircle,
  Briefcase,
  Route,
  Zap
} from 'lucide-react';
import { useNavigationStore } from '../../state/navigationStore';
import { useAuthStore } from '../../state/authStore';
import { triggerHaptic } from '../../utils/hapticUtils';

const MobileNavigation = () => {
  const { currentPage, setCurrentPage } = useNavigationStore();
  const { user } = useAuthStore();

  const handleNavigation = (pageId) => {
    triggerHaptic('light');
    setCurrentPage(pageId);
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Home', icon: Home },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
      { id: 'attendance', label: 'Time', icon: Clock },
      { id: 'rewards', label: 'Rewards', icon: Gift },
    ];

    // Add role-specific items
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      baseItems.push(
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'employees', label: 'Team', icon: Users },
        { id: 'employee-notifications', label: 'Alerts', icon: Bell },
        { id: 'employee-approvals', label: 'Approvals', icon: CheckSquare },
        { id: 'settings', label: 'Settings', icon: Settings }
      );
    } else {
      baseItems.push(
        { id: 'notifications', label: 'Alerts', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User }
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="md:hidden mobile-dock bg-light-surface border-t border-light-bg-secondary dark:bg-dark-surface dark:border-dark-bg-secondary">
      <div className="flex items-center justify-between px-2 py-2">
        {navigationItems.slice(0,5).map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors flex-1 ${
              currentPage === item.id 
                ? 'text-light-primary bg-light-bg-secondary dark:text-dark-primary dark:bg-dark-bg-secondary' 
                : 'text-light-text-secondary hover:text-light-text dark:text-dark-text-secondary dark:hover:text-dark-text'
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;