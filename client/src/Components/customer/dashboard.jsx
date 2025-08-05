import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Briefcase, 
  Check, X, Settings, Search, 
  Plus, Filter, Home, Info
} from 'lucide-react';
import axios from 'axios';
import EditProfile from './EditProfile';

const Dashboard = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('current');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('customerData'));
    setCustomerData(data);
    
    if (!data) {
      navigate('/user/login');
    }
  }, [navigate]);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!customerData?.user_id) return;

        const response = await axios.get(
          `http://localhost:5000/api/user/${customerData.user_id}/booked_rooms`,
          {
            params: { filter },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setBookings(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [customerData, filter, activeTab]);

  // Fetch booking history
  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        setHistoryLoading(true);
        setError(null);
        
        if (!customerData?.user_id) return;

        const response = await axios.get(
          `http://localhost:5000/api/user/${customerData.user_id}/bookings/history`,
          {
            params: { filter: historyFilter },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setBookingHistory(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch booking history');
      } finally {
        setHistoryLoading(false);
      }
    };

    if (activeTab === 'history') {
      fetchBookingHistory();
    }
  }, [customerData, historyFilter, activeTab]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : 'N/A';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} /> },
      confirmed: { color: 'bg-green-100 text-green-800', icon: <Check size={14} /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <X size={14} /> },
      completed: { color: 'bg-blue-100 text-blue-800', icon: <Info size={14} /> }
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMap[status]?.color || 'bg-gray-100 text-gray-800'}`}>
        {statusMap[status]?.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredBookings = bookings.filter(booking => 
    booking.room_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.house_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.house_location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfileUpdate = (updatedData) => {
    setCustomerData(updatedData);
  };

  const BookingCard = ({ booking }) => (
    <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
              <img
                src={booking.room_picture 
                  ? `http://localhost:5000/uploads/rooms/${booking.room_picture}`
                  : booking.house_img
                    ? `http://localhost:5000/uploads/houses/${booking.house_img}`
                    : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={booking.room_name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  e.target.className = 'h-full w-full object-contain p-2 bg-gray-100';
                }}
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {booking.room_name} in {booking.house_name}
              </div>
              <div className="text-sm text-gray-500 flex items-center mt-1">
                <MapPin size={14} className="mr-1" />
                {booking.house_location}
              </div>
            </div>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0 flex">
          {getStatusBadge(booking.booking_status)}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-gray-400">
            <Calendar size={16} />
          </div>
          <div className="ml-3 text-sm text-gray-500">
            <p className="font-medium">Check-in</p>
            <p>
              {formatDate(booking.from_date)} at {formatTime(booking.from_time)}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-gray-400">
            <Calendar size={16} />
          </div>
          <div className="ml-3 text-sm text-gray-500">
            <p className="font-medium">Check-out</p>
            <p>
              {formatDate(booking.to_date)} at {formatTime(booking.to_time)}
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-gray-400">
            <Briefcase size={16} />
          </div>
          <div className="ml-3 text-sm text-gray-500">
            <p className="font-medium">Occupation</p>
            <p>{booking.user_job_occupation}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => navigate(`/user/visit_rooms/${booking.house_id}`)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View House
        </button>
        {booking.booking_status === 'pending' && (
          <button
            onClick={() => console.log('Cancel booking', booking.booking_id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );

  if (!customerData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {customerData.name.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 text-sm font-medium">{customerData.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Booking History
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'account' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Account Settings
            </button>
          </nav>
        </div>

        {activeTab === 'bookings' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">My Bookings</h2>
              <div className="flex space-x-3">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="current">Current</option>
                    <option value="past">Past</option>
                    <option value="all">All</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Filter size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No bookings found</p>
                <button
                  onClick={() => navigate('/user/visit_houses')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus size={16} className="mr-2" />
                  Book a Room
                </button>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {filteredBookings.map(booking => (
                    <li key={booking.booking_id}>
                      <BookingCard booking={booking} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">Booking History</h2>
              <div className="relative">
                <select
                  className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                >
                  <option value="all">All Bookings</option>
                  <option value="current">Active Bookings</option>
                  <option value="past">Past Bookings</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {historyLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            ) : bookingHistory.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No booking history found</p>
                <button
                  onClick={() => navigate('/search')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus size={16} className="mr-2" />
                  Browse Rooms
                </button>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {bookingHistory.map(booking => (
                    <li key={booking.booking_id}>
                      <BookingCard booking={booking} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'account' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customerData.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customerData.email}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Mobile number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customerData.mobile_num}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customerData.location || 'Not specified'}</dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                onClick={() => setShowEditProfile(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Settings size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </main>

      <EditProfile 
        show={showEditProfile} 
        onHide={() => setShowEditProfile(false)} 
        onUpdateSuccess={handleProfileUpdate}
      />
    </div>
  );
};

export default Dashboard;