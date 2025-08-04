import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Home, MapPin } from 'lucide-react';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_num: '',
    permanent_address: '',
    temp_address: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        const ownerData = JSON.parse(localStorage.getItem('ownerData'));
        if (!ownerData || !ownerData.owner_id) {
          throw new Error('Owner not authenticated');
        }

        const response = await axios.get(
          `http://localhost:5000/api/owner/${ownerData.owner_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        setFormData({
          name: response.data.data.name,
          email: response.data.data.email,
          mobile_num: response.data.data.mobile_num,
          permanent_address: response.data.data.permanent_address,
          temp_address: response.data.data.temp_address || '',
          city: response.data.data.city,
          state: response.data.data.state
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch owner details');
        toast.error('Failed to load profile data');
        setLoading(false);
        if (err.message === 'Owner not authenticated') {
          navigate('/owner/login');
        }
      }
    };

    fetchOwnerDetails();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const ownerData = JSON.parse(localStorage.getItem('ownerData'));
      if (!ownerData || !ownerData.owner_id) {
        throw new Error('Owner not authenticated');
      }

      const response = await axios.put(
        `http://localhost:5000/api/owner/update/${ownerData.owner_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const updatedOwnerData = {
        ...ownerData,
        name: formData.name,
        email: formData.email,
        mobile_num: formData.mobile_num
      };
      localStorage.setItem('ownerData', JSON.stringify(updatedOwnerData));

      toast.success('Profile updated successfully');
      navigate('/owner/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (errorMessage === 'Owner not authenticated') {
        navigate('/owner/login');
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Edit Profile Information</h2>
            <button 
              onClick={() => navigate('/owner/dashboard')}
              className="text-white hover:text-blue-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Mobile Number Field */}
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile_num"
                  value={formData.mobile_num}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* City Field */}
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* State Field */}
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Permanent Address Field */}
            <div className="flex flex-col">
              <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                <Home className="h-4 w-4 mr-2 text-blue-600" />
                Permanent Address
              </label>
              <textarea
                name="permanent_address"
                value={formData.permanent_address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                required
              />
            </div>

            {/* Temporary Address Field */}
            <div className="flex flex-col">
              <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                <Home className="h-4 w-4 mr-2 text-blue-600" />
                Temporary Address (Optional)
              </label>
              <textarea
                name="temp_address"
                value={formData.temp_address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/owner/dashboard')}
                disabled={updating}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {updating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;