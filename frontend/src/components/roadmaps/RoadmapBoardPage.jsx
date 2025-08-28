import React from 'react';
import { useParams } from 'react-router-dom';
import RoadmapBoardGame from './RoadmapBoardGame';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowLeft, Settings, Share2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoadmapBoardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/roadmaps');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Roadmaps
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Roadmap Board</h1>
            <p className="text-slate-600 dark:text-slate-400">View and manage project stages</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Roadmap Board */}
      <Card className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle>Roadmap Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <RoadmapBoardGame roadmapId={id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadmapBoardPage;