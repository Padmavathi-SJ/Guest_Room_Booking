import { insertRoomPicture,
    getRoomPictures
 } from '../../Models/house_owners/room_pictures.js';
import path from 'path';
import fs from 'fs';

export const addRoomPicture = async (req, res) => {
    try {
        const { room_id } = req.params;
        const picture = req.file.filename;

        // Validate room_id
        if (!room_id || isNaN(parseInt(room_id))) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                status: false,
                message: "Invalid room ID"
            });
        }

        const result = await insertRoomPicture(room_id, picture);
        
        return res.status(201).json({ 
            status: true, 
            message: "Room picture added successfully",
            data: {
                pictureId: result.pictureId,
                picturePath: result.picturePath
            }
        });
    } catch (error) {
        // Remove uploaded file if error occurs
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        if (error.message === "Room does not exist") {
            return res.status(404).json({ 
                status: false, 
                message: error.message 
            });
        }
        return res.status(500).json({ 
            status: false, 
            message: "Failed to add room picture",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const getAllRoomPictures = async (req, res) => {
    try {
        const { room_id } = req.params;

        // Validate room_id
        if (!room_id || isNaN(parseInt(room_id))) {
            return res.status(400).json({
                status: false,
                message: "Invalid room ID"
            });
        }

        const pictures = await getRoomPictures(room_id);
        
        return res.status(200).json({ 
            status: true, 
            message: "Room pictures retrieved successfully",
            data: pictures
        });
    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            message: "Failed to retrieve room pictures",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};