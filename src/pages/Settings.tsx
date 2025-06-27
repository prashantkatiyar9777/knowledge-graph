import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
          <p className="text-gray-500">
            Configure your application settings here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;