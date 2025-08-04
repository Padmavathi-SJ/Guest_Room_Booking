import { getOwnerDashboardStats, getRecentPendingBookings } from '../../Models/house_owners/dashboard.js';


export const getOwnerDashboard = async (req, res) => {
  try {
    const { owner_id } = req.params;
    
    if (!owner_id) {
      return res.status(400).json({
        status: false,
        message: "Owner ID is required"
      });
    }

    const [stats, recentBookings] = await Promise.all([
      getOwnerDashboardStats(owner_id),
      getRecentPendingBookings(owner_id)
    ]);
    
    return res.status(200).json({
      status: true,
      data: {
        total_houses: stats.total_houses || 0,
        total_rooms: stats.total_rooms || 0,
        active_bookings: stats.active_bookings || 0,
        total_earnings: stats.total_earnings || 0,
        recent_bookings: recentBookings || []
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    
    if (error.message === "No data found for this owner") {
      return res.status(404).json({
        status: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      status: false,
      message: "Failed to fetch dashboard stats",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};