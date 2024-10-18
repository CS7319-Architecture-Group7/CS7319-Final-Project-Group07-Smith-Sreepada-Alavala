const mysql = require("mysql2");

// Create a MySQL connection pool

//const sqlConnectionString = process.env(sqlConnection);
//const db.createPool(sqlConnectionString).promise();

const db = mysql.createPool({
  host: "localhost", // Your MySQL host
  user: "root", // Your MySQL username
  password: "password", // Your MySQL password
  database: "poll_app_db", // Your MySQL database name
});

// Function to query the database
function findUserByEmail(email, callback) {
  const query = "SELECT * FROM User WHERE EmailID = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results[0]); // Returns the first result or undefined if not found
  });
}

module.exports = { findUserByEmail };
