import  db  from '../../DB/db.js';

export const insertHouseDetails = (houseData) => {
  const { 
    owner_id, 
    house_name, 
    total_rooms, 
    house_location, 
    city, 
    state,
    house_img // This will now be the filename
  } = houseData;
  
  const availability = houseData.availability || 'not available';

  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO house_details 
      (owner_id, house_name, total_rooms, house_location, availability, city, state, house_img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [
      owner_id, 
      house_name, 
      total_rooms, 
      house_location, 
      availability, 
      city, 
      state,
      house_img || null
    ], (err, result) => {
      if (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return reject({ message: "Owner does not exist" });
        }
        return reject(err);
      }
      
      return resolve({ 
        houseId: result.insertId,
        availability,
        house_img: house_img || null
      });
    });
  });
};



export const getOwnerHouses = (owner_id, availability = null) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM house_details WHERE owner_id = ?`;
    const params = [owner_id];

    if (availability) {
      query += ` AND availability = ?`;
      params.push(availability);
    }

    query += ` ORDER BY created_at DESC`;

    db.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};