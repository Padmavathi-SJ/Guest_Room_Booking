import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


  
pool.getConnection((err, connection) => {
    if(err){
        console.log("database connection error", err.message);
    }
    else {
        console.log("database connected successfully");
        connection.release();
    }
})

export default pool;