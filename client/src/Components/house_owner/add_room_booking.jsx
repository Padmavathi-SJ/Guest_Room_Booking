import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddRoomBooking = () => {
  const { room_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  
  const [formData, setFormData] = useState({
    availability: true,
    from_date: '',
    to_date: '',
    from_time: '',
    to_time: '',
    rent_amount_per_day: '',
    minimum_booking_period: 1,
    maximum_booking_period: 30
  });

// When fetching room details, convert the string to boolean for the toggle
useEffect(() => {
  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/owner/rooms/${room_id}/info`
      );
      
      if (response.data.status) {
        setRoomInfo(response.data.data);
        // Set initial availability based on database string
        setFormData(prev => ({
          ...prev,
          availability: response.data.data.availability === 'available'
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch room details');
    } finally {
      setLoading(false);
    }
  };

  fetchRoomDetails();
}, [room_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Convert availability to boolean explicitly
    const submissionData = {
      ...formData,
      availability: Boolean(formData.availability)
    };

    const response = await axios.post(
      `http://localhost:5000/api/owner/rooms/${room_id}/booking`,
      submissionData,  // Use the converted data
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.status) {
      navigate(`/owner/rooms/${roomInfo.house_id}`);
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to add booking details');
  } finally {
    setLoading(false);
  }
};
  if (loading) {
    return <div>Loading room details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!roomInfo) {
    return <div>Room not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        Add Booking Details for Room #{roomInfo.room_id}
      </h2>
         {/* Display non-editable room info */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-500 text-sm">Owner ID</label>
            <div className="text-gray-700">{roomInfo.owner_id}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm">House ID</label>
            <div className="text-gray-700">{roomInfo.house_id}</div>
          </div>
          <div>
            <label className="block text-gray-500 text-sm">Room ID</label>
            <div className="text-gray-700">{roomInfo.room_id}</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Availability Toggle */}
        <div className="mb-4 flex items-center">
          <label className="block text-gray-700 mr-4">Availability</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {formData.availability ? 'Available' : 'Not Available'}
            </span>
          </label>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              name="from_date"
              value={formData.from_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              name="to_date"
              value={formData.to_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">From Time (optional)</label>
            <input
              type="time"
              name="from_time"
              value={formData.from_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">To Time (optional)</label>
            <input
              type="time"
              name="to_time"
              value={formData.to_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rent Amount Per Day (₹)</label>
          <input
            type="number"
            name="rent_amount_per_day"
            value={formData.rent_amount_per_day}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Booking Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Minimum Booking Period (days)</label>
            <input
              type="number"
              name="minimum_booking_period"
              value={formData.minimum_booking_period}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Maximum Booking Period (days)</label>
            <input
              type="number"
              name="maximum_booking_period"
              value={formData.maximum_booking_period}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              min="1"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Add Booking Details'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddRoomBooking;