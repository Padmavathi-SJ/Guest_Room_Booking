import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import

const OwnerAuth = () => {
    const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile_num: '',
    permanent_address: '',
    city: '',
    state: ''
  });
  const [popup, setPopup] = useState({ show: false, message: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const showMessage = (message, isError = false) => {
     console.log('Showing message:', { message, isError });
    // Clear any existing timeout
    if (timeoutId) clearTimeout(timeoutId);
    
    // Show new message
    setPopup({ show: true, message, isError });
    
    // Set timeout to hide message
    const id = setTimeout(() => {
      setPopup(prev => ({ ...prev, show: false }));
    }, 3000);
    
    setTimeoutId(id);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/owner/register', data);
      return response.data;
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

const handleLogin = async (email, password, mobile_num) => {
  try {
    setIsLoading(true);
    const response = await axios.post('http://localhost:5000/api/owner/login', { 
      email, 
      password, 
      mobile_num 
    });
    
    // Store owner data including owner_id in localStorage
    if (response.data.owner) {
      localStorage.setItem('ownerData', JSON.stringify({
        owner_id: response.data.owner.owner_id,
        name: response.data.owner.name,
        email: response.data.owner.email,
        mobile_num: response.data.owner.mobile_num
      }));
    }
    
    return response.data;
  } catch (error) {
    let errorMessage = 'Login failed';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    throw new Error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Login logic
        const { email, password, mobile_num } = formData;
        const owner = await handleLogin(email, password, mobile_num);
        showMessage(`Welcome back, ${owner.name}!`);
        navigate('/owner/dashboard');
        // Here you would typically redirect or set user in context/state
      } else {
        // Registration logic
        const result = await handleRegister(formData);
        showMessage(`Registration successful! Your ID: ${result.ownerId}`);
        setIsLogin(true); // Switch to login after registration
      }
    } catch (error) {
      showMessage(error.message || 'Something went wrong', true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Improved Popup Notification with animation */}
      {popup.show && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 z-50 ${
          popup.isError 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {popup.message}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">
          {isLogin ? 'Owner Login' : 'Owner Registration'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Permanent Address</label>
                <textarea
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  rows="3"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobile_num"
              value={formData.mobile_num}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            disabled={isLoading}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OwnerAuth;