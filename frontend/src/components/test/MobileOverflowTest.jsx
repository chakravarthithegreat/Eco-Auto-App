import React from 'react';
import { Card } from '../ui/Card';

const MobileOverflowTest = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-6">Mobile Overflow Test</h1>
      
      {/* Test 1: Long text that might overflow */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Test 1: Long Text</h3>
        <p className="text-sm text-gray-600">
          This is a very long text that should wrap properly on mobile devices without causing horizontal overflow. 
          It contains many words and should test the text wrapping functionality to ensure content doesn't exceed the viewport width.
        </p>
      </Card>

      {/* Test 2: Wide table */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Test 2: Wide Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">John Doe</td>
                <td className="p-2 border">john@example.com</td>
                <td className="p-2 border">Engineering</td>
                <td className="p-2 border">Developer</td>
                <td className="p-2 border">Active</td>
              </tr>
              <tr>
                <td className="p-2 border">Jane Smith</td>
                <td className="p-2 border">jane@example.com</td>
                <td className="p-2 border">Marketing</td>
                <td className="p-2 border">Manager</td>
                <td className="p-2 border">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Test 3: Flex container with many items */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Test 3: Flex Container</h3>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm whitespace-nowrap">
              Tag {i + 1}
            </div>
          ))}
        </div>
      </Card>

      {/* Test 4: Grid layout */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Test 4: Grid Layout</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-lg text-center">
              Grid Item {i + 1}
            </div>
          ))}
        </div>
      </Card>

      {/* Test 5: Long button text */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Test 5: Long Button Text</h3>
        <div className="space-y-2">
          <button className="w-full p-3 bg-blue-500 text-white rounded-lg">
            This is a very long button text that should wrap properly on mobile devices
          </button>
          <button className="w-full p-3 bg-green-500 text-white rounded-lg">
            Another long button with different content that tests text wrapping
          </button>
        </div>
      </Card>

      {/* Test 6: Navigation pills (similar to desktop nav) */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Test 6: Navigation Pills</h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['Dashboard', 'Tasks', 'Analytics', 'Employees', 'Settings', 'Reports', 'Notifications'].map((item, i) => (
            <button
              key={i}
              className="flex-shrink-0 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm whitespace-nowrap"
            >
              {item}
            </button>
          ))}
        </div>
      </Card>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>✅ If you can see this message without horizontal scrolling on mobile, the overflow fixes are working!</p>
        <p className="mt-2">Try resizing your browser window to test different screen sizes.</p>
      </div>
    </div>
  );
};

export default MobileOverflowTest;
