import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaSearch, 
  FaCalendarAlt, 
  FaSignOutAlt,
  FaUser 
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('customerData');
    navigate('/userLogin');
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-4 flex items-center space-x-3 border-b border-gray-700">
        <FaUser className="text-xl" />
        <span className="font-semibold">Customer Dashboard</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link 
          to="/user/dashboard" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaHome className="text-lg" />
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/user/visit_houses" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaSearch className="text-lg" />
          <span>View Houses</span>
        </Link>

        <Link 
          to="/user/my_bookings" 
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaCalendarAlt className="text-lg" />
          <span>My Bookings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;