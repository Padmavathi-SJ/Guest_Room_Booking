import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaTimes } from 'react-icons/fa';

const EditProfile = ({ show, onHide, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile_num: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (show) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          setError('');
          setSuccess('');
          
          const customerData = JSON.parse(localStorage.getItem('customerData'));
          
          if (!customerData || !customerData.user_id) {
            throw new Error('User not authenticated');
          }

          // Fetch only user data
          const response = await axios.get(
            `http://localhost:5000/api/user/get_user/${customerData.user_id}`,
            {
              headers: {
                Authorization: `Bearer ${customerData.token}`
              }
            }
          );

          setUser({
            name: response.data.name || '',
            email: response.data.email || '',
            mobile_num: response.data.mobile_num || '',
            password: '',
            confirmPassword: ''
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    setError('');

    if (!user.name || !user.email || !user.mobile_num) {
      setError('Name, email and mobile number are required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      setError('Invalid email format');
      return false;
    }

    if (!/^[0-9]{10,15}$/.test(user.mobile_num)) {
      setError('Mobile number must be 10-15 digits');
      return false;
    }

    if (user.password && user.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (user.password !== user.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setUpdating(true);

    try {
      const customerData = JSON.parse(localStorage.getItem('customerData'));
      const userId = customerData.user_id;

      // Prepare update data - only include allowed fields
      const updateData = {
        name: user.name,
        email: user.email,
        mobile_num: user.mobile_num
      };

      // Only include password if it's being changed
      if (user.password) {
        updateData.password = user.password;
      }

      const response = await axios.put(
        `http://localhost:5000/api/user/edit/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${customerData.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Profile updated successfully');
      
      // Update localStorage with new user data
      const updatedCustomerData = {
        ...customerData,
        name: user.name,
        email: user.email,
        mobile_num: user.mobile_num
      };
      localStorage.setItem('customerData', JSON.stringify(updatedCustomerData));

      // Notify parent component
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedCustomerData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${show ? '' : 'hidden'}`}>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onHide}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-start justify-between p-4 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={onHide}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal body */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="mobile_num"
                      value={user.mobile_num}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10,15}"
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="pl-10 w-full rounded-md border border-gray-300 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onHide}
                    disabled={updating}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;