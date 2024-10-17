const mysql = require('mysql2');

// Create a MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',      // Your MySQL host
  user: 'root',           // Your MySQL username
  password: 'password',   // Your MySQL password
  database: 'poll_app_db' // Your MySQL database name
});

// Function to query the database
function findUserByEmail(email, callback) {
  const query = 'SELECT * FROM User WHERE EmailID = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results[0]); // Returns the first result or undefined if not found
  });
};

function savePasscode(userId, passcode, callback) {
  const query = 'SELECT * FROM PassCode WHERE UserId = ? AND ExpirationTime > NOW()';

  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err);
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE PassCode SET ExpirationDateTime = DATE_ADD(NOW(), INTERVAL -5 MINUTE) WHERE UserId = ?';
      db.query(updateQuery, [userId], (err) => {
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    } else {
      const insertQuery = 'INSERT INTO PassCode (UserId, Code, ExpirationDateTime) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))';
      db.query(insertQuery, [userId, passcode], (err) => {
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    }
  });
};

module.exports = { findUserByEmail, savePasscode };