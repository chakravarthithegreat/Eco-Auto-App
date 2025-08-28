import React from 'react';

const MinimalApp = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Eco-Auto App</h1>
        <p className="text-gray-600 mb-6">Minimal App Test - If you can see this, React is working!</p>
        <div className="flex flex-col space-y-4">
          <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto flex items-center justify-center">
            <span className="text-white text-2xl">E</span>
          </div>
          <p className="text-sm text-gray-500">Eco-Auto Productivity App</p>
        </div>
      </div>
    </div>
  );
};

export default MinimalApp;