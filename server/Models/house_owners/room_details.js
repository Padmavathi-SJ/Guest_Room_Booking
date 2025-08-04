import db from '../../DB/db.js';

export const insertRoomDetails = (roomData) => {
  const { 
    owner_id, 
    house_id, 
    room_name, 
    room_picture,
    availability, // Added availability
    floor_size, 
    num_of_beds,
    has_wifi,
    has_tv,
    has_ac,
    has_heating,
    has_private_bathroom,
    has_balcony,
    has_workspace
  } = roomData;

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO room_details 
      (owner_id, house_id, room_name, room_picture, availability, floor_size, num_of_beds,
       has_wifi, has_tv, has_ac, has_heating, has_private_bathroom, 
       has_balcony, has_workspace)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [
      owner_id, 
      house_id, 
      room_name, 
      room_picture,
      availability ? 'available' : 'not available', // Convert boolean to enum string
      floor_size, 
      num_of_beds,
      has_wifi ? 1 : 0,
      has_tv ? 1 : 0,
      has_ac ? 1 : 0,
      has_heating ? 1 : 0,
      has_private_bathroom ? 1 : 0,
      has_balcony ? 1 : 0,
      has_workspace ? 1 : 0
    ], (err, result) => {
      if (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return reject({ message: "Owner or house does not exist" });
        }
        return reject(err);
      }
      
      resolve({ 
        roomId: result.insertId,
        roomPicture: room_picture
      });
    });
  });
};

export const getRoomsByHouseId = (house_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM room_details 
      WHERE house_id = ?
      ORDER BY created_at DESC
    `;
    
    db.query(query, [house_id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};
