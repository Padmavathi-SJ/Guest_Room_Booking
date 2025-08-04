import db from '../../DB/db.js';

export const getRoomBookingsByRoomId = (roomId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        booking_id,
        from_date,
        to_date,
        TIME_FORMAT(from_time, '%H:%i') as from_time,
        TIME_FORMAT(to_time, '%H:%i') as to_time,
        rent_amount_per_day,
        minimum_booking_period,
        maximum_booking_period,
        availability,
        created_at,
        updated_at
      FROM 
        room_booking_details
      WHERE 
        room_id = ?
      ORDER BY 
        from_date ASC, from_time ASC
    `;

    db.query(query, [roomId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};



// Get house and owner details by room_id
export const getHouseDetailsByRoomId = (roomId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT house_id, owner_id 
      FROM room_details 
      WHERE room_id = ?
    `;
    
    db.query(query, [roomId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error('Room not found'));
      resolve(results[0]);
    });
  });
};

// Create a new booking - Updated to expect user_id from request body
// Create a new booking - Updated to include user_name
export const createBooking = (bookingData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO book_room 
      (user_id, user_name, owner_id, house_id, room_id, from_date, to_date, from_time, to_time, user_location, user_job_occupation, booking_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    
    const values = [
      bookingData.user_id,
      bookingData.user_name,
      bookingData.owner_id,
      bookingData.house_id,
      bookingData.room_id,
      bookingData.from_date,
      bookingData.to_date,
      bookingData.from_time,
      bookingData.to_time,
      bookingData.user_location,
      bookingData.user_job_occupation
    ];
    
    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Check room availability
export const checkRoomAvailability = (roomId, fromDate, toDate, fromTime, toTime) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 1 FROM book_room
      WHERE room_id = ?
      AND (
        (from_date BETWEEN ? AND ?)
        OR (to_date BETWEEN ? AND ?)
        OR (? BETWEEN from_date AND to_date)
        OR (? BETWEEN from_date AND to_date)
      )
      AND (
        (from_time BETWEEN ? AND ?)
        OR (to_time BETWEEN ? AND ?)
        OR (? BETWEEN from_time AND to_time)
        OR (? BETWEEN from_time AND to_time)
      )
      AND booking_status != 'cancelled'
      LIMIT 1
    `;
    
    db.query(query, [
      roomId, fromDate, toDate, fromDate, toDate, fromDate, toDate,
      fromTime, toTime, fromTime, toTime, fromTime, toTime
    ], (err, results) => {
      if (err) return reject(err);
      resolve(results.length === 0); // true if available, false if conflicting booking exists
    });
  });
};

