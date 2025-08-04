import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Bed, Wifi, Tv, Wind, Thermometer, Bath, TreePine, Laptop, User, Check, X } from 'lucide-react';
import axios from 'axios';

const AddRoom = () => {
  const { house_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    owner_id: '',
    room_name: '',
    floor_size: '',
    num_of_beds: 1,
    availability: true,
    has_wifi: false,
    has_tv: false,
    has_ac: false,
    has_heating: false,
    has_private_bathroom: false,
    has_balcony: false,
    has_workspace: false
  });

  const [roomPicture, setRoomPicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const ownerData = JSON.parse(localStorage.getItem('ownerData'));
    if (ownerData?.owner_id) {
      setFormData(prev => ({ ...prev, owner_id: ownerData.owner_id }));
    } else {
      showNotification('error', 'Please log in to add rooms');
      navigate('/owner/login');
    }
  }, [navigate]);

  const showNotification = (type, message) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please select a valid image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size should be less than 5MB');
      return;
    }

    setRoomPicture(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const requiredFields = ['room_name', 'floor_size', 'num_of_beds'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      showNotification('error', `Please fill in: ${missingFields.join(', ').replace(/_/g, ' ')}`);
      return false;
    }

    if (parseFloat(formData.floor_size) <= 0) {
      showNotification('error', 'Floor size must be a positive number');
      return false;
    }

    if (parseInt(formData.num_of_beds) <= 0) {
      showNotification('error', 'Number of beds must be a positive integer');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !formData.owner_id) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('owner_id', formData.owner_id);
      formDataToSend.append('house_id', house_id);
      formDataToSend.append('room_name', formData.room_name);
      formDataToSend.append('floor_size', formData.floor_size);
      formDataToSend.append('num_of_beds', formData.num_of_beds);
      formDataToSend.append('availability', formData.availability);
      formDataToSend.append('has_wifi', formData.has_wifi);
      formDataToSend.append('has_tv', formData.has_tv);
      formDataToSend.append('has_ac', formData.has_ac);
      formDataToSend.append('has_heating', formData.has_heating);
      formDataToSend.append('has_private_bathroom', formData.has_private_bathroom);
      formDataToSend.append('has_balcony', formData.has_balcony);
      formDataToSend.append('has_workspace', formData.has_workspace);

      if (roomPicture) {
        formDataToSend.append('room_picture', roomPicture);
      }

      const response = await axios.post(
        `http://localhost:5000/api/owner/${house_id}/add_room`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      );

      if (response.data.status) {
        showNotification('success', 'Room added successfully!');
        setFormData({
          owner_id: formData.owner_id,
          room_name: '',
          floor_size: '',
          num_of_beds: 1,
          availability: true,
          has_wifi: false,
          has_tv: false,
          has_ac: false,
          has_heating: false,
          has_private_bathroom: false,
          has_balcony: false,
          has_workspace: false
        });
        setRoomPicture(null);
        setImagePreview(null);
      } else {
        showNotification('error', response.data.message || 'Failed to add room');
      }
    } catch (error) {
      showNotification('error', error.response?.data?.message || 'Failed to add room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const amenityIcons = {
    has_wifi: <Wifi size={20} />,
    has_tv: <Tv size={20} />,
    has_ac: <Wind size={20} />,
    has_heating: <Thermometer size={20} />,
    has_private_bathroom: <Bath size={20} />,
    has_balcony: <TreePine size={20} />,
    has_workspace: <Laptop size={20} />
  };

  const amenityLabels = {
    has_wifi: 'WiFi',
    has_tv: 'TV',
    has_ac: 'Air Conditioning',
    has_heating: 'Heating',
    has_private_bathroom: 'Private Bathroom',
    has_balcony: 'Balcony',
    has_workspace: 'Workspace'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Add Room to House #{house_id}
            </h2>
            <p className="text-blue-100">Fill in the information about your room</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Owner ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <User className="inline w-4 h-4 mr-2" />
                Owner ID
              </label>
              <input
                type="text"
                name="owner_id"
                value={formData.owner_id}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Room Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Room Name *
              </label>
              <input
                type="text"
                name="room_name"
                value={formData.room_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Master Bedroom, Living Room"
                required
              />
            </div>

            {/* Room Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Upload className="inline w-4 h-4 mr-2" />
                Room Picture
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Room preview" 
                      className="mx-auto max-h-64 rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setRoomPicture(null);
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <div className="mb-4">
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Room Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Floor Size (sq ft) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="floor_size"
                  value={formData.floor_size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 150.50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Bed className="inline w-4 h-4 mr-2" />
                  Number of Beds *
                </label>
                <input
                  type="number"
                  name="num_of_beds"
                  value={formData.num_of_beds}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 2"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Availability
              </label>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="availability"
                    checked={formData.availability}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                    {formData.availability ? (
                      <>
                        <Check className="w-4 h-4 text-green-600 mr-1" />
                        Available
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-red-600 mr-1" />
                        Not Available
                      </>
                    )}
                  </span>
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Set whether this room is currently available for booking
              </p>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Room Amenities
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.keys(amenityIcons).map((amenity) => (
                  <label 
                    key={amenity} 
                    className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <input
                      type="checkbox"
                      name={amenity}
                      checked={formData[amenity]}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                        {amenityIcons[amenity]}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                        {amenityLabels[amenity]}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Adding Room...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Add Room
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;