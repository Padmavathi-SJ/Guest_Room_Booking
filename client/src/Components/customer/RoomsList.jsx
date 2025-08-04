import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bed, Wifi, Tv, Wind, Thermometer, Bath, TreePine, Laptop, Image, Calendar, Clock, DollarSign, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import BookRoomForm from './BookRoomForm';

const Rooms = () => {
  const { house_id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
   const [dateRange, setDateRange] = useState({
    checkInDate: localStorage.getItem('checkInDate') || '',
    checkOutDate: localStorage.getItem('checkOutDate') || ''
  });

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!dateRange.checkInDate || !dateRange.checkOutDate) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/user/houses/${house_id}/rooms`,
        {
          params: {
            check_in_date: dateRange.checkInDate,
            check_out_date: dateRange.checkOutDate
          },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

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

  useEffect(() => {
    fetchAvailableRooms();
  }, [house_id, dateRange.checkInDate, dateRange.checkOutDate]);

const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => {
      const newDateRange = {
        ...prev,
        [name]: value
      };
      // Save to localStorage whenever dates change
      localStorage.setItem('checkInDate', newDateRange.checkInDate);
      localStorage.setItem('checkOutDate', newDateRange.checkOutDate);
      return newDateRange;
    });
  };

  const amenityIcons = {
    has_wifi: <Wifi size={16} className="text-blue-500" />,
    has_tv: <Tv size={16} className="text-blue-500" />,
    has_ac: <Wind size={16} className="text-blue-500" />,
    has_heating: <Thermometer size={16} className="text-blue-500" />,
    has_private_bathroom: <Bath size={16} className="text-blue-500" />,
    has_balcony: <TreePine size={16} className="text-blue-500" />,
    has_workspace: <Laptop size={16} className="text-blue-500" />
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
  };

  const handleViewPictures = (roomId) => {
    navigate(`/user/see_room_pictures/${roomId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : 'N/A';
  };

  const renderRoomCard = (room) => (
    <div key={room.room_id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Room Image */}
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
        <div className="border-t border-gray-200 pt-3 mb-4">
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

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleViewPictures(room.room_id)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
          >
            <Image size={16} />
            <span>Pictures</span>
          </button>
          <button
            onClick={() => handleBookRoom(room)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && !dateRange.checkInDate && !dateRange.checkOutDate) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
       {/* Back Button */}
      <button 
        onClick={() => navigate('/user/visit_houses')}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to All Houses</span>
      </button>

      <h2 className="text-2xl font-bold mb-6">Available Rooms in House #{house_id}</h2>
      
      {/* Date Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Your Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
            <input
              type="date"
              name="checkInDate"
              value={dateRange.checkInDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
            <input
              type="date"
              name="checkOutDate"
              value={dateRange.checkOutDate}
              onChange={handleDateChange}
              min={dateRange.checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Room Listing */}
      {!loading && !error && (
        <>
          {rooms.length === 0 ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              {dateRange.checkInDate && dateRange.checkOutDate 
                ? 'No available rooms found for the selected dates.'
                : 'Please select check-in and check-out dates to see available rooms.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(renderRoomCard)}
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">
                Book Room #{selectedRoom?.room_id}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <BookRoomForm 
                room={selectedRoom} 
                onClose={handleCloseModal} 
                onSuccess={() => {
                  handleCloseModal();
                  fetchAvailableRooms();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;