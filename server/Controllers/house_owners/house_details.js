import { 
    insertHouseDetails,
    getOwnerHouses,
    getHouseDetails,
    updateHouseDetails
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

export const fetchHouseDetails = async (req, res) => {
  try {
    const { house_id } = req.params;

    // Validate house_id
    if (!house_id || isNaN(parseInt(house_id))) {
      return res.status(400).json({
        status: false,
        message: "Invalid house ID"
      });
    }

    const house = await getHouseDetails(house_id);

    return res.status(200).json({
      status: true,
      message: "House details fetched successfully",
      data: house
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch house details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const editHouseDetails = async (req, res) => {
  try {
    const { house_id } = req.params;
    const updateData = req.body;

    // Validate house_id
    if (!house_id || isNaN(parseInt(house_id))) {
      return res.status(400).json({
        status: false,
        message: "Invalid house ID"
      });
    }

    // Basic validation
    if (!updateData.house_name || !updateData.house_location) {
      return res.status(400).json({
        status: false,
        message: "House name and location are required"
      });
    }

    await updateHouseDetails(house_id, updateData);

    return res.status(200).json({
      status: true,
      message: "House updated successfully"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to update house details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};