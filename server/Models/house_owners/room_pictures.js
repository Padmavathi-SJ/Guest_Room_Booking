import db from '../../DB/db.js';

export const insertRoomPicture = (room_id, picture) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO room_pictures 
      (room_id, picture)
      VALUES (?, ?)
    `;
    
    db.query(query, [room_id, picture], (err, result) => {
      if (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return reject({ message: "Room does not exist" });
        }
        return reject(err);
      }
      resolve({ 
        pictureId: result.insertId,
        picturePath: picture
      });
    });
  });
};

export const getRoomPictures = (room_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT picture_id, picture, uploaded_at 
      FROM room_pictures 
      WHERE room_id = ?
      ORDER BY uploaded_at DESC
    `;
    
    db.query(query, [room_id], (err, result) => {
      if (err) return reject(err);
      
      // Map results to include full URL for each picture
      const pictures = result.map(pic => ({
        pictureId: pic.picture_id,
        pictureUrl: `/uploads/room_pictures/${pic.picture}`,
        uploadedAt: pic.uploaded_at
      }));
      
      resolve(pictures);
    });
  });
};