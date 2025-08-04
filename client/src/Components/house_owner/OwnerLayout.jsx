import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const OwnerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div>
      {/* Fixed Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content shifts based on Sidebar width */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-60' : 'ml-16'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default OwnerLayout;
