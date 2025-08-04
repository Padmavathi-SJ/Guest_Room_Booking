import { getBookingsByUserId,  getBookingHistory } from "../../Models/customers/get_booked_rooms.js";

export const getUserBookings = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { filter = 'current' } = req.query;

    if (!user_id || isNaN(user_id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid user ID"
      });
    }

    const bookings = await getBookingsByUserId(user_id, filter);

    return res.status(200).json({
      status: true,
      data: bookings,
      message: `Successfully fetched ${filter} bookings`
    });

  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch user bookings",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getUserBookingHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { filter = 'all' } = req.query;

    // Validate user_id
    if (!user_id || isNaN(user_id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid user ID provided"
      });
    }

    // Validate filter
    if (!['current', 'past', 'all'].includes(filter)) {
      return res.status(400).json({
        status: false,
        message: "Invalid filter. Use 'current', 'past', or 'all'"
      });
    }

    // Get booking history
    const bookings = await getBookingHistory(user_id, filter);

    return res.status(200).json({
      status: true,
      data: bookings,
      message: `Successfully retrieved ${filter} bookings`
    });

  } catch (error) {
    console.error('Error in getUserBookingHistory:', error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};