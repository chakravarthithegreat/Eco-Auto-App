import React, { useState } from 'react';
import { useRoadmapStore } from '../../state/roadmapStore';
import { 
  Route, 
  Play, 
  Settings, 
  ArrowRight, 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Eye, 
  MoreVertical, 
  Clock, 
  Users, 
  Trash2, 
  X 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const RoadmapManager = () => {
  const { roadmaps } = useRoadmapStore();
  
  return (
    <div className="container-mobile space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-mobile-1">Roadmap Manager</h1>
          <p className="text-surface-600 text-sm sm:text-base">Create and manage workflow templates for your projects</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Roadmaps</h2>
        <p>Total roadmaps: {roadmaps.length}</p>
      </div>
    </div>
  );
};

export default RoadmapManager;
