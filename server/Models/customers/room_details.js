import db from '../../DB/db.js';

// Get available rooms that aren't booked during the specified period
export const getAvailableRooms = (houseId, checkInDate, checkOutDate) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        r.*,
        h.house_name,
        h.house_location,
        h.city,
        h.state
      FROM room_details r
      JOIN house_details h ON r.house_id = h.house_id
      WHERE r.house_id = ?
      AND r.availability = 'available'
      AND r.room_id NOT IN (
        SELECT br.room_id 
        FROM book_room br
        WHERE br.room_id = r.room_id
        AND br.booking_status IN ('pending', 'confirmed')
        AND (
          (br.from_date BETWEEN ? AND ?)
          OR (br.to_date BETWEEN ? AND ?)
          OR (? BETWEEN br.from_date AND br.to_date)
          OR (? BETWEEN br.from_date AND br.to_date)
        )
      )
    `;
    
    const params = [
      houseId,
      checkInDate, checkOutDate,
      checkInDate, checkOutDate,
      checkInDate, checkOutDate
    ];
    
    db.query(query, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Get room details by ID
export const getRoomDetails = (roomId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        r.*,
        h.house_name,
        h.house_location,
        h.city,
        h.state
      FROM room_details r
      JOIN house_details h ON r.house_id = h.house_id
      WHERE r.room_id = ?
    `;
    
    db.query(query, [roomId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};