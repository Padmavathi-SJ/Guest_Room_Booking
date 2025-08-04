import db from '../../DB/db.js';


export const getBookingsByUserId = (user_id, filter = 'current') => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        b.booking_id,
        b.user_id,
        b.user_name,
        b.owner_id,
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
        b.updated_at,
        r.room_name,
        r.room_picture,
        h.house_name,
        h.house_img,
        h.house_location
      FROM book_room b
      JOIN room_details r ON b.room_id = r.room_id
      JOIN house_details h ON b.house_id = h.house_id
      WHERE b.user_id = ?
    `;

    const params = [user_id];
    
    if (filter === 'current') {
      query += ` AND (b.booking_status = 'pending' OR b.booking_status = 'confirmed')`;
    } else if (filter === 'past') {
      query += ` AND (b.booking_status = 'completed' OR b.booking_status = 'cancelled')`;
    }

    query += ` ORDER BY b.from_date ${filter === 'current' ? 'ASC' : 'DESC'}`;

    db.query(query, params, (err, results) => {
      if (err) return reject(err);
      
      const formattedResults = results.map(booking => ({
        ...booking,
        from_time: booking.from_time ? booking.from_time.substring(0, 5) : null,
        to_time: booking.to_time ? booking.to_time.substring(0, 5) : null,
        from_date: booking.from_date.toISOString().split('T')[0],
        to_date: booking.to_date.toISOString().split('T')[0]
      }));
      
      resolve(formattedResults);
    });
  });
};

export const getBookingHistory = (user_id, filter = 'all') => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        b.booking_id,
        b.booking_status,
        b.from_date,
        b.to_date,
        b.from_time,
        b.to_time,
        b.user_job_occupation,
        b.user_location,
        b.created_at,
        b.updated_at,
        r.room_id,
        r.room_name,
        r.room_picture,
        h.house_id,
        h.house_name,
        h.house_img,
        h.house_location
      FROM book_room b
      JOIN room_details r ON b.room_id = r.room_id
      JOIN house_details h ON b.house_id = h.house_id
      WHERE b.user_id = ?
    `;

    const today = new Date().toISOString().split('T')[0];
    const params = [user_id];

    // Add filter conditions
    if (filter === 'current') {
      query += ` AND (b.booking_status = 'pending' OR b.booking_status = 'confirmed') 
                AND b.to_date >= ? 
                ORDER BY b.from_date ASC`;
      params.push(today);
    } else if (filter === 'past') {
      query += ` AND (b.booking_status = 'cancelled' OR b.booking_status = 'completed' OR b.to_date < ?) 
                ORDER BY b.from_date DESC`;
      params.push(today);
    } else {
      query += ` ORDER BY b.from_date DESC`;
    }

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return reject(new Error('Failed to fetch booking history'));
      }

      // Format the results
      const formattedResults = results.map(booking => ({
        ...booking,
        from_date: booking.from_date.toISOString().split('T')[0],
        to_date: booking.to_date.toISOString().split('T')[0],
        from_time: booking.from_time ? booking.from_time.substring(0, 5) : null,
        to_time: booking.to_time ? booking.to_time.substring(0, 5) : null,
        created_at: booking.created_at.toISOString(),
        updated_at: booking.updated_at.toISOString()
      }));

      resolve(formattedResults);
    });
  });
};