require('dotenv').config()
/*To make the connection works, a .env will be needed with your MySQL password. Declare the following env variable:
MYSQL_PASS=replacewithyourpassword
*/

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: process.env.MYSQL_PASS,
  database: 'team'
});

module.exports = db;