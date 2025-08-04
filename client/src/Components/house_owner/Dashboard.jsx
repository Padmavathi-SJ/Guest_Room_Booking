import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Check, X } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ownerData, setOwnerData] = useState(null);

  const FALLBACK_IMAGE = '/no-image.svg';

// ... rest remains the same as above
  // Get owner data from localStorage
  useEffect(() => {
    const storedOwnerData = localStorage.getItem('ownerData');
    if (!storedOwnerData) {
      navigate('/owner/login');
      return;
    }

    try {
      const parsedData = JSON.parse(storedOwnerData);
      setOwnerData(parsedData);
    } catch (err) {
      console.error('Error parsing owner data:', err);
      navigate('/owner/login');
    }
  }, [navigate]);

  // Fetch dashboard stats when ownerData is available
  useEffect(() => {
    if (!ownerData?.owner_id) return;

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/owner/${ownerData.owner_id}/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (response.data.status !== true) {
          throw new Error(response.data.message || 'Failed to fetch dashboard stats');
        }

        setStats(response.data.data);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [ownerData]);

  const handleLogout = () => {
    localStorage.removeItem('ownerData');
    localStorage.removeItem('token');
    navigate('/login');
  };



  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-4 text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-6xl mx-auto">
      {/* Header with owner info and logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {ownerData?.name || 'Owner'}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Houses Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Houses</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.total_houses || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Rooms Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.total_rooms || 0}</p>
            </div>
          </div>
        </div>

        {/* Active Bookings Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.active_bookings || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{(stats?.total_earnings || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pending Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Pending Bookings</h2>
          {stats?.recent_bookings?.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_bookings.map((booking) => (
                <div key={booking.booking_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
    <img
      src={
        booking.room_picture
          ? `http://localhost:5000/uploads/rooms/${booking.room_picture}`
          : FALLBACK_IMAGE
      }
      alt={booking.room_name}
      className="h-full w-full object-cover"
      onError={(e) => {
        e.target.src = FALLBACK_IMAGE;
        e.target.className = 'h-full w-full object-contain p-2 bg-gray-100';
      }}
    />
  </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{booking.room_name}</h3>
                        <p className="text-sm text-gray-500">{booking.house_name}</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {booking.house_location}
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(booking.from_date)} - {formatDate(booking.to_date)}
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.from_time?.substring(0, 5)} - {booking.to_time?.substring(0, 5)}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                 

                   
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending bookings found</p>
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Overview</h2>
          <div className="text-gray-500 text-center py-8">
            <p>Revenue chart will appear here</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;