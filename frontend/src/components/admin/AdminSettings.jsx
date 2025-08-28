import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  BarChart3, 
  Clock, 
  Bell, 
  Shield, 
  Palette, 
  Zap,
  Save, 
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { triggerHaptic } from '../../utils/hapticUtils';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      autoAssign: false,
      teamAnalytics: false,
      flexibleHours: false
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      dailyDigest: true
    },
    display: {
      theme: 'auto',
      compactMode: false,
      showAnimations: true,
      hapticFeedback: false
    },
    privacy: {
      profileVisibility: 'team',
      activityStatus: true,
      dataSharing: false
    },
    performance: {
      autoRefresh: true,
      cacheData: true,
      lowPowerMode: false
    }
  });

  const handleSettingChange = (category, setting, value) => {
    triggerHaptic('light');
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    triggerHaptic('medium');
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    triggerHaptic('medium');
    // Reset to default settings
    setSettings({
      notifications: {
        email: true,
        push: true,
        sms: false,
        dailyDigest: true
      },
      display: {
        theme: 'auto',
        compactMode: false,
        showAnimations: true,
        hapticFeedback: false
      },
      privacy: {
        profileVisibility: 'team',
        activityStatus: true,
        dataSharing: false
      },
      performance: {
        autoRefresh: true,
        cacheData: true,
        lowPowerMode: false
      }
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'performance', label: 'Performance', icon: Zap }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-glass-sm">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-light-primary dark:text-dark-primary" />
          Team Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-light-text dark:text-dark-text">Auto-assign tasks</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Automatically assign tasks to available team members</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.general?.autoAssign || false}
                onChange={(e) => handleSettingChange('general', 'autoAssign', e.target.checked)}
              />
              <div className="w-11 h-6 bg-light-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-light-primary/20 rounded-full peer dark:bg-dark-bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-light-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
          <div>
              <p className="font-medium text-light-text dark:text-dark-text">Team analytics</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Show detailed analytics for team performance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.general?.teamAnalytics || false}
                onChange={(e) => handleSettingChange('general', 'teamAnalytics', e.target.checked)}
              />
              <div className="w-11 h-6 bg-light-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-light-primary/20 rounded-full peer dark:bg-dark-bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-light-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-glass-sm">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-light-primary dark:text-dark-primary" />
          Time Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-light-text dark:text-dark-text">Flexible hours</p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Allow team members to work flexible hours</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                  <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.general?.flexibleHours || false}
                onChange={(e) => handleSettingChange('general', 'flexibleHours', e.target.checked)}
              />
              <div className="w-11 h-6 bg-light-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-light-primary/20 rounded-full peer dark:bg-dark-bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-light-primary"></div>
            </label>
          </div>
        </div>
                </div>
                </div>
  );

  const renderNotificationsSettings = () => (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-glass-sm">
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-light-primary dark:text-dark-primary" />
        Notification Preferences
      </h3>
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
                <div>
              <p className="font-medium text-light-text dark:text-dark-text capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Receive {key.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications
              </p>
                </div>
            <label className="relative inline-flex items-center cursor-pointer">
                  <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
              />
              <div className="w-11 h-6 bg-light-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-light-primary/20 rounded-full peer dark:bg-dark-bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-light-primary"></div>
                  </label>
                </div>
        ))}
                </div>
              </div>
  );

  const renderDisplaySettings = () => (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-glass-sm">
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-light-primary dark:text-dark-primary" />
        Display & Appearance
      </h3>
      <div className="space-y-4">
        {Object.entries(settings.display).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-light-text dark:text-dark-text capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {key === 'theme' ? 'Choose your preferred theme' : 
                 key === 'compactMode' ? 'Use compact layout for more content' :
                 key === 'showAnimations' ? 'Show smooth animations and transitions' :
                 'Enable haptic feedback for interactions'}
              </p>
            </div>
            {key === 'theme' ? (
              <select
                value={value}
                onChange={(e) => handleSettingChange('display', key, e.target.value)}
                className="px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-bg-secondary dark:border-dark-bg-secondary rounded-lg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            ) : (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={(e) => handleSettingChange('display', key, e.target.checked)}
                />
                <div className="w-11 h-6 bg-light-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-light-primary/20 rounded-full peer dark:bg-dark-bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-light-primary"></div>
                </label>
            )}
              </div>
        ))}
              </div>
            </div>
  );

  const renderPrivacySettings = () => (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-glass-sm">
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-light-primary dark:text-dark-primary" />
        Privacy & Security
      </h3>
      <div className="space-y-4">
        {Object.entries(settings.privacy).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
                      <div>
              <p className="font-medium text-light-text dark:text-dark-text capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {key === 'profileVisibility' ? 'Control who can see your profile' :
                 key === 'activityStatus' ? 'Show when you are active' :
                 'Allow data sharing for analytics'}
                        </p>
                      </div>
            {key === 'profileVisibility' ? (
              <select
                value={value}
                onChange={(e) => handleSettingChange('privacy', key, e.target.value)}
                className="px-3 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-bg-secondary dark:border-dark-bg-secondary rounded-lg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              >
                <option value="public">Public</option>
                <option value="team">Team Only</option>
                <option value="private">Private</option>
              </select>
            ) : (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                />
                <div className="w-11 h-6 bg-light-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-light-primary/20 rounded-full peer dark:bg-dark-bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-light-primary"></div>
              </label>
            )}
          </div>
        ))}
                </div>
              </div>
  );

  const renderPerformanceSettings = () => (
    <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 shadow-glass-sm">
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-light-primary dark:text-dark-primary" />
        Performance & Optimization
      </h3>
      <div className="space-y-4">
        {Object.entries(settings.performance).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-light-text dark:text-dark-text capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {key === 'autoRefresh' ? 'Automatically refresh data periodically' :
                 key === 'cacheData' ? 'Cache data for faster loading' :
                 'Enable low power mode for better battery life'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={(e) => handleSettingChange('performance', key, e.target.checked)}
              />
              <div className="w-11 h-6 bg-light-bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-light-primary/20 rounded-full peer dark:bg-dark-bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-light-primary"></div>
                              </label>
                            </div>
                          ))}
                    </div>
                  </div>
                );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'display':
        return renderDisplaySettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'performance':
        return renderPerformanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">Admin Settings</h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Customize your experience and manage team preferences
                </p>
              </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-gradient text-white shadow-glass-sm'
                  : 'bg-light-bg-secondary text-light-text hover:bg-light-bg-secondary/80 dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
                </div>
                
      {/* Tab Content */}
      <div className="mb-8">
        {renderTabContent()}
                </div>
                
      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-light-bg-secondary text-light-text rounded-lg hover:bg-light-bg-secondary/80 transition-colors dark:bg-dark-bg-secondary dark:text-dark-text dark:hover:bg-dark-bg-secondary/80"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
            </div>
    </div>
  );
};

export default AdminSettings;