import express from 'express';
import {
  getOwnerProfile,
  updateOwnerProfile
} from '../../Controllers/house_owners/profile.js';

const router = express.Router();

// GET /api/owners/:owner_id - Get owner profile
router.get('/:owner_id', getOwnerProfile);

// PUT /api/owners/:owner_id - Update owner profile
router.put('/update/:owner_id', updateOwnerProfile);

export default router;