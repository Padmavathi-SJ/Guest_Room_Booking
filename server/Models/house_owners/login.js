import  db  from '../../DB/db.js';
import bcrypt from 'bcryptjs';

export const registerOwner = (ownerData) => {
  const { name, email, password, mobile_num, permanent_address, city, state } = ownerData;
  const temp_address = ownerData.temp_address || null;
  
  return new Promise(async (resolve, reject) => {
    try {
      // Consider reducing the salt rounds for development
      const hashedPassword = await bcrypt.hash(password, process.env.NODE_ENV === 'production' ? 10 : 8);
      
      const query = `
        INSERT INTO house_owner 
        (name, email, password, mobile_num, permanent_address, temp_address, city, state)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(query, [
        name, email, hashedPassword, mobile_num, 
        permanent_address, temp_address, city, state
      ], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return reject({ message: "Email already exists" });
          }
          return reject(err);
        }
        
        if (result.affectedRows === 0) {
          return reject({ message: "Registration failed" });
        }
        
        return resolve({ ownerId: result.insertId });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const loginOwner = async (email, password, mobile_num) => {
    const query = `SELECT * FROM house_owner WHERE email = ? AND mobile_num = ?`;
    
    return new Promise((resolve, reject) => {
        db.query(query, [email, mobile_num], async (err, result) => {
            if(err) return reject(err);
            if(result.length === 0) {
                return reject({ message: "Owner not found with these credentials" });
            }
            
            const owner = result[0];
            const isMatch = await bcrypt.compare(password, owner.password);
            
            if(!isMatch) {
                return reject({ message: "Invalid credentials" });
            }
            
            // Return owner data without password
            const { password: _, ...ownerData } = owner;
            return resolve(ownerData);
        });
    });
};
