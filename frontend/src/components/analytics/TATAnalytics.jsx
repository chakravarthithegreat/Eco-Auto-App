import React, { useState } from 'react';
import { useTATStore } from '../../state/tatStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';

const TATAnalytics = () => {
  const {
    getTATAnalytics,
    getProjectComparison,
    getTeamMemberPerformance,
    performanceTargets
  } = useTATStore();
  
  const [activeView, setActiveView] = useState('overview');
  
  // Get analytics data
  const analytics = getTATAnalytics();
  const projectComparison = getProjectComparison();
  const teamPerformance = getTeamMemberPerformance();
  
  // Get performance color
  const getPerformanceColor = (value, type) => {
    const targets = performanceTargets[type];
    if (!targets) return 'text-surface-600';
    
    if (value >= targets.excellent) return 'text-success-600';
    if (value >= targets.good) return 'text-info-600';
    if (value >= targets.acceptable) return 'text-warning-600';
    return 'text-danger-600';
  };
  
  // Get trend icon
  const getTrendIcon = (value) => {
    if (value > 5) return <TrendingUp className="h-4 w-4 text-success-500" />;
    if (value < -5) return <TrendingDown className="h-4 w-4 text-danger-500" />;
    return <div className="h-4 w-4" />; // Neutral
  };
  
  // Get grade color
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-success-600 bg-success-50 border-success-200';
      case 'B': return 'text-info-600 bg-info-50 border-info-200';
      case 'C': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'F': return 'text-danger-600 bg-danger-50 border-danger-200';
      default: return 'text-surface-600 bg-surface-50 border-surface-200';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-surface-100 p-1 rounded-card">
        <Button
          variant={activeView === 'overview' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('overview')}
          className="flex-1"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeView === 'projects' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('projects')}
          className="flex-1"
        >
          <Target className="h-4 w-4 mr-2" />
          Projects
        </Button>
        <Button
          variant={activeView === 'team' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveView('team')}
          className="flex-1"
        >
          <Users className="h-4 w-4 mr-2" />
          Team Performance
        </Button>
      </div>
      
      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getPerformanceColor(analytics.averageEfficiency, 'efficiency')}`}>
                  {analytics.averageEfficiency}%
                </div>
                <div className="text-sm text-surface-600">Avg Efficiency</div>
                {analytics.trendsData.efficiency !== 0 && (
                  <div className="flex items-center justify-center mt-1">
                    {getTrendIcon(analytics.trendsData.efficiency)}
                    <span className="text-xs ml-1">{analytics.trendsData.efficiency > 0 ? '+' : ''}{analytics.trendsData.efficiency}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-success-500 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getPerformanceColor(analytics.onTimeDeliveryRate, 'onTimeDelivery')}`}>
                  {analytics.onTimeDeliveryRate}%
                </div>
                <div className="text-sm text-surface-600">On-Time Delivery</div>
                {analytics.trendsData.onTime !== 0 && (
                  <div className="flex items-center justify-center mt-1">
                    {getTrendIcon(analytics.trendsData.onTime)}
                    <span className="text-xs ml-1">{analytics.trendsData.onTime > 0 ? '+' : ''}{analytics.trendsData.onTime}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-warning-500 mx-auto mb-2" />
                <div className={`text-2xl font-bold ${getPerformanceColor(analytics.averageQuality, 'quality')}`}>
                  {analytics.averageQuality || '-'}
                </div>
                <div className="text-sm text-surface-600">Avg Quality</div>
                {analytics.trendsData.quality !== 0 && (
                  <div className="flex items-center justify-center mt-1">
                    {getTrendIcon(analytics.trendsData.quality * 10)}
                    <span className="text-xs ml-1">{analytics.trendsData.quality > 0 ? '+' : ''}{analytics.trendsData.quality}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-info-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-info-600">
                  {analytics.completedTasks}
                </div>
                <div className="text-sm text-surface-600">
                  of {analytics.totalTasks} Tasks
                </div>
                <div className="text-xs text-surface-500 mt-1">
                  {analytics.overdueTasks} overdue
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-warning-500" />
                Overall Performance Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`inline-block px-6 py-3 rounded-card border-2 ${
                  analytics.performanceRating === 'excellent' ? 'text-success-600 bg-success-50 border-success-200' :
                  analytics.performanceRating === 'good' ? 'text-info-600 bg-info-50 border-info-200' :
                  analytics.performanceRating === 'acceptable' ? 'text-warning-600 bg-warning-50 border-warning-200' :
                  'text-danger-600 bg-danger-50 border-danger-200'
                }`}>
                  <div className="text-2xl font-bold capitalize">{analytics.performanceRating.replace('_', ' ')}</div>
                </div>
                
                <div className="mt-4 text-sm text-surface-600">
                  Based on efficiency, delivery timeliness, and quality metrics
                </div>
                
                {/* Performance Targets */}
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-700">Efficiency Target</div>
                    <div className="text-lg font-bold text-primary-600">≥ {performanceTargets.efficiency.good}%</div>
                    <div className={`text-sm ${analytics.averageEfficiency >= performanceTargets.efficiency.good ? 'text-success-600' : 'text-danger-600'}`}>
                      {analytics.averageEfficiency >= performanceTargets.efficiency.good ? '✓ Met' : '✗ Not Met'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-700">On-Time Target</div>
                    <div className="text-lg font-bold text-success-600">≥ {performanceTargets.onTimeDelivery.good}%</div>
                    <div className={`text-sm ${analytics.onTimeDeliveryRate >= performanceTargets.onTimeDelivery.good ? 'text-success-600' : 'text-danger-600'}`}>
                      {analytics.onTimeDeliveryRate >= performanceTargets.onTimeDelivery.good ? '✓ Met' : '✗ Not Met'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-700">Quality Target</div>
                    <div className="text-lg font-bold text-warning-600">≥ {performanceTargets.quality.good}</div>
                    <div className={`text-sm ${(analytics.averageQuality || 0) >= performanceTargets.quality.good ? 'text-success-600' : 'text-danger-600'}`}>
                      {(analytics.averageQuality || 0) >= performanceTargets.quality.good ? '✓ Met' : '✗ Not Met'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Projects Tab */}
      {activeView === 'projects' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-500" />
              Project Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectComparison.length > 0 ? (
                projectComparison.map((project) => (
                  <div key={project.projectId} className="flex items-center justify-between p-4 bg-surface-50 rounded-card">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{project.projectName}</div>
                      <div className="text-sm text-surface-600 mt-1">
                        {project.completedTasks}/{project.totalTasks} tasks completed • {project.totalActualHours}h spent
                      </div>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className={getPerformanceColor(project.averageEfficiency, 'efficiency')}>
                          Efficiency: {project.averageEfficiency}%
                        </span>
                        <span className={getPerformanceColor(project.onTimeDeliveryRate, 'onTimeDelivery')}>
                          On-Time: {project.onTimeDeliveryRate}%
                        </span>
                        <span className={getPerformanceColor(project.averageQuality, 'quality')}>
                          Quality: {project.averageQuality || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          project.status === 'excellent' ? 'success' :
                          project.status === 'on_track' ? 'primary' :
                          project.status === 'needs_attention' ? 'warning' : 'danger'
                        }
                        size="sm"
                      >
                        {project.status.replace('_', ' ')}
                      </Badge>
                      
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getGradeColor(project.performanceGrade)}`}>
                        {project.performanceGrade}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-surface-500">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No project data available</p>
                  <p className="text-sm">Complete some tasks to see project analytics</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Team Performance Tab */}
      {activeView === 'team' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent-500" />
              Team Member Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamPerformance.length > 0 ? (
                teamPerformance.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-card">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-surface-100 text-surface-800'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div>
                        <div className="font-medium text-slate-900">{member.name}</div>
                        <div className="text-sm text-surface-600">
                          {member.completedTasks}/{member.totalTasks} tasks completed
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-6 text-center">
                      <div>
                        <div className={`text-lg font-bold ${getPerformanceColor(member.averageEfficiency, 'efficiency')}`}>
                          {member.averageEfficiency}%
                        </div>
                        <div className="text-xs text-surface-600">Efficiency</div>
                      </div>
                      
                      <div>
                        <div className={`text-lg font-bold ${getPerformanceColor(member.onTimeRate, 'onTimeDelivery')}`}>
                          {member.onTimeRate}%
                        </div>
                        <div className="text-xs text-surface-600">On-Time</div>
                      </div>
                      
                      <div>
                        <div className={`text-lg font-bold ${getPerformanceColor(member.averageQuality, 'quality')}`}>
                          {member.averageQuality || '-'}
                        </div>
                        <div className="text-xs text-surface-600">Quality</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-surface-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No team performance data available</p>
                  <p className="text-sm">Complete some tasks to see team analytics</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TATAnalytics;