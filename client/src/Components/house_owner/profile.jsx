import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Home, MapPin, Calendar, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ ownerId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ownerId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/owner/${ownerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (response.data.status !== true) {
          throw new Error(response.data.message || 'Failed to fetch profile');
        }

        setProfile(response.data.data);
      } catch (err) {
        console.error('Profile error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [ownerId]);

  const handleEditProfile = () => {
    navigate(`/owner/edit_profile/${ownerId}`);
  };

  if (loading) {
    return (
      <div className="animate-pulse flex items-center space-x-4">
        <div className="rounded-full bg-gray-200 h-10 w-10"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <>
      {/* Profile Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors"
      >
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-700">{profile.name}</p>
          <p className="text-xs text-gray-500">{profile.email}</p>
        </div>
      </button>

      {/* Profile Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-blue-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Profile Information</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold mb-4">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                <p className="text-blue-600">{profile.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{profile.mobile_num}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Permanent Address</p>
                    <p className="font-medium">{profile.permanent_address}</p>
                  </div>
                </div>

                {profile.temp_address && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Temporary Address</p>
                      <p className="font-medium">{profile.temp_address}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{profile.city}, {profile.state}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleEditProfile}
                  className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;