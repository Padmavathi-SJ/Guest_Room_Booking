import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome, FaMapMarkerAlt, FaCity, FaBed, FaSave, FaTimes } from 'react-icons/fa';

const EditHouse = () => {
  const { house_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    house_name: '',
    total_rooms: '',
    house_location: '',
    city: '',
    state: '',
    availability: 'not available',
    house_img: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch house details
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/houses/get_house/${house_id}`);
        
        if (response.data.status !== true) {
          throw new Error(response.data.message || 'Failed to fetch house details');
        }

        setFormData(response.data.data);
        if (response.data.data.house_img) {
          setPreview(`http://localhost:5000/uploads/houses/${response.data.data.house_img}`);
        }
      } catch (err) {
        console.error('Error fetching house:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load house');
      } finally {
        setLoading(false);
      }
    };

    fetchHouse();
  }, [house_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append the image file if selected
      if (selectedFile) {
        formDataToSend.append('house_img', selectedFile);
      }

      const response = await axios.put(
        `http://localhost:5000/api/houses/edit/${house_id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status !== true) {
        throw new Error(response.data.message || 'Failed to update house');
      }

      setSuccess('House updated successfully!');
      setTimeout(() => navigate('/owner/houses'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update house');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.house_name) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-6">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800 flex items-center justify-center gap-3">
          <FaHome className="text-blue-600" /> Edit House Details
        </h2>
        
        {/* Status Messages */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl shadow-sm">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* House Name */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-700">House Name</label>
            <input
              type="text"
              name="house_name"
              value={formData.house_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              required
            />
          </div>
          
          {/* Total Rooms */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-700">Total Rooms</label>
            <input
              type="number"
              name="total_rooms"
              value={formData.total_rooms}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              required
            />
          </div>
          
          {/* House Location */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-700 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" /> Location
            </label>
            <textarea
              name="house_location"
              value={formData.house_location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-none"
              rows="3"
              required
            />
          </div>
          
          {/* City & State Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-700 flex items-center gap-2">
                <FaCity className="text-blue-500" /> City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                required
              />
            </div>
            
            {/* State */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                required
              />
            </div>
          </div>
          
          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-700">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            >
              <option value="available">Available</option>
              <option value="not available">Not Available</option>
            </select>
          </div>
          
          {/* House Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-700">Update House Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-8 pb-8">
                  <svg className="w-10 h-10 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mb-2 text-sm text-slate-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    PNG, JPG, GIF (MAX. 5MB)
                  </p>
                </div>
                <input 
                  type="file" 
                  name="house_img"
                  onChange={handleFileChange}
                  className="hidden" 
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          
          {/* Image Preview */}
          {(preview || formData.house_img) && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3 text-slate-700">Image Preview:</p>
              <div className="relative group">
                <img 
                  src={preview || `http://localhost:5000/uploads/houses/${formData.house_img}`}
                  alt="House preview" 
                  className="max-w-full h-auto rounded-xl border border-slate-200 shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400/f1f5f9/64748b?text=No+Image+Available';
                    e.target.className = 'max-w-full h-auto rounded-xl border border-slate-200 shadow-md p-8 bg-slate-100';
                  }}
                />
                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreview('');
                      setSelectedFile(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:bg-red-600"
                    title="Remove image"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/owner/houses')}
              className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHouse;