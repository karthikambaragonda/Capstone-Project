// import dotenv from 'dotenv';
// import mysql from 'mysql2/promise';

// dotenv.config();

// export const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || 'aa',
//     database: process.env.DB_NAME || 'ShopNestaa',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// export default pool;
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB1_HOST,
    user: process.env.DB1_USER,
    password: process.env.DB1_PASSWORD,
    database: process.env.DB1_NAME,
    port: process.env.DB1_PORT || 3306,
    ssl: {
        ca: fs.readFileSync("./DigiCertGlobalRootG2.crt.pem") // Path to SSL cert
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
export default pool;
