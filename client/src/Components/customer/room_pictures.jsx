import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Image as ImageIcon } from 'lucide-react';

const RoomPictures = () => {
  const { room_id } = useParams();
  const navigate = useNavigate();
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomPictures = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/owner/${room_id}/pictures`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        // Ensure we have the full URL with domain
        const picturesWithFullUrl = response.data.data.map(pic => ({
          ...pic,
          fullUrl: `http://localhost:5000${pic.pictureUrl}`
        }));
        
        setPictures(picturesWithFullUrl);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch room pictures');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomPictures();
  }, [room_id]);

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = '/image-placeholder.png'; // Make sure this exists in your public folder
    e.target.className = 'w-full h-full object-contain p-4 bg-gray-100';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>;
  }

  if (pictures.length === 0) {
    return <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
      No pictures found for this room
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Room
        </button>
        
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Room Pictures</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pictures.map((picture) => (
          <div key={picture.pictureId} className="relative group">
            <div className="h-48 bg-gray-100 overflow-hidden rounded-lg">
              <img
                src={picture.fullUrl}
                alt={`Room ${room_id}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm">
                Uploaded: {new Date(picture.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomPictures;