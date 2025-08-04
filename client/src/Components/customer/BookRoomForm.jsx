import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import axios from 'axios';

const BookRoomForm = ({ room, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    from_date: '',
    to_date: '',
    from_time: '14:00',
    to_time: '12:00',
    user_location: '',
    user_job_occupation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);

useEffect(() => {
  try {
    const storedData = localStorage.getItem('customerData');
    if (!storedData) {
      console.warn('No user data found in localStorage');
      setError('Please login to continue');
      return;
    }

    const data = JSON.parse(storedData);
    
    // Check for required fields - now using user_id instead of id
    if (!data.user_id || !data.name) {
      console.error('User data missing required fields:', data);
      throw new Error('User session expired - please login again');
    }

    setUserData(data);
    if (data.location) {
      setFormData(prev => ({ ...prev, user_location: data.location }));
    }
  } catch (err) {
    console.error('Failed to load user data:', err);
    setError(err.message);
    // Consider redirecting to login page here
  }
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    setError('');
    setSuccess('');

    if (!formData.from_date || !formData.to_date || 
        !formData.from_time || !formData.to_time || 
        !formData.user_location || !formData.user_job_occupation) {
      setError('All fields are required');
      return false;
    }

    const fromDate = new Date(formData.from_date);
    const toDate = new Date(formData.to_date);
    
    if (fromDate > toDate) {
      setError('End date must be after start date');
      return false;
    }

    if (formData.from_date === formData.to_date && formData.from_time >= formData.to_time) {
      setError('End time must be after start time');
      return false;
    }

    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const storedData = localStorage.getItem('customerData');
    if (!storedData) {
      throw new Error('Please login to continue');
    }

    const userData = JSON.parse(storedData);
    if (!userData.user_id || !userData.name) {
      throw new Error('User session expired - please login again');
    }

    const response = await axios.post(
      `http://localhost:5000/api/user/${room.room_id}/book`,
      {
        ...formData,
        user_id: userData.user_id,  // Using user_id now
        user_name: userData.name
      },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status) {
      setSuccess('Room booked successfully!');
      setTimeout(() => onSuccess(), 1500);
    }
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'Booking failed');
  } finally {
    setLoading(false);
  }
};
  const getMinEndDate = () => {
    return formData.from_date || new Date().toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Booking Details</h3>
        <p className="text-sm text-gray-500">Room: {room.room_name}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Check-in Date
          </label>
          <div className="flex items-center border rounded-md p-2">
            <Calendar className="text-gray-500 mr-2" size={16} />
            <input
              type="date"
              name="from_date"
              value={formData.from_date}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Check-out Date
          </label>
          <div className="flex items-center border rounded-md p-2">
            <Calendar className="text-gray-500 mr-2" size={16} />
            <input
              type="date"
              name="to_date"
              value={formData.to_date}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
              min={getMinEndDate()}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Check-in Time
          </label>
          <div className="flex items-center border rounded-md p-2">
            <Clock className="text-gray-500 mr-2" size={16} />
            <input
              type="time"
              name="from_time"
              value={formData.from_time}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Check-out Time
          </label>
          <div className="flex items-center border rounded-md p-2">
            <Clock className="text-gray-500 mr-2" size={16} />
            <input
              type="time"
              name="to_time"
              value={formData.to_time}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Your Current Location
        </label>
        <input
          type="text"
          name="user_location"
          value={formData.user_location}
          onChange={handleChange}
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your current address"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Your Occupation
        </label>
        <input
          type="text"
          name="user_job_occupation"
          value={formData.user_job_occupation}
          onChange={handleChange}
          className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What do you do for work?"
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-800 py-2.5 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </form>
  );
};

export default BookRoomForm;