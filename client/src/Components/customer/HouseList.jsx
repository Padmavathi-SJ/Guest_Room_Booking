import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';


const HouseList = () => {
//  const { house_id } = useParams();
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/get_all_houses');
        setHouses(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch houses');
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

    const handleViewRooms = (houseId) => navigate(`/user/visit_rooms/${houseId}`);

  if (loading) return <div>Loading houses...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {houses.map(house => (
        <div key={house.house_id} className="border rounded-lg overflow-hidden shadow-lg">
          <img 
            src={`http://localhost:5000/uploads/houses/${house.house_img}`}
            alt={house.house_name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{house.house_name}</h3>
            <p className="text-gray-600 mb-1">{house.house_location}</p>
            <p className="mb-1">{house.city}, {house.state}</p>
            <p className="mb-2">Rooms: {house.total_rooms}</p>
            
            <div className="border-t pt-2 mt-2">
              <p className="text-sm text-gray-500">Owner: {house.owner_name}</p>
              <p className="text-sm text-gray-500">Contact: {house.owner_contact}</p>
            </div>
            <button
                                    onClick={() => handleViewRooms(house.house_id)}
                                    className="w-10 h-10 bg-blue/95 backdrop-blur-sm hover:bg-white text-slate-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    title="View Rooms"
                                  >
                                   View Rooms
                                  </button>

            
          </div>
        </div>
      ))}
    </div>
  );
};

export default HouseList;