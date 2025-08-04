import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
 FaHome, 
 FaHouseUser, 
 FaCalendarAlt, 
 FaSignOutAlt,
 FaBars,
 FaTimes 
} from 'react-icons/fa';

const Sidebar = ({isOpen, setIsOpen}) => {
  const toggleSidebar = () => setIsOpen(!isOpen);
// const [isOpen, setIsOpen] = useState(true);
 const [activeItem, setActiveItem] = useState('dashboard');
 const navigate = useNavigate();

 

 const handleLogout = () => {
   // Add your logout logic here
   localStorage.removeItem('ownerToken');
   navigate('/login');
 };

 const menuItems = [
   { name: 'dashboard', label: 'Dashboard', icon: <FaHome className="text-lg" />, path: '/owner/dashboard' },
   { name: 'my-houses', label: 'My Houses', icon: <FaHouseUser className="text-lg" />, path: '/owner/my_houses' },
   { name: 'bookings', label: 'Bookings', icon: <FaCalendarAlt className="text-lg" />, path: '/owner/booked_rooms' },
 ];

 return (
   <div className={`
  fixed left-0 top-0 h-screen
  ${isOpen ? 'w-60' : 'w-16'}
  bg-white border-r border-gray-200 shadow-sm
  transition-all duration-300 ease-in-out
  z-50 flex flex-col
`}>
     {/* Toggle Button */}
     <div 
       className="flex justify-end p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
       onClick={toggleSidebar}
     >
       {isOpen ? <FaTimes className="text-lg text-gray-600" /> : <FaBars className="text-lg text-gray-600" />}
     </div>
     
     {/* Header */}
     <div className="px-4 py-5 border-b border-gray-100">
       {isOpen && <h3 className="text-lg font-medium text-gray-800">Owner Panel</h3>}
     </div>
     
     {/* Menu Items */}
     <ul className="flex-1 py-2">
       {menuItems.map((item) => (
         <li 
           key={item.name}
           className={`
             mx-3 my-1 rounded-lg
             ${activeItem === item.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}
             transition-all duration-200
           `}
           onClick={() => setActiveItem(item.name)}
         >
           <Link 
             to={item.path}
             className="flex items-center px-3 py-2.5"
           >
             <span className={`flex-shrink-0 ${activeItem === item.name ? 'text-blue-600' : 'text-gray-500'}`}>
               {item.icon}
             </span>
             {isOpen && (
               <span className={`ml-3 text-sm font-medium ${activeItem === item.name ? 'text-blue-600' : 'text-gray-700'}`}>
                 {item.label}
               </span>
             )}
           </Link>
         </li>
       ))}
     </ul>
     
     {/* Footer with Logout */}
     <div className="p-3 border-t border-gray-100">
       <button 
         className="w-full flex items-center px-3 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-gray-500"
         onClick={handleLogout}
       >
         <FaSignOutAlt className="text-lg" />
         {isOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
       </button>
     </div>
   </div>
 );
};

export default Sidebar;