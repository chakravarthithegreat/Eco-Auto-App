import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../state/authStore';
import { useNavigationStore } from '../state/navigationStore';
import PageRouter from '../components/common/PageRouter';
import MobileNavigation from '../components/layout/MobileNavigation';
import ThemeToggle from '../components/ui/ThemeToggle';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Users, 
  BarChart3, 
  Gift, 
  Clock, 
  Settings,
  LogOut,
  Menu,
  Search,
  Bell,
  Plus,
  X,
  Target,
  CheckCircle,
  UserCog,
  FileText,
  PieChart,
  Briefcase,
  User,
  Building,
  Award,
  BookOpen,
  MessageSquare,
  HelpCircle,
  MoreVertical,
  Route,
  Zap,
  Flag,
  AlertCircle,
  Bug
} from 'lucide-react';
import { triggerHaptic } from '../utils/hapticUtils';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const { currentPage, setCurrentPage } = useNavigationStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMoreMenuOpen, setIsDesktopMoreMenuOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // State for managing dropdown menu
  const moreMenuButtonRef = useRef(null);
  const moreMenuDropdownRef = useRef(null);

  // Close desktop more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreMenuDropdownRef.current && 
        !moreMenuDropdownRef.current.contains(event.target) &&
        moreMenuButtonRef.current && 
        !moreMenuButtonRef.current.contains(event.target)
      ) {
        setIsDesktopMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize haptics
  useEffect(() => {
    // In a real implementation, we would initialize haptics here
  }, []);

  // Set initial page based on user role
  useEffect(() => {
    console.log('MainLayout: User role is', user?.role, 'Current page:', currentPage);
    if ((currentPage === 'dashboard' || !currentPage) && user) {
      if (user?.role === 'ADMIN') {
        console.log('MainLayout: Redirecting ADMIN to admin-dashboard');
        setCurrentPage('admin-dashboard');
      } else if (user?.role === 'MANAGER') {
        console.log('MainLayout: Redirecting MANAGER to manager-dashboard');
        setCurrentPage('manager-dashboard');
      } else if (user?.role === 'TEAM_MEMBER') {
        console.log('MainLayout: Redirecting TEAM_MEMBER to team-member-dashboard');
        setCurrentPage('team-member-dashboard');
      } else {
        // Default to admin dashboard if role is not set
        console.log('MainLayout: Role not set, defaulting to admin-dashboard');
        setCurrentPage('admin-dashboard');
      }
    } else if ((currentPage === 'dashboard' || !currentPage) && !user) {
      // If no user data but on dashboard page, default to admin dashboard
      console.log('MainLayout: No user data, defaulting to admin-dashboard');
      setCurrentPage('admin-dashboard');
    }
  }, [user, currentPage, setCurrentPage]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, path: '/attendance' },
    { id: 'projects', label: 'Projects', icon: Users, path: '/projects', requiresRole: ['ADMIN', 'MANAGER'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics', requiresRole: ['ADMIN', 'MANAGER'] },
    { id: 'roadmaps', label: 'Roadmaps', icon: Route, path: '/roadmaps', requiresRole: ['ADMIN', 'MANAGER'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
    { id: 'rewards', label: 'Rewards', icon: Gift, path: '/rewards' },
    { id: 'pomodoro', label: 'Focus', icon: Clock, path: '/pomodoro' },
    { id: 'tat', label: 'TAT Timer', icon: Target, path: '/tat' },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle, path: '/approvals', requiresRole: ['ADMIN', 'MANAGER'] },
    { id: 'employees', label: 'Employees', icon: User, path: '/employees', requiresRole: ['ADMIN', 'MANAGER'] },
    { id: 'payroll', label: 'Payroll', icon: Briefcase, path: '/payroll', requiresRole: ['ADMIN', 'MANAGER'] },
    { id: 'talent-management', label: 'Talent Management', icon: Users, path: '/talent-management', requiresRole: ['ADMIN', 'MANAGER'] },
    { id: 'admin-settings', label: 'Admin Settings', icon: UserCog, path: '/admin-settings', requiresRole: ['ADMIN'] },
    { id: 'role-management', label: 'Role Management', icon: Users, path: '/role-management', requiresRole: ['ADMIN'] },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', requiresRole: ['ADMIN'] },
  ];

  // Additional items for the dropdown menu
  const dropdownItems = [
    { id: 'manager-dashboard', label: 'Manager Dashboard', icon: BarChart3, requiresRole: ['ADMIN'] },
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.requiresRole) return true;
    return item.requiresRole.includes(user?.role);
  });

  const handleNavigation = (pageId) => {
    triggerHaptic('light');
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsDesktopMoreMenuOpen(false);
  };

  const handleLogout = async () => {
    triggerHaptic('medium');
    await logout();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    if (hour >= 17) greeting = 'Good evening';
    
    return `${greeting}, ${user?.name?.split(' ')[0] || user?.username}!`;
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      ADMIN: 'Administrator',
      MANAGER: 'Manager',
      TEAM_MEMBER: 'Team Member'
    };
    return roleNames[role] || role;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would trigger a search
      triggerHaptic('light');
      setIsSearchOpen(false);
    }
  };

  const markNotificationsAsRead = () => {
    triggerHaptic('light');
    setUnreadNotifications(0);
  };

  // If user hasn't completed onboarding, prompt via avatar click
  const goToProfileOrOnboarding = () => {
    if (user?.onboardingComplete) {
      handleNavigation('profile');
    } else {
      handleNavigation('onboarding');
    }
  };

  return (
    <div className="app-container bg-light-bg min-h-screen dark:bg-dark-bg">
      {/* Mobile Header - Enhanced design */}
      <div className="mobile-header bg-light-surface shadow-glass-sm border-b border-light-bg-secondary md:hidden dark:bg-dark-surface dark:border-dark-bg-secondary">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-light-primary to-light-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-light-text truncate max-w-[140px] dark:text-dark-text">{getGreeting()}</h1>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{getRoleDisplayName(user?.role)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => {
                triggerHaptic('light');
                setIsSearchOpen(!isSearchOpen);
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-light-bg-secondary hover:bg-light-bg-secondary/80 active:bg-light-bg-secondary/90 transition-colors dark:bg-dark-bg-secondary dark:hover:bg-dark-bg-secondary/80">
              <Search className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
            <div className="relative">
              <button 
                onClick={() => {
                  triggerHaptic('light');
                  markNotificationsAsRead();
                  handleNavigation('notifications');
                }}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-light-bg-secondary hover:bg-light-bg-secondary/80 active:bg-light-bg-secondary/90 transition-colors dark:bg-dark-bg-secondary dark:hover:bg-dark-bg-secondary/80">
                <Bell className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
              </button>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-light-danger text-[10px] font-medium text-white dark:bg-dark-danger">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </div>
            <button 
              onClick={() => {
                triggerHaptic('light');
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-light-bg-secondary hover:bg-light-bg-secondary/80 active:bg-light-bg-secondary/90 transition-colors dark:bg-dark-bg-secondary dark:hover:bg-dark-bg-secondary/80">
              <Menu className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
          </div>
        </div>
        
        {/* Search Bar - Mobile */}
        {isSearchOpen && (
          <div className="px-4 pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-light-bg-secondary rounded-full border-none focus:outline-none focus:ring-2 focus:ring-light-secondary dark:bg-dark-bg-secondary dark:text-dark-text"
                autoFocus
              />
              <button 
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-text-secondary hover:text-light-text dark:text-dark-text-secondary dark:hover:text-dark-text">
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop Header - Enhanced navigation */}
      <div className="desktop-header bg-light-surface shadow-glass-sm border-b border-light-bg-secondary hidden md:block dark:bg-dark-surface dark:border-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-2 w-full max-w-[75%] overflow-hidden">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-light-primary to-light-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-light-text dark:text-dark-text"><span className="text-light-primary dark:text-dark-primary">Eco</span>-Auto</h1>
                </div>
              </div>
              
              {/* Navigation Pills */}
              <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-grow ml-2">
                {filteredNavItems.slice(0, 4).map((item) => {
                  const isActive = currentPage === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-full transition-all duration-200 flex-shrink-0 ${
                        isActive 
                          ? 'bg-[var(--light-primary)] text-white shadow-glass-sm' 
                          : 'text-slate-700 hover:text-slate-900 bg-white/70 border border-slate-200 hover:bg-white'
                      }`}>
                      <Icon className="w-4 h-4" />
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
                
                {filteredNavItems.length > 4 && (
                  <div className="relative flex-shrink-0">
                    <button 
                      ref={moreMenuButtonRef}
                      onClick={(e) => {
                        triggerHaptic('light');
                        // Calculate position for dropdown
                        const rect = e.currentTarget.getBoundingClientRect();
                        setDropdownPosition({
                          top: rect.bottom + window.scrollY + 5,
                          left: rect.left + window.scrollX
                        });
                        setIsDesktopMoreMenuOpen(!isDesktopMoreMenuOpen);
                      }}
                      className="flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg text-light-text-secondary hover:text-light-text hover:bg-light-bg-secondary transition-all dark:text-dark-text-secondary dark:hover:text-dark-text dark:hover:bg-dark-bg-secondary">
                      <MoreVertical className="w-4 h-4" />
                      <span className="font-medium whitespace-nowrap">More</span>
                    </button>
                    {isDesktopMoreMenuOpen && (
                      <div 
                        ref={moreMenuDropdownRef}
                        className="fixed bg-light-surface rounded-xl shadow-glass-lg border border-light-bg-secondary py-2 z-[100] w-56 dark:bg-dark-surface dark:border-dark-bg-secondary"
                        style={{
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                        }}
                      >
                        {filteredNavItems.slice(4).map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                handleNavigation(item.id);
                                setIsDesktopMoreMenuOpen(false);
                              }}
                              className="flex items-center gap-3 w-full px-4 py-2 text-left text-light-text hover:bg-light-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                        
                        {/* Dropdown-specific items */}
                        {dropdownItems
                          .filter(item => !item.requiresRole || item.requiresRole.includes(user?.role))
                          .map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  handleNavigation(item.id);
                                  setIsDesktopMoreMenuOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-left text-light-text hover:bg-light-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary border-t border-light-bg-secondary dark:border-dark-bg-secondary">
                                <Icon className="w-4 h-4" />
                                <span>{item.label}</span>
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                )}
              </nav>
            </div>
            
            {/* Right side - Actions and Profile */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                <div className="relative">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-7 pr-2 py-1 bg-light-bg-secondary rounded-full border-none focus:outline-none focus:ring-2 focus:ring-light-secondary w-40 text-sm dark:bg-dark-bg-secondary dark:text-dark-text" />
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                  </form>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => {
                      markNotificationsAsRead();
                      handleNavigation('notifications');
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-light-bg-secondary hover:bg-light-bg-secondary/80 active:bg-light-bg-secondary/90 transition-colors dark:bg-dark-bg-secondary dark:hover:bg-dark-bg-secondary/80">
                    <Bell className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                  </button>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-light-danger text-[9px] font-medium text-white dark:bg-dark-danger">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </div>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center gap-2 pl-2 border-l border-light-bg-secondary dark:border-dark-bg-secondary">
                <div className="text-right hidden lg:block">
                  <div className="text-xs font-semibold text-light-text dark:text-dark-text">{user?.name}</div>
                  <div className="text-[10px] text-light-text-secondary dark:text-dark-text-secondary">{getRoleDisplayName(user?.role)}</div>
                </div>
                <div className="relative cursor-pointer" onClick={goToProfileOrOnboarding} title="View profile">
                  {user?.avatar || user?.photoURL || user?.image ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img 
                        src={user.avatar || user.photoURL || user.image} 
                        alt={user?.name || 'User'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-light-primary to-light-secondary flex items-center justify-center hidden">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-light-primary to-light-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-light-success border-2 border-light-surface dark:border-dark-surface"></div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-light-text-secondary hover:text-light-danger hover:bg-light-bg-secondary rounded-full transition-colors dark:text-dark-text-secondary dark:hover:text-dark-danger dark:hover:bg-dark-bg-secondary"
                  title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="page-content pb-32 md:pb-8 max-w-7xl mx-auto px-6">
        <PageRouter />
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Mobile Full Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-light-surface z-50 overflow-y-auto dark:bg-dark-surface">
          <div className="p-4 border-b border-light-bg-secondary flex items-center justify-between dark:border-dark-bg-secondary">
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text">Menu</h2>
            <button 
              onClick={() => {
                triggerHaptic('light');
                setIsMobileMenuOpen(false);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-light-bg-secondary hover:bg-light-bg-secondary/80 dark:bg-dark-bg-secondary dark:hover:bg-dark-bg-secondary/80">
              <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
            </button>
          </div>
          
          <div className="p-4">
            {/* User Profile Card */}
            <div className="bg-gradient-to-r from-light-primary to-light-secondary rounded-2xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-white">
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-sm opacity-90">{getRoleDisplayName(user?.role)}</div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button 
                onClick={() => {
                  triggerHaptic('light');
                  handleNavigation('tasks');
                }}
                className="flex flex-col items-center justify-center p-3 bg-light-bg-secondary rounded-xl dark:bg-dark-bg-secondary">
                <div className="w-10 h-10 rounded-full bg-light-secondary/10 flex items-center justify-center mb-2 dark:bg-dark-secondary/10">
                  <Zap className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
                </div>
                <span className="text-xs text-light-text dark:text-dark-text">Quick Task</span>
              </button>
              <button 
                onClick={() => {
                  triggerHaptic('light');
                  handleNavigation('notifications');
                }}
                className="flex flex-col items-center justify-center p-3 bg-light-bg-secondary rounded-xl dark:bg-dark-bg-secondary">
                <div className="w-10 h-10 rounded-full bg-light-success/10 flex items-center justify-center mb-2 dark:bg-dark-success/10">
                  <Bell className="w-5 h-5 text-light-success dark:text-dark-success" />
                </div>
                <span className="text-xs text-light-text dark:text-dark-text">Notifications</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex flex-col items-center justify-center p-3 bg-light-bg-secondary rounded-xl dark:bg-dark-bg-secondary">
                <div className="w-10 h-10 rounded-full bg-light-danger/10 flex items-center justify-center mb-2 dark:bg-dark-danger/10">
                  <LogOut className="w-5 h-5 text-light-danger dark:text-dark-danger" />
                </div>
                <span className="text-xs text-light-text dark:text-dark-text">Logout</span>
              </button>
            </div>
            
            {/* Navigation Menu */}
            <div className="space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center w-full p-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-light-primary to-light-secondary text-white' 
                        : 'bg-light-bg-secondary text-light-text hover:bg-light-bg-secondary/80 dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary/80'
                    }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      isActive ? 'bg-white/20' : 'bg-white/10 dark:bg-dark-bg-secondary'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-light-text-secondary dark:text-dark-text-secondary'}`} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Debug Navigation Items */}
              <div className="mt-4 pt-4 border-t border-light-bg-secondary dark:border-dark-bg-secondary">
                <button
                  onClick={() => handleNavigation('store-debug')}
                  className={`flex items-center w-full p-3 rounded-xl transition-all mb-2 ${
                    currentPage === 'store-debug'
                      ? 'bg-gradient-to-r from-light-primary to-light-secondary text-white' 
                      : 'bg-light-bg-secondary text-light-text hover:bg-light-bg-secondary/80 dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary/80'
                  }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    currentPage === 'store-debug' ? 'bg-white/20' : 'bg-white/10 dark:bg-dark-bg-secondary'
                  }`}>
                    <Bug className={`w-5 h-5 ${currentPage === 'store-debug' ? 'text-white' : 'text-light-text-secondary dark:text-dark-text-secondary'}`} />
                  </div>
                  <span className="font-medium">Store Debug</span>
                </button>
                
                <button
                  onClick={() => handleNavigation('dashboard-test')}
                  className={`flex items-center w-full p-3 rounded-xl transition-all ${
                    currentPage === 'dashboard-test'
                      ? 'bg-gradient-to-r from-light-primary to-light-secondary text-white' 
                      : 'bg-light-bg-secondary text-light-text hover:bg-light-bg-secondary/80 dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary/80'
                  }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                    currentPage === 'dashboard-test' ? 'bg-white/20' : 'bg-white/10 dark:bg-dark-bg-secondary'
                  }`}>
                    <Bug className={`w-5 h-5 ${currentPage === 'dashboard-test' ? 'text-white' : 'text-light-text-secondary dark:text-dark-text-secondary'}`} />
                  </div>
                  <span className="font-medium">Dashboard Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;