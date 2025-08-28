import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Users, 
  FolderOpen, 
  DollarSign, 
  CheckSquare, 
  BarChart3,
  Settings,
  Briefcase,
  TrendingUp,
  Target,
  Calendar,
  MoreHorizontal,
  Search,
  Clock,
  Award,
  Plus,
  AlertCircle,
  Building,
  ChevronRight,
  Phone,
  Mail,
  Globe,
  Trophy,
  Zap,
  Star
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import StatsCard from '../ui/StatsCard';
import CollapsibleSection from '../ui/CollapsibleSection';
import EnhancedManagerDashboard from './EnhancedManagerDashboard';

const RoleSpecificDashboard = () => {
  const { user } = useAuthStore();
  const role = user?.role;
  
  // Mock data for team activity feed
  const [teamActivities, setTeamActivities] = useState([
    { id: 1, user: 'Sarah Johnson', action: 'completed project', target: 'Website Redesign', time: '2 hours ago', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, user: 'Michael Chen', action: 'earned', target: '50 stars', time: '4 hours ago', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 3, user: 'Emma Davis', action: 'submitted', target: 'Quarterly Report', time: '1 day ago', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: 4, user: 'David Wilson', action: 'completed', target: 'API Integration', time: '1 day ago', avatar: 'https://randomuser.me/api/portraits/men/51.jpg' },
  ]);
  
  // Mock data for user achievements
  const [userAchievements] = useState([
    { id: 1, title: 'Early Bird', description: 'Logged in before 8 AM for 5 days', icon: '🌅', earned: true },
    { id: 2, title: 'Task Master', description: 'Completed 20 tasks this month', icon: '✅', earned: true },
    { id: 3, title: 'Team Player', description: 'Helped 3 colleagues', icon: '🤝', earned: false },
    { id: 4, title: 'Perfectionist', description: 'No errors in 10 reviews', icon: '🎯', earned: true },
  ]);

  // Get personalized greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Admin Dashboard View
  if (role === 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Personalized Header with Achievements */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {getGreeting()}, {user?.name || 'Admin'}!
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {userAchievements.filter(ach => ach.earned).slice(0, 3).map(achievement => (
                <div key={achievement.id} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                  <span>{achievement.icon}</span>
                  <span className="font-medium">{achievement.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl hover:shadow transition-all duration-200">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filter</span>
            </button>
            <button className="p-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl hover:shadow transition-all duration-200">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards - Row 1 (Summary KPIs) - Explicitly set as 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Employees" 
            value="42" 
            trend="+2.6%" 
            icon={<Users />} 
            iconBgColor="bg-blue-50" 
            iconColor="text-blue-600"
          />
          
          <StatsCard 
            title="Projects" 
            value="24" 
            trend="+5.2%" 
            icon={<FolderOpen />} 
            iconBgColor="bg-purple-50" 
            iconColor="text-purple-600"
          />
          
          <StatsCard 
            title="Total Tasks" 
            value="128" 
            trend="+3.8%" 
            icon={<CheckSquare />} 
            iconBgColor="bg-green-50" 
            iconColor="text-green-600"
          />
          
          <StatsCard 
            title="Payroll" 
            value="₹125.4K" 
            trend="+4.1%" 
            icon={<DollarSign />} 
            iconBgColor="bg-amber-50" 
            iconColor="text-amber-600"
          />
        </div>

        {/* Main Content Grid - Matching specification exactly */}
        <div className="grid grid-cols-1 gap-4">
          {/* Row 2 (Detailed cards) - 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Working Hours card (~300x200px) */}
            <div className="md:col-span-1">
              <Card className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-slate-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">Working Hours</h3>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-slate-900">46.5</span>
                    <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      +0.5%
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">avg hours / weeks</p>
                  
                  <div className="grid grid-cols-10 gap-1 mb-3">
                    {Array(30).fill(0).map((_, i) => (
                      <div 
                        key={i}
                        className={`h-2 w-2 rounded-full ${Math.random() > 0.3 ? 'bg-slate-600' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-3 text-xs text-slate-500">
                    <span>2 Hours</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-1 bg-slate-300 rounded-full"></span>
                      <span className="w-2 h-1 bg-slate-300 rounded-full"></span>
                      <span className="w-2 h-1 bg-slate-300 rounded-full"></span>
                      <span className="w-2 h-1 bg-slate-600 rounded-full"></span>
                    </div>
                    <span>10 Hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Hiring Statistics (~300x200px) */}
            <div className="md:col-span-1">
              <Card className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200 h-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-700">Hiring Statistics</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-slate-600 mb-2">Talent recruitment</h4>
                    <div className="flex gap-1.5 mb-3">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Talent" className="w-7 h-7 rounded-lg object-cover" />
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Talent" className="w-7 h-7 rounded-lg object-cover" />
                      <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Talent" className="w-7 h-7 rounded-lg object-cover" />
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-600">
                        +5
                      </div>
                    </div>
                    
                    <div className="flex gap-0.5 mb-2">
                      {Array(20).fill(0).map((_, i) => (
                        <div 
                          key={i}
                          className={`h-3 w-1.5 rounded-sm ${i < 12 ? 'bg-green-400' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        <span className="text-slate-700 text-[10px]">120 Matched</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="text-slate-500 text-[10px]">80 Not match</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Payout Monthly (~300x200px, blue gradient emphasis card) */}
            <div className="md:col-span-1">
              <Card className="rounded-2xl bg-blue-500 shadow-sm hover:shadow transition-all duration-200 h-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-white">Payout Monthly</h3>
                    <button className="text-white/70 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-blue-100 mb-2">Salaries and incentive</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-100">Basic salary</span>
                        <span className="text-sm font-medium text-white">₹2040</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-100">Performance</span>
                        <span className="text-sm font-medium text-white">₹300</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-100">Gift</span>
                        <span className="text-sm font-medium text-white">₹200</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-blue-400 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs text-blue-200">Take home pay</p>
                        <p className="text-xl font-semibold text-white">₹2540.00</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-blue-200">Percentage</p>
                        <p className="text-xl font-semibold text-white">100%</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="h-8 w-8 rounded-full bg-blue-400/30 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-white" />
                      </button>
                      <button className="h-8 w-8 rounded-full bg-blue-400/30 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </button>
                      <div className="flex-grow"></div>
                      <button className="h-8 px-4 rounded-full bg-white text-blue-600 text-sm font-medium">Details</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Row 3 (Secondary cards) - First two in 2-column grid, last one full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Onsite/Remote Team toggle card (~300x100px) */}
            <div className="md:col-span-1">
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200 overflow-hidden flex">
                <div className="w-1/2 bg-blue-600 text-white p-4">
                  <div className="mb-2">
                    <h3 className="text-base font-medium">Onsite team</h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">65%</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="w-1/2 bg-white p-4">
                  <div className="mb-2">
                    <h3 className="text-base font-medium text-slate-700">Remote team</h3>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-slate-800">35%</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
                      <Globe className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions card (~300x100px) */}
            <div className="md:col-span-1">
              <Card className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-medium text-slate-700">Quick Actions</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className="flex items-center justify-center gap-1.5 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Task</span>
                    </button>
                    
                    <button
                      className="flex items-center justify-center gap-1.5 py-2 text-sm bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors rounded-lg"
                    >
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Add Employee</span>
                    </button>

                    <button
                      className="flex items-center justify-center gap-1.5 py-2 text-sm bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors rounded-lg"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span className="font-medium">Add Project</span>
                    </button>
                    
                    <button
                      className="flex items-center justify-center gap-1.5 py-2 text-sm bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition-colors rounded-lg"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">Add Payment</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Team Activity Feed */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            <Card className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-slate-700">Team Activity</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {teamActivities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <img 
                        src={activity.avatar} 
                        alt={activity.user} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-900">
                          <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.target}</span>
                        </div>
                        <div className="text-xs text-slate-500">{activity.time}</div>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Manager Dashboard View - Using the enhanced version
  if (role === 'manager') {
    return <EnhancedManagerDashboard />;
  }

  // Default view for team members (should not be used as this component is only for admin/manager)
  return (
    <div className="text-center py-6 text-gray-500 text-sm">
      This dashboard is only available for admin and manager roles.
    </div>
  );
};

export default RoleSpecificDashboard;