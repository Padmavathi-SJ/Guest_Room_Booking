import db from '../../DB/db.js';

export const getHousesWithOwners = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        h.house_id,
        h.house_name,
        h.total_rooms,
        h.house_location,
        h.house_img,
        h.availability,
        h.city,
        h.state,
        h.created_at,
        o.owner_id,
        o.name AS owner_name,
        o.mobile_num AS owner_contact
      FROM 
        house_details h
      JOIN 
        house_owner o ON h.owner_id = o.owner_id
      WHERE 
        h.availability = 'available'
      ORDER BY 
        h.created_at DESC
    `;

    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const getHouseByIdWithOwner = (houseId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        h.house_id,
        h.house_name,
        h.total_rooms,
        h.house_location,
        h.house_img,
        h.availability,
        h.city,
        h.state,
        h.created_at,
        o.owner_id,
        o.name AS owner_name,
        o.mobile_num AS owner_contact,
        o.email AS owner_email
      FROM 
        house_details h
      JOIN 
        house_owner o ON h.owner_id = o.owner_id
      WHERE 
        h.house_id = ?
    `;

    db.query(query, [houseId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) {
        return reject({ message: "House not found" });
      }
      resolve(results[0]);
    });
  });
};