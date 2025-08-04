import db from '../../DB/db.js';

export const getRoomDetails = (room_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      select room_id, owner_id, house_id
      from room_details 
      where room_id = ?
    `;
    
    db.query(query, [room_id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) {
        return reject({ message: "Room not found" });
      }
      resolve(result[0]);
    });
  });
};

export const insertRoomBookingDetails = (bookingData) => {
  const {
    owner_id,
    house_id,
    room_id,
    availability,
    from_date,
    to_date,
    from_time,
    to_time,
    rent_amount_per_day,
    minimum_booking_period,
    maximum_booking_period
  } = bookingData;

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO room_booking_details 
      (owner_id, house_id, room_id, availability, from_date, to_date, 
       from_time, to_time, rent_amount_per_day, 
       minimum_booking_period, maximum_booking_period)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [
      owner_id,
      house_id,
      room_id,
      availability,
      from_date,
      to_date,
      from_time,
      to_time,
      rent_amount_per_day,
      minimum_booking_period,
      maximum_booking_period
    ], (err, result) => {
      if (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return reject({ message: "Owner, house or room does not exist" });
        }
        return reject(err);
      }
      
      resolve({ 
        bookingId: result.insertId,
        message: "Room booking details added successfully"
      });
    });
  });
};

// Get all bookings for an owner
export const getOwnerBookings = (ownerId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        b.booking_id,
        b.user_id,
        b.user_name,
        b.house_id,
        b.room_id,
        b.from_date,
        b.to_date,
        b.from_time,
        b.to_time,
        b.user_location,
        b.user_job_occupation,
        b.booking_status,
        b.created_at,
        r.room_name,
        h.house_name,
        h.house_location AS house_address
      FROM book_room b
      JOIN room_details r ON b.room_id = r.room_id
      JOIN house_details h ON b.house_id = h.house_id
      WHERE b.owner_id = ?
      ORDER BY b.created_at DESC
    `;
    
    db.query(query, [ownerId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Update booking status
export const updateBookingConfirmStatus = (bookingId, status) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE book_room 
      SET booking_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE booking_id = ?
    `;
    
    db.query(query, [status, bookingId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

export const updateBookingCompletedStatus = (bookingId, status) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE book_room 
      SET booking_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE booking_id = ?
    `;
    
    db.query(query, [status, bookingId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

export const updateBookingCancelledStatus = (bookingId, status) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE book_room 
      SET booking_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE booking_id = ?
    `;
    
    db.query(query, [status, bookingId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};

