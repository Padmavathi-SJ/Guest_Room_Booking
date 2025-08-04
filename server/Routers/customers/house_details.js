import express from 'express';
import {
  getAllHouses,
  getHouseDetails
} from '../../Controllers/customers/house_details.js';

const router = express.Router();

// Get all available houses with owner info
router.get('/get_all_houses', getAllHouses);

// Get specific house details with owner info
router.get('/:houseId', getHouseDetails);

export default router;