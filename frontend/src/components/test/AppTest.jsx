import React from 'react';

const AppTest = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Test</h1>
      <p className="text-gray-600 mb-4">This is a simple test component to verify the application is working.</p>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
        <p>✅ Application is running successfully!</p>
      </div>
    </div>
  );
};

export default AppTest;