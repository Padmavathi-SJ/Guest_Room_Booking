import express from 'express';
import { listAvailableRooms, getRoom } from '../../Controllers/customers/room_details.js';

const router = express.Router();

// GET /api/houses/:house_id/rooms?check_in_date=YYYY-MM-DD&check_out_date=YYYY-MM-DD
router.get('/houses/:house_id/rooms', listAvailableRooms);

// GET /api/rooms/:room_id
router.get('/rooms/:room_id', getRoom);

export default router;