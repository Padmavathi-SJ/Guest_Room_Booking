// routes/house_owners/room_booking.js
import express from 'express';
import { 
  addRoomBookingDetails, 
  getRoomBookingInfo,
  listOwnerBookings, 
  changeBookingConfirmStatus,
  changeBookingCompletedStatus,
  changeBookingCancelledStatus
} from '../../Controllers/house_owners/room_booking.js';

const router = express.Router();

// Get room details (house_id and owner_id)
router.get('/rooms/:room_id/info', getRoomBookingInfo);

// Add booking details for a room
router.post('/rooms/:room_id/booking', addRoomBookingDetails);

// GET /api/owners/:owner_id/bookings - Get all bookings for owner
router.get('/:owner_id/bookings', listOwnerBookings);

// PATCH /api/bookings/:booking_id/status - Update booking status
router.patch('/:booking_id/confirm_status', changeBookingConfirmStatus);

router.patch('/:booking_id/completed_status', changeBookingCompletedStatus);

router.patch('/:booking_id/cancelled_status', changeBookingCancelledStatus);
 
export default router;