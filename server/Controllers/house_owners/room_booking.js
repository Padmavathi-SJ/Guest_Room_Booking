import { 
    getRoomDetails,
    insertRoomBookingDetails,
getOwnerBookings, 
updateBookingConfirmStatus,
updateBookingCompletedStatus,
updateBookingCancelledStatus } from '../../Models/house_owners/room_booking.js';


export const addRoomBookingDetails = async (req, res) => {
    try {
        const { room_id } = req.params;

        // First get room details to verify house and owner
        const roomDetails = await getRoomDetails(room_id);
        
        // Validate required fields (excluding owner_id, house_id as we get them from room)
        const requiredFields = [
            'availability', 
            'from_date', 
            'to_date', 
            'rent_amount_per_day'
        ];
        
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Prepare booking data
        const bookingData = {
            owner_id: roomDetails.owner_id,
            house_id: roomDetails.house_id,
            room_id: parseInt(room_id),
           availability: req.body.availability ? 'available' : 'not available',
            from_date: req.body.from_date,
            to_date: req.body.to_date,
            from_time: req.body.from_time || null,
            to_time: req.body.to_time || null,
            rent_amount_per_day: parseFloat(req.body.rent_amount_per_day),
            minimum_booking_period: parseInt(req.body.minimum_booking_period) || 1,
            maximum_booking_period: parseInt(req.body.maximum_booking_period) || 30
        };

        // Validate numerical values
        if (isNaN(bookingData.rent_amount_per_day) || 
            isNaN(bookingData.minimum_booking_period) || 
            isNaN(bookingData.maximum_booking_period)) {
            return res.status(400).json({
                status: false,
                message: "Numerical fields must contain valid numbers"
            });
        }

        const result = await insertRoomBookingDetails(bookingData);
        
        return res.status(201).json({ 
            status: true, 
            message: result.message,
            data: {
                bookingId: result.bookingId
            }
        });
    } catch (error) {
        if (error.message === "Room not found") {
            return res.status(404).json({ 
                status: false, 
                message: error.message 
            });
        }
        return res.status(500).json({ 
            status: false, 
            message: "Failed to add room booking details",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getRoomBookingInfo = async (req, res) => {
    try {
        const { room_id } = req.params;
        const roomDetails = await getRoomDetails(room_id);
        
        return res.status(200).json({ 
            status: true, 
            data: {
                room_id: roomDetails.room_id,
                house_id: roomDetails.house_id,
                owner_id: roomDetails.owner_id
            }
        });
    } catch (error) {
        if (error.message === "Room not found") {
            return res.status(404).json({ 
                status: false, 
                message: error.message 
            });
        }
        return res.status(500).json({ 
            status: false, 
            message: "Failed to fetch room details",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// Get all bookings for owner
export const listOwnerBookings = async (req, res) => {
  const { owner_id } = req.params;

  try {
    const bookings = await getOwnerBookings(owner_id);
    res.status(200).json({
      status: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to fetch bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const changeBookingConfirmStatus = async (req, res) => {
  const { booking_id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({
      status: false,
      message: 'Invalid booking status'
    });
  }

  try {
    const updated = await updateBookingConfirmStatus(booking_id, status);
    if (!updated) {
      return res.status(404).json({
        status: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      status: true,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update booking status
export const changeBookingCompletedStatus = async (req, res) => {
  const { booking_id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({
      status: false,
      message: 'Invalid booking status'
    });
  }

  try {
    const updated = await updateBookingCompletedStatus(booking_id, status);
    if (!updated) {
      return res.status(404).json({
        status: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      status: true,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const changeBookingCancelledStatus = async (req, res) => {
  const { booking_id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({
      status: false,
      message: 'Invalid booking status'
    });
  }

  try {
    const updated = await updateBookingCancelledStatus(booking_id, status);
    if (!updated) {
      return res.status(404).json({
        status: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      status: true,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};