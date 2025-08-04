import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Home, MapPin, Briefcase, Check, X, Clock as HistoryIcon } from 'lucide-react';
import axios from 'axios';


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('current');
  const navigate = useNavigate();

  // Get user data from localStorage (matching CustomerAuth format)
  const getCustomerData = () => {
    const customerData = localStorage.getItem('customerData');
    return customerData ? JSON.parse(customerData) : null;
  };

  const customerData = getCustomerData();
  const user_id = customerData?.user_id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user_id) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/user/${user_id}/booked_rooms`,
          {
            params: { filter },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.status) {
          setBookings(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user_id, filter]);

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
      completed: { color: 'bg-blue-100 text-blue-800', icon: <Check size={14} /> }
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMap[status]?.color || 'bg-gray-100 text-gray-800'}`}>
        {statusMap[status]?.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };


  // Redirect to login if no user data
  if (!customerData) {
    navigate('/user/login');
    return null;
  }

return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      {/* Welcome message */}
      <div className="mb-4 text-gray-600">
        Welcome back, <span className="font-semibold">{customerData.name}</span>
      </div>
      
      {/* Filter Tabs with clear status indicators */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setFilter('current')}
          className={`px-4 py-2 font-medium text-sm ${filter === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <Home size={16} />
            Current Bookings
          </div>
          <div className="text-xs mt-1">(Pending & Confirmed only)</div>
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 font-medium text-sm ${filter === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <HistoryIcon size={16} />
            Past Bookings
          </div>
          <div className="text-xs mt-1">(Completed & Cancelled only)</div>
        </button>
      </div>

      {/* Status summary */}
      {!loading && !error && (
        <div className="mb-4 text-sm text-gray-600">
          {filter === 'current' ? (
            <span>Showing all pending and confirmed bookings</span>
          ) : (
            <span>Showing your booking history (completed and cancelled)</span>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-6 rounded-lg text-center">
              {filter === 'current' 
                ? "You don't have any current bookings."
                : "You don't have any past bookings."}
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.booking_id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="md:flex">
                  {/* House/Room Image */}
                  <div className="md:w-1/3 h-48 bg-gray-100 overflow-hidden relative">
                    <img
                      src={booking.room_picture 
                        ? `http://localhost:5000/uploads/rooms/${booking.room_picture}`
                        : booking.house_img
                          ? `http://localhost:5000/uploads/houses/${booking.house_img}`
                          : 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={booking.room_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        e.target.className = 'w-full h-full object-contain p-4 bg-gray-100';
                      }}
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold">
                        {booking.room_name} in {booking.house_name}
                      </h2>
                      {getStatusBadge(booking.booking_status)}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center text-gray-600 mb-1">
                        <MapPin size={16} className="mr-2" />
                        <span>{booking.house_location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase size={16} className="mr-2" />
                        <span>Occupation: {booking.user_job_occupation}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center text-gray-700 mb-1">
                          <Calendar size={16} className="mr-2" />
                          <span className="font-medium">Check-in</span>
                        </div>
                        <div>
                          <span>{formatDate(booking.from_date)}</span>
                          {booking.from_time && (
                            <span className="ml-2">{formatTime(booking.from_time)}</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center text-gray-700 mb-1">
                          <Calendar size={16} className="mr-2" />
                          <span className="font-medium">Check-out</span>
                        </div>
                        <div>
                          <span>{formatDate(booking.to_date)}</span>
                          {booking.to_time && (
                            <span className="ml-2">{formatTime(booking.to_time)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;