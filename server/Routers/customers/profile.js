import express from 'express';
import {
  getUserProfile,
  updateUserProfile
} from '../../Controllers/customers/profile.js';

const router = express.Router();

// GET /api/users/:user_id - Get user profile
router.get('/get_user/:user_id', getUserProfile);

// PUT /api/users/:user_id - Update user profile
router.put('/edit/:user_id', updateUserProfile);

export default router;