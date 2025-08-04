import { 
    insertRoomDetails,
    getRoomsByHouseId
 } from '../../Models/house_owners/room_details.js';
import path from 'path';
import fs from 'fs';

export const addRoomDetails = async (req, res) => {
    try {
        // Handle file upload
        let room_picture = null;
        if (req.file) {
            room_picture = req.file.filename;
        }

        // Get house_id from URL parameters
        const { house_id } = req.params;

        const roomData = {
            ...req.body,
            house_id,
            room_picture,
            availability: req.body.availability === 'true' || req.body.availability === true // Ensure boolean
        };

        // Validate required fields (now includes owner_id)
        const requiredFields = ['owner_id', 'room_name', 'floor_size', 'num_of_beds'];
        const missingFields = requiredFields.filter(field => !roomData[field]);

        if (missingFields.length > 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                status: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Convert numeric fields
        roomData.floor_size = parseFloat(roomData.floor_size);
        roomData.num_of_beds = parseInt(roomData.num_of_beds);

        if (isNaN(roomData.floor_size) || roomData.floor_size <= 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                status: false,
                message: "Floor size must be a positive number"
            });
        }

        if (isNaN(roomData.num_of_beds) || roomData.num_of_beds <= 0) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                status: false,
                message: "Number of beds must be a positive integer"
            });
        }

        const result = await insertRoomDetails(roomData);
        return res.status(201).json({ 
            status: true, 
            message: "Room details added successfully",
            data: {
                roomId: result.roomId,
                roomPicture: result.roomPicture,
                availability: roomData.availability ? 'available' : 'not available'
            }
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        if (error.message === "Owner or house does not exist") {
            return res.status(404).json({ 
                status: false, 
                message: error.message 
            });
        }
        return res.status(500).json({ 
            status: false, 
            message: "Failed to add room details",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const fetchRoomDetails = async (req, res) => {
  try {
    const { house_id } = req.params;

    // Validate house_id
    if (!house_id || isNaN(parseInt(house_id))) {
      return res.status(400).json({
        status: false,
        message: "Invalid house ID"
      });
    }

    const rooms = await getRoomsByHouseId(house_id);

    return res.status(200).json({
      status: true,
      message: "Rooms fetched successfully",
      data: rooms
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch room details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};