import express from 'express';
import {getUserBookings, getUserBookingHistory } from '../../Controllers/customers/get_booked_rooms.js';

const router = express.Router();


// GET /api/user/:user_id/bookings - Get user's booked rooms
router.get('/:user_id/booked_rooms', getUserBookings);

// GET /api/user/:user_id/bookings/history
router.get('/:user_id/bookings/history', getUserBookingHistory);

export default router;