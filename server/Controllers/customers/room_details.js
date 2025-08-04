import { getAvailableRooms, getRoomDetails } from '../../Models/customers/room_details.js';


export const listAvailableRooms = async (req, res) => {
  const { house_id } = req.params;
  const { check_in_date, check_out_date } = req.query;

  // Validate required parameters
  if (!house_id || !check_in_date || !check_out_date) {
    return res.status(400).json({
      status: false,
      message: 'House ID, check-in date and check-out date are required'
    });
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(check_in_date) || !dateRegex.test(check_out_date)) {
    return res.status(400).json({
      status: false,
      message: 'Invalid date format. Use YYYY-MM-DD'
    });
  }

  // Validate date logic
  if (new Date(check_in_date) >= new Date(check_out_date)) {
    return res.status(400).json({
      status: false,
      message: 'Check-out date must be after check-in date'
    });
  }

  try {
    const rooms = await getAvailableRooms(house_id, check_in_date, check_out_date);
    res.status(200).json({
      status: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch available rooms',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Get single room details
export const getRoom = async (req, res) => {
  const { room_id } = req.params;

  try {
    const room = await getRoomDetails(room_id);
    if (!room) {
      return res.status(404).json({
        status: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      status: true,
      data: room
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch room details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};