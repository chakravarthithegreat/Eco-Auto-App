import React from 'react';

function App_Test() {
  console.log('App_Test component rendering...');
  
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Eco-Auto App Test</h1>
        <p className="text-gray-700 mb-4">If you can see this, the basic React setup is working.</p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>✅ React is rendering</p>
          <p>✅ Tailwind CSS is working</p>
          <p>✅ Basic styling is applied</p>
        </div>
        <button 
          onClick={() => alert('Button click works!')}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App_Test;

