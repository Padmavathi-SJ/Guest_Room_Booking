import db from '../../DB/db.js';
import bcrypt from 'bcryptjs';

export const registerCustomer = (customerData) => {
  const { name, email, password, mobile_num } = customerData;
  
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, process.env.NODE_ENV === 'production' ? 10 : 8);
      
      const query = `
        INSERT INTO users
        (name, email, password, mobile_num)
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(query, [
        name, email, hashedPassword, mobile_num
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
        
        return resolve({ customerId: result.insertId });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const loginCustomer = async (email, password, mobile_num) => {
    const query = `SELECT * FROM users WHERE email = ? AND mobile_num = ?`;
    
    return new Promise((resolve, reject) => {
        db.query(query, [email, mobile_num], async (err, result) => {
            if(err) return reject(err);
            if(result.length === 0) {
                return reject({ message: "Customer not found with these credentials" });
            }
            
            const customer = result[0];
            const isMatch = await bcrypt.compare(password, customer.password);
            
            if(!isMatch) {
                return reject({ message: "Invalid credentials" });
            }
            
            // Return customer data without password
            const { password: _, ...customerData } = customer;
            return resolve(customerData);
        });
    });
};