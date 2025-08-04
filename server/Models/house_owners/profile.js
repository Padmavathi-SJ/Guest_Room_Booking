import db from '../../DB/db.js';

export const getOwnerDetails = (owner_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        owner_id, name, email, mobile_num, 
        permanent_address, temp_address, 
        city, state, created_at
      FROM house_owner 
      WHERE owner_id = ?
    `;
    
    db.query(query, [owner_id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};



export const updateOwnerDetails = (ownerId, updateData) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE house_owner SET ? WHERE owner_id = ?';
    
    db.query(query, [updateData, ownerId], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows > 0);
    });
  });
};

export const checkEmailExists = (email, ownerId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT owner_id FROM house_owner WHERE email = ? AND owner_id != ?';
    
    db.query(query, [email, ownerId], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
};