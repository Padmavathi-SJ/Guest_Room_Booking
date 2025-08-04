import express from 'express';
import { getOwnerDashboard} from '../../Controllers/house_owners/dashboard.js';

const router = express.Router();

// GET /api/owner/:owner_id/dashboard
router.get('/:owner_id/dashboard',  getOwnerDashboard);

export default router;