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
      { id: 'dashboard', label: 'Home', icon: Home, color: 'var(--game-primary)' },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'var(--game-success)' },
      { id: 'attendance', label: 'Time', icon: Clock, color: 'var(--game-accent)' },
      { id: 'rewards', label: 'Rewards', icon: Gift, color: 'var(--game-warning)' },
    ];

    // Add role-specific items
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      baseItems.push(
        { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'var(--game-purple)' },
        { id: 'employees', label: 'Team', icon: Users, color: 'var(--game-info)' },
        { id: 'settings', label: 'Settings', icon: Settings, color: 'var(--game-orange)' }
      );
    } else {
      baseItems.push(
        { id: 'notifications', label: 'Alerts', icon: Bell, color: 'var(--game-danger)' },
        { id: 'profile', label: 'Profile', icon: User, color: 'var(--game-pink)' }
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="md:hidden mobile-dock">
      <div className="flex items-center justify-between">
        {navigationItems.slice(0,5).map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`mobile-dock-btn ${currentPage === item.id ? 'active' : ''}`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;