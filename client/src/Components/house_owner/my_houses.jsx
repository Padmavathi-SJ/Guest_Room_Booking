import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEye, FaEdit, FaTrash, FaMapMarkerAlt, FaCity, FaBed } from 'react-icons/fa';

const MyHouses = () => {
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState(null);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Get owner_id from localStorage
  useEffect(() => {
    const ownerData = JSON.parse(localStorage.getItem('ownerData'));
    if (ownerData?.owner_id) {
      setOwnerId(ownerData.owner_id);
    } else {
      setError('Please log in to view your houses');
      setLoading(false);
    }
  }, []);

  // Fetch houses
  useEffect(() => {
    if (!ownerId) return;

    const fetchHouses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/owner/${ownerId}/houses`, {
          params: filter !== 'all' ? { availability: filter } : {}
        });
        setHouses(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch houses');
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, [ownerId, filter]);

  const handleAddHouse = () => navigate('/owner/add_house');
  const handleAddRoom = (houseId) => navigate(`/owner/add_room/${houseId}`);
  const handleViewRooms = (houseId) => navigate(`/owner/rooms/${houseId}`);

  const handleDeleteHouse = async (houseId) => {
    if (window.confirm('Are you sure you want to delete this house?')) {
      try {
        await axios.delete(`http://localhost:5000/api/owner/houses/${houseId}`);
        setHouses(houses.filter(house => house.house_id !== houseId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete house');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 ml-64">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-slate-800 tracking-wide">My Properties</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your property portfolio</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-200 shadow-sm hover:shadow-md"
              disabled={!ownerId || loading}
            >
              <option value="all">All Properties</option>
              <option value="available">Available</option>
              <option value="not available">Not Available</option>
            </select>
            
            <button
              onClick={handleAddHouse}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!ownerId || loading}
            >
              <FaPlus className="text-xs" />
              Add Property
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-900"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && houses.length === 0 && (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPlus className="text-slate-400 text-xl" />
            </div>
            <p className="text-slate-600 mb-6">No properties found</p>
            <button
              onClick={handleAddHouse}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-200"
            >
              Add Your First Property
            </button>
          </div>
        )}

        {/* Login Required State */}
        {!loading && !ownerId && (
          <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
            <p className="text-slate-600 mb-6">Please log in to view your properties</p>
            <button
              onClick={() => navigate('/owner/login')}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-200"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Houses Grid */}
        {ownerId && !loading && !error && houses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {houses.map((house) => (
              <div key={house.house_id} className="group">
                {/* Glass Card - Increased Size */}
                <div className="bg-white/75 backdrop-blur-lg border border-white/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] hover:bg-white/85">
                  
                  {/* Image Section - Larger */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                    {house.house_img ? (
                      <img
                        src={`http://localhost:5000/uploads/houses/${house.house_img}`}
                        alt={house.house_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300/f1f5f9/64748b?text=No+Image';
                          e.target.className = 'w-full h-full object-contain p-8 bg-slate-100';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-slate-300/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <FaEye className="text-slate-500 text-xl" />
                          </div>
                          <span className="text-slate-500 text-base font-medium">No Image Available</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Floating Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button
                        onClick={() => handleAddRoom(house.house_id)}
                        className="w-10 h-10 bg-white/95 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                        title="Add Room"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleViewRooms(house.house_id)}
                        className="w-10 h-10 bg-white/95 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                        title="View Rooms"
                      >
                        <FaEye className="text-sm" />
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md shadow-lg ${
                        house.availability === 'available' 
                          ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300/50' 
                          : 'bg-red-100/90 text-red-800 border border-red-300/50'
                      }`}>
                        {house.availability}
                      </span>
                    </div>
                  </div>

                  {/* Content Section - Enhanced */}
                  <div className="p-6">
                    {/* House Name */}
                    <div className="mb-5">
                      <h3 className="font-bold text-xl text-slate-800 mb-1">{house.house_name}</h3>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    </div>
                    
                    {/* House Details - Professional Layout */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaMapMarkerAlt className="text-blue-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Location</p>
                          <p className="text-slate-800 font-medium leading-tight">{house.house_location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaCity className="text-green-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">City & State</p>
                          <p className="text-slate-800 font-medium leading-tight">{house.city}, {house.state}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaBed className="text-purple-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total Rooms</p>
                          <p className="text-slate-800 font-bold text-lg">{house.total_rooms}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Enhanced */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/owner/houses/${house.house_id}/edit`)}
                        className="flex-1 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-700 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 border border-amber-200/70 hover:border-amber-300"
                      >
                        <FaEdit className="text-sm" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHouse(house.house_id)}
                        className="flex-1 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-700 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 border border-red-200/70 hover:border-red-300"
                      >
                        <FaTrash className="text-sm" />
                        Delete
                      </button>
                      <button
                        onClick={() => handleViewRooms(house.house_id)}
                        className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 border border-blue-200/70 hover:border-blue-300"
                      >
                        <FaEye className="text-sm" />
                        Rooms
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHouses;