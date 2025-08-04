import React from 'react';
import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
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

export default CustomerLayout;