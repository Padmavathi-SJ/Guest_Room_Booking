import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddHouse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    owner_id: '',
    house_name: '',
    total_rooms: '',
    
    house_location: '',
    city: '',
    state: '',
    availability: 'not available'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setIsLoading(true);
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

      const response = await axios.post('http://localhost:5000/api/owner/add_house', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('House added successfully!');
      setTimeout(() => {
        navigate('/owner/houses');
      }, 1500);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add house';
      setError(errorMsg);
      console.error('Add house error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">Add New House</h2>
        
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
          {/* Owner ID */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-700">Owner ID</label>
            <input
              type="number"
              name="owner_id"
              value={formData.owner_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              required
            />
          </div>
          
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
            <label className="block text-sm font-semibold mb-3 text-slate-700">House Location</label>
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
              <label className="block text-sm font-semibold mb-3 text-slate-700">City</label>
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
            <label className="block text-sm font-semibold mb-3 text-slate-700">House Image</label>
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
          {preview && (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3 text-slate-700">Image Preview:</p>
              <img 
                src={preview} 
                alt="House preview" 
                className="max-w-full h-auto rounded-xl border border-slate-200 shadow-md"
              />
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
            }`}
          >
            {isLoading ? 'Adding House...' : 'Add House'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHouse;