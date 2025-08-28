import React from 'react';
import PomodoroTimer from './PomodoroTimer';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Timer, Target, Coffee, BarChart3, Zap, Award, TrendingUp, BookOpen } from 'lucide-react';

const PomodoroPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-900 flex items-center gap-3">
          <Timer className="h-8 w-8 text-primary-500" />
          Pomodoro Timer
        </h1>
        <p className="text-surface-600 mt-1">
          Boost your productivity with focused work sessions
        </p>
      </div>
      
      {/* Enhanced How it Works */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-primary-500">
          <CardContent className="p-5 text-center">
            <div className="p-3 bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-2">Focus Session</h3>
            <p className="text-sm text-surface-600">
              Work on a single task for 25 minutes with complete focus
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-accent-500">
          <CardContent className="p-5 text-center">
            <div className="p-3 bg-accent-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Coffee className="h-6 w-6 text-accent-600" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-2">Short Break</h3>
            <p className="text-sm text-surface-600">
              Take a 5-minute break after each work session
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-success-500">
          <CardContent className="p-5 text-center">
            <div className="p-3 bg-success-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-2">Track Progress</h3>
            <p className="text-sm text-surface-600">
              Monitor your productivity and focus time daily
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Productivity Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Why Pomodoro Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg mt-1">
                <Award className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-surface-900">Improved Focus</h4>
                <p className="text-sm text-surface-600 mt-1">
                  Short, focused work sessions help maintain concentration and prevent mental fatigue.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg mt-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-surface-900">Better Time Management</h4>
                <p className="text-sm text-surface-600 mt-1">
                  Breaking work into intervals helps you understand how much time tasks actually take.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg mt-1">
                <Target className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-surface-900">Reduced Procrastination</h4>
                <p className="text-sm text-surface-600 mt-1">
                  Starting with just 25 minutes makes it easier to begin tasks you've been avoiding.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg mt-1">
                <BookOpen className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-surface-900">Enhanced Learning</h4>
                <p className="text-sm text-surface-600 mt-1">
                  Regular breaks improve information retention and creative problem-solving.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Timer Component */}
      <PomodoroTimer />
    </div>
  );
};

export default PomodoroPage;