import { 
    insertHouseDetails,
    getOwnerHouses
 } from '../../Models/house_owners/house_details.js';
import path from 'path';
import fs from 'fs';

export const addHouseDetails = async (req, res) => {
    try {
        // Handle file upload
        let house_img = null;
        if (req.file) {
            house_img = req.file.filename; // Store just the filename
        }

        const houseData = {
            ...req.body,
            house_img
        };

        // Validate required fields
        const requiredFields = ['owner_id', 'house_name', 'total_rooms', 'house_location', 'city', 'state'];
        const missingFields = requiredFields.filter(field => !houseData[field]);

        if (missingFields.length > 0) {
            // Remove uploaded file if validation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                status: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate total_rooms is positive integer
        const totalRooms = parseInt(houseData.total_rooms);
        if (isNaN(totalRooms) || totalRooms <= 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                status: false,
                message: "Total rooms must be a positive integer"
            });
        }

        const result = await insertHouseDetails(houseData);
        return res.status(201).json({ 
            status: true, 
            message: "House details added successfully",
            data: {
                houseId: result.houseId,
                availability: result.availability,
                house_img: result.house_img
            }
        });
    } catch (error) {
        // Remove uploaded file if error occurs
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        if (error.message === "Owner does not exist") {
            return res.status(404).json({ 
                status: false, 
                message: error.message 
            });
        }
        return res.status(500).json({ 
            status: false, 
            message: "Failed to add house details",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const listOwnerHouses = async (req, res) => {
  try {
    const { owner_id } = req.params;
    const { availability } = req.query; // Optional filter

    if (!owner_id) {
      return res.status(400).json({
        status: false,
        message: "Owner ID is required"
      });
    }

    const houses = await getOwnerHouses(owner_id, availability);

    return res.status(200).json({
      status: true,
      data: houses
    });

  } catch (error) {
    console.error("Error fetching houses:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch houses",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};