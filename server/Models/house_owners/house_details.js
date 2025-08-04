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


export const getHouseDetails = (house_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM house_details 
      WHERE house_id = ?
    `;
    
    db.query(query, [house_id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) {
        return reject({ message: "House not found" });
      }
      resolve(result[0]);
    });
  });
};

export const updateHouseDetails = (house_id, updateData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE house_details 
      SET 
        house_name = ?,
        total_rooms = ?,
        house_location = ?,
        house_img = ?,
        availability = ?,
        city = ?,
        state = ?
      WHERE house_id = ?
    `;
    
    const values = [
      updateData.house_name,
      updateData.total_rooms,
      updateData.house_location,
      updateData.house_img,
      updateData.availability,
      updateData.city,
      updateData.state,
      house_id
    ];

    db.query(query, values, (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) {
        return reject({ message: "House not found or no changes made" });
      }
      resolve({ message: "House updated successfully" });
    });
  });
};