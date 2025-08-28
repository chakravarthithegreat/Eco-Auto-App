import React from 'react';
import { Card, CardContent } from './Card';
import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton variant="text" className="w-1/3 h-8 mb-2" />
          <Skeleton variant="text" className="w-1/2 h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rectangular" className="w-24 h-10 rounded-xl" />
          <Skeleton variant="rectangular" className="w-10 h-10 rounded-xl" />
        </div>
      </div>

      {/* Stats Cards Skeleton - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton variant="circular" className="w-10 h-10" />
                <Skeleton variant="text" className="w-16 h-4" />
              </div>
              <Skeleton variant="text" className="w-3/4 h-6 mb-2" />
              <Skeleton variant="text" className="w-1/2 h-4" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4">
        {/* Row with 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="md:col-span-1">
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center mb-4">
                    <Skeleton variant="circular" className="w-10 h-10 mr-3" />
                    <Skeleton variant="text" className="w-1/2 h-5" />
                  </div>
                  <Skeleton variant="text" className="w-3/4 h-8 mb-4" />
                  <div className="grid grid-cols-10 gap-1 mb-4">
                    {[...Array(30)].map((_, dotIndex) => (
                      <Skeleton 
                        key={dotIndex} 
                        variant="circular" 
                        className="w-2 h-2" 
                      />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Skeleton variant="text" className="w-16 h-3" />
                    <Skeleton variant="text" className="w-16 h-3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Row with 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="md:col-span-1">
              <Card className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton variant="text" className="w-1/3 h-5" />
                    <Skeleton variant="circular" className="w-6 h-6" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton variant="text" className="w-1/4 h-4" />
                      <Skeleton variant="text" className="w-1/4 h-4" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton variant="text" className="w-1/4 h-4" />
                      <Skeleton variant="text" className="w-1/4 h-4" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton variant="text" className="w-1/4 h-4" />
                      <Skeleton variant="text" className="w-1/4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;