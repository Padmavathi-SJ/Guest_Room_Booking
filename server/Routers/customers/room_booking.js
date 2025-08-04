import express from 'express';
import { getRoomBookings, bookRoom } from '../../Controllers/customers/room_booking.js';

const router = express.Router();

// GET /api/rooms/:room_id/bookings - Get room availability
router.get('/:room_id/bookings', getRoomBookings);

// POST /api/rooms/:room_id/book - Book a room
router.post('/:room_id/book', bookRoom);


export default router;