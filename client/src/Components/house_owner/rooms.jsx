import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bed, Wifi, Tv, Wind, Thermometer, Bath, TreePine, Laptop, Plus, Image } from 'lucide-react';
import axios from 'axios';

const Rooms = () => {
  const { house_id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/owner/${house_id}/rooms`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.status) {
          setRooms(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch rooms');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch room details');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [house_id]);

  const amenityIcons = {
    has_wifi: <Wifi size={16} className="text-blue-500" />,
    has_tv: <Tv size={16} className="text-blue-500" />,
    has_ac: <Wind size={16} className="text-blue-500" />,
    has_heating: <Thermometer size={16} className="text-blue-500" />,
    has_private_bathroom: <Bath size={16} className="text-blue-500" />,
    has_balcony: <TreePine size={16} className="text-blue-500" />,
    has_workspace: <Laptop size={16} className="text-blue-500" />
  };

  const handleAddPicture = (roomId) => {
    navigate(`/owner/add_room_picture/${roomId}`);
  };

  const handleViewPictures = (roomId) => {
    navigate(`/owner/room_pictures/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        No rooms found for this house.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold">Rooms in House #{house_id}</h2>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.room_id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Room Image with Add Picture Button */}
            <div className="h-48 bg-gray-100 overflow-hidden relative">
              {room.room_picture ? (
                <img 
                  src={`http://localhost:5000/uploads/rooms/${room.room_picture}`} 
                  alt={room.room_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    e.target.className = 'w-full h-full object-contain p-4 bg-gray-100';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  onClick={() => handleAddPicture(room.room_id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md transition flex items-center justify-center"
                  title="Add Picture"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => handleViewPictures(room.room_id)}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md transition flex items-center justify-center"
                  title="View Pictures"
                >
                  <Image size={16} />
                </button>
              </div>
            </div>

            {/* Room Details */}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{room.room_name}</h3>
              
              <div className="flex items-center mb-2">
                <Bed size={18} className="text-gray-600 mr-2" />
                <span className="text-gray-700">{room.num_of_beds} {room.num_of_beds === 1 ? 'Bed' : 'Beds'}</span>
              </div>
              
              <div className="flex items-center mb-4">
                <span className="text-gray-700">{room.floor_size} sq ft</span>
              </div>

              {/* Amenities */}
              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(amenityIcons).map(([key, icon]) => (
                    room[key] === 1 && (
                      <div key={key} className="flex items-center bg-gray-50 px-2 py-1 rounded">
                        {icon}
                        <span className="ml-1 text-sm text-gray-700">
                          {key.split('_')[1].charAt(0).toUpperCase() + key.split('_')[1].slice(1)}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>

 <button
                  onClick={() => navigate(`/owner/add_booking_details/${room.room_id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                >
                  <Plus size={16} />
                  <span>Add Booking Details</span>
                </button>
              {/* View Pictures Button */}
              <button
                onClick={() => handleViewPictures(room.room_id)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
              >
                <Image size={16} />
                <span>See Room Pictures</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;