import { getRoomBookingsByRoomId,
      getHouseDetailsByRoomId,
  createBooking,
  checkRoomAvailability
 } from '../../Models/customers/room_booking.js';

export const getRoomBookings = async (req, res) => {
  const { room_id } = req.params;

  // Validate room_id
  if (!room_id || isNaN(room_id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid room ID"
    });
  }

  try {
    const bookings = await getRoomBookingsByRoomId(room_id);
    
    res.status(200).json({
      status: true,
      message: "Room bookings fetched successfully",
      data: bookings
    });
  } catch (error) {
    console.error("Error fetching room bookings:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch room bookings",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const bookRoom = async (req, res) => {
  const { room_id } = req.params;
  const {
    from_date,
    to_date,
    from_time,
    to_time,
    user_location,
    user_job_occupation,
    user_id, // From frontend localStorage
    user_name // From frontend localStorage
  } = req.body;

  // Validate input
  if (!user_id || !user_name || !from_date || !to_date || !from_time || !to_time || !user_location || !user_job_occupation) {
    return res.status(400).json({
      status: false,
      message: "All fields are required"
    });
  }

  try {
    // 1. Get house and owner details
    const { house_id, owner_id } = await getHouseDetailsByRoomId(room_id);

    // 2. Check room availability
    const isAvailable = await checkRoomAvailability(
      room_id,
      from_date,
      to_date,
      from_time,
      to_time
    );

    if (!isAvailable) {
      return res.status(409).json({
        status: false,
        message: "Room is not available for the selected dates/times"
      });
    }

    // 3. Create booking
    const bookingId = await createBooking({
      user_id,
      user_name,
      owner_id,
      house_id,
      room_id,
      from_date,
      to_date,
      from_time,
      to_time,
      user_location,
      user_job_occupation
    });

    res.status(201).json({
      status: true,
      message: "Room booked successfully",
      data: {
        booking_id: bookingId,
        house_id,
        room_id
      }
    });

  } catch (error) {
    console.error("Booking error:", error);
    if (error.message === 'Room not found') {
      return res.status(404).json({
        status: false,
        message: error.message
      });
    }
    res.status(500).json({
      status: false,
      message: "Failed to book room",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


