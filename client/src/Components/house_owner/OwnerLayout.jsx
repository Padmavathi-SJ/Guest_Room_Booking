import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const OwnerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default OwnerLayout;