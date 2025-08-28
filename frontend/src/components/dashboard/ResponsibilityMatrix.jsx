import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../state/authStore';
import useRoleManagementStore from '../../state/roleManagementStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import {
  Users,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/Button';

const ResponsibilityMatrix = () => {
  const { responsibilities: authResponsibilities, subResponsibilities: authSubResponsibilities, getUsersByResponsibility, getUsersBySubResponsibility } = useAuthStore();
  const {
    roles,
    responsibilities: roleResponsibilities,
    subResponsibilities: roleSubResponsibilities,
    error: roleError
  } = useRoleManagementStore();

  const [viewMode, setViewMode] = useState('heatmap'); // heatmap or detailed
  const [dataSource, setDataSource] = useState('auto'); // auto, auth, or role

  // Mock capacity data for users
  const userCapacityData = {
    '1': { capacity: 40, currentLoad: 25, utilization: 63 },
    '2': { capacity: 40, currentLoad: 35, utilization: 88 },
    '3': { capacity: 40, currentLoad: 20, utilization: 50 }
  };

  // Determine which data source to use
  const getDataSource = () => {
    if (dataSource === 'auth') return { responsibilities: authResponsibilities, subResponsibilities: authSubResponsibilities };
    if (dataSource === 'role') return { responsibilities: roleResponsibilities, subResponsibilities: roleSubResponsibilities };

    // Auto mode: prefer role management data if available and valid
    if (Array.isArray(roleResponsibilities) && roleResponsibilities.length > 0 && !roleError) {
      return { responsibilities: roleResponsibilities, subResponsibilities: roleSubResponsibilities };
    }

    // Fallback to auth store data
    return { responsibilities: authResponsibilities, subResponsibilities: authSubResponsibilities };
  };

  const { responsibilities, subResponsibilities } = getDataSource();

  // Safe data access with fallbacks
  const safeResponsibilities = Array.isArray(responsibilities) ? responsibilities : [];
  const safeSubResponsibilities = Array.isArray(subResponsibilities) ? subResponsibilities : [];

  // Get coverage data for responsibilities
  const getResponsibilityCoverage = () => {
    try {
      return safeResponsibilities.map(responsibility => {
        // Use auth store user data as it's more reliable for user assignments
        const users = getUsersByResponsibility ? getUsersByResponsibility(responsibility.id) || [] : [];
        const subResp = safeSubResponsibilities.filter(sr => sr.responsibilityId === responsibility.id);

        // Get coverage for sub-responsibilities
        const subCoverage = subResp.map(sub => {
          const subUsers = getUsersBySubResponsibility ? getUsersBySubResponsibility(sub.id) || [] : [];
          return {
            ...sub,
            users: subUsers,
            coverage: subUsers.length,
            capacity: subUsers.reduce((sum, user) => sum + (userCapacityData[user.id]?.capacity || 0), 0),
            load: subUsers.reduce((sum, user) => sum + (userCapacityData[user.id]?.currentLoad || 0), 0)
          };
        });

        return {
          ...responsibility,
          users,
          coverage: users.length,
          subResponsibilities: subCoverage,
          capacity: users.reduce((sum, user) => sum + (userCapacityData[user.id]?.capacity || 0), 0),
          load: users.reduce((sum, user) => sum + (userCapacityData[user.id]?.currentLoad || 0), 0)
        };
      });
    } catch (error) {
      console.error('Error calculating responsibility coverage:', error);
      return [];
    }
  };

  const coverageData = getResponsibilityCoverage() || [];

  // Get heatmap color based on coverage
  const getHeatmapColor = (coverage, maxCoverage = 5) => {
    if (coverage === 0) return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
    if (coverage === 1) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
    if (coverage >= maxCoverage) return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
    return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
  };

  // Get utilization color
  const getUtilizationColor = (utilization) => {
    if (utilization > 90) return 'text-red-600 dark:text-red-400';
    if (utilization > 75) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Responsibility Matrix</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Data Source: {dataSource === 'auto' ? 'Auto (Dynamic)' : dataSource === 'role' ? 'Role Management' : 'Auth Store'}
            {roleError && <span className="text-red-500 ml-2">⚠️ Role data has errors</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Data Source Selector */}
          <div className="flex gap-1">
            <Button
              variant={dataSource === 'auto' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDataSource('auto')}
              title="Automatically choose best data source"
            >
              Auto
            </Button>
            <Button
              variant={dataSource === 'role' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDataSource('role')}
              title="Use role management data"
              disabled={roleError}
            >
              Role
            </Button>
            <Button
              variant={dataSource === 'auth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDataSource('auth')}
              title="Use auth store data"
            >
              Auth
            </Button>
          </div>

          {/* View Mode Selector */}
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'heatmap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('heatmap')}
            >
              Heatmap View
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
            >
              Detailed View
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'heatmap' ? (
        <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Coverage Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Responsibility</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Coverage</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Capacity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Load</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {(!Array.isArray(coverageData) || coverageData.length === 0) ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          {!Array.isArray(coverageData) ? 'Loading responsibility data...' : 'No responsibility data available'}
                        </p>
                        {roleError && (
                          <p className="text-red-500 text-sm mt-2">
                            ⚠️ Role management data has errors. Using fallback data.
                          </p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    coverageData.map((responsibility) => (
                      <tr key={responsibility?.id || 'unknown'} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{responsibility?.name || 'Unnamed Responsibility'}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{responsibility?.description || 'No description'}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getHeatmapColor(responsibility?.coverage || 0)}`}>
                            <Users className="w-3 h-3" />
                            <span>{responsibility?.coverage || 0} users</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-slate-700 dark:text-slate-300">
                            {responsibility?.capacity || 0} hrs/wk
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-slate-700 dark:text-slate-300">
                            {responsibility?.load || 0} hrs/wk
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center gap-1 text-sm font-medium ${getUtilizationColor(((responsibility?.load || 0) / (responsibility?.capacity || 1)) * 100)}`}>
                          <TrendingUp className="w-4 h-4" />
                          <span>{Math.round(((responsibility?.load || 0) / (responsibility?.capacity || 1)) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {(!Array.isArray(coverageData) || coverageData.length === 0) ? (
            <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {!Array.isArray(coverageData) ? 'Loading responsibility data...' : 'No responsibility data available'}
                </p>
                {roleError && (
                  <p className="text-red-500 text-sm mt-2">
                    ⚠️ Role management data has errors. Using fallback data.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            coverageData.map((responsibility) => (
              <Card key={responsibility?.id || 'unknown'} className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                        {(responsibility?.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{responsibility?.name || 'Unnamed Responsibility'}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{responsibility?.description || 'No description'}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getHeatmapColor(responsibility?.coverage || 0)}`}>
                    <Users className="w-3 h-3" />
                    <span>{responsibility?.coverage || 0} users</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Capacity</span>
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {responsibility?.capacity || 0} hrs/wk
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Load</span>
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {responsibility?.load || 0} hrs/wk
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Utilization</span>
                      </div>
                      <div className={`text-lg font-bold ${getUtilizationColor(((responsibility?.load || 0) / (responsibility?.capacity || 1)) * 100)}`}>
                        {Math.round(((responsibility?.load || 0) / (responsibility?.capacity || 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Sub-Responsibilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Array.isArray(responsibility?.subResponsibilities) && responsibility.subResponsibilities.map((sub) => (
                        <div
                          key={sub?.id || 'unknown'}
                          className={`border rounded-lg p-3 ${getHeatmapColor(sub?.coverage || 0)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-slate-900 dark:text-white text-sm">
                              {sub?.name || 'Unnamed Sub-Responsibility'}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Users className="w-3 h-3" />
                              <span>{sub?.coverage || 0}</span>
                            </div>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {sub?.description || 'No description'}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              Skill: {sub?.skillLevel || 'N/A'}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              Capacity: {sub?.capacity || 0} hrs
                            </div>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-4 text-gray-500">
                          No sub-responsibilities yet
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Assigned Users</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(responsibility?.users) && responsibility.users.map((user) => (
                        <div
                          key={user?.id || 'unknown'}
                          className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1.5"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-green to-accent-blue flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {(user?.name || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-slate-900 dark:text-white">
                            {user?.name || 'Unknown User'}
                          </div>
                          <div className={`text-xs font-medium ${getUtilizationColor(userCapacityData[user?.id]?.utilization || 0)}`}>
                            {userCapacityData[user?.id]?.utilization || 0}%
                          </div>
                        </div>
                      )) || (
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">No users assigned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ResponsibilityMatrix;