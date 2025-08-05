import db from '../../DB/db.js';

export const getUserDetails = (user_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        user_id, name, email, mobile_num, 
        created_at, updated_at
      FROM users 
      WHERE user_id = ?
    `;
    
    db.query(query, [user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};

export const updateUserDetails = (userId, updateData) => {
  return new Promise((resolve, reject) => {
    // Only allow these fields to be updated
    const allowedFields = ['name', 'email', 'password', 'mobile_num'];
    const filteredUpdateData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    });

    const query = 'UPDATE users SET ? WHERE user_id = ?';
    
    db.query(query, [filteredUpdateData, userId], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows > 0);
    });
  });
};

export const checkEmailExists = (email, userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT user_id FROM users WHERE email = ? AND user_id != ?';
    
    db.query(query, [email, userId], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
};