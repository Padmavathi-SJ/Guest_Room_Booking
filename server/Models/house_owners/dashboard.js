import db from '../../DB/db.js';

export const getOwnerDashboardStats = (owner_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        COUNT(DISTINCT hd.house_id) AS total_houses,
        COUNT(DISTINCT rd.room_id) AS total_rooms,
        COUNT(DISTINCT CASE WHEN rbd.availability = 'not available' THEN rbd.booking_id END) AS active_bookings,
        COALESCE(SUM(CASE WHEN rbd.availability = 'not available' THEN rbd.rent_amount_per_day END), 0) AS total_earnings
      FROM house_owner ho
      LEFT JOIN house_details hd ON ho.owner_id = hd.owner_id
      LEFT JOIN room_details rd ON hd.house_id = rd.house_id
      LEFT JOIN room_booking_details rbd ON rd.room_id = rbd.room_id
      WHERE ho.owner_id = ?
    `;
    
    db.query(query, [owner_id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) {
        return reject({ message: "No data found for this owner" });
      }
      resolve(result[0]);
    });
  });
};

export const getRecentPendingBookings = (owner_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        br.booking_id,
        br.user_name,
        br.user_job_occupation,
        br.from_date,
        br.to_date,
        br.from_time,
        br.to_time,
        br.booking_status,
        hd.house_id,  // Add this line to include house_id
        hd.house_name,
        hd.house_location,
        rd.room_name,
        rd.room_picture,
        rbd.rent_amount_per_day
      FROM book_room br
      JOIN house_details hd ON br.house_id = hd.house_id
      JOIN room_details rd ON br.room_id = rd.room_id
      LEFT JOIN room_booking_details rbd ON br.room_id = rbd.room_id
      WHERE br.owner_id = ? 
      AND br.booking_status = 'pending'
      ORDER BY br.created_at DESC
      LIMIT 5
    `;
    
    db.query(query, [owner_id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};