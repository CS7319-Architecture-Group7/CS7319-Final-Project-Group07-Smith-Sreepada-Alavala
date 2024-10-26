const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,      // Your MySQL host
  user: process.env.DB_USER,           // Your MySQL username
  password: process.env.DB_PASSWORD,   // Your MySQL password
  database: process.env.DB_NAME // Your MySQL database name
});

// Function to query the database
async function findUserByEmail(email) {
  const query = 'SELECT * FROM User WHERE EmailID = ?';

  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]); // Returns the first result or undefined if not found
    });
  });
}

async function savePasscode(userId, passcode) {
  const query = 'SELECT * FROM PassCode WHERE UserId = ? AND ExpirationDateTime > NOW()';

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) {
        return reject(err);
      }

      if (results.length > 0) {
        const updateQuery = 'UPDATE PassCode SET ExpirationDateTime = DATE_ADD(NOW(), INTERVAL -5 MINUTE) WHERE UserId = ?';
        db.query(updateQuery, [userId], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } else {
        const insertQuery = 'INSERT INTO PassCode (UserId, Code, ExpirationDateTime) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))';
        db.query(insertQuery, [userId, passcode], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }
    });
  });
}

async function isPasscodeValid(userId, passcode) {
  const query = 'SELECT * FROM PassCode WHERE UserId = ? AND Code = ? AND ExpirationDateTime > NOW()';

  return new Promise((resolve, reject) => {
    db.query(query, [userId, passcode], (err, results) => {
      if (err) {
        return reject(err);
      }

      // Update the record to expire the passcode
      const updateQuery = 'UPDATE Passcode SET ExpirationDateTime = DATE_ADD(NOW(), INTERVAL -5 MINUTE) WHERE UserId = ? AND Code = ?';
      db.query(updateQuery, [userId, passcode], (err) => {
        if (err) {
          return reject(err);
        }
      });

      resolve(results.length > 0); // Returns true if the passcode is valid
    });
  });
}

async function getActivePolls() {
  const query = 'SELECT * FROM Poll WHERE ExpirationDateTime > NOW()';

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function voteInPoll(userId, pollId, optionId) {
  const checkPollQuery = 'SELECT * FROM Poll WHERE PollId = ? AND ExpirationDateTime > NOW()';
  const insertVoteQuery = 'INSERT INTO PollAnswer (PollId, OptionId, UserId) VALUES (?, ?, ?)';
  
  return new Promise((resolve, reject) => {
    db.query(checkPollQuery, [pollId], (err, results) => {
      if (err) {
        return reject(err);
      }

      if (results.length === 0) {
        return reject(new Error('Poll has expired or does not exist'));
      }

      db.query(insertVoteQuery, [pollId, optionId, userId], (err) => {
        if (err) {
          return reject(err);
        }

        // TODO: Update PollResult table with latest vote
      });
    });
  });
}

// Save new User to the database
async function saveUser(user) {
  const query = 'INSERT INTO User (FirstName, LastName, EmailID) VALUES (?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.query(query, [user.firstName, user.lastName, user.emailId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

async function savePoll(poll, userId) {
  const query = 'INSERT INTO Poll (QuestionText, UserId, ExpirationDateTime) VALUES (?, ?, ?)';

  return new Promise((resolve, reject) => {
    db.query(query, [poll.QuestionText, userId, poll.ExpirationTime], (err, results) => {
      if (err) {
        return reject(err);
      }

      const pollId = results.insertId;

      const optionsQuery = 'INSERT INTO PollOption (PollId, OptionText) VALUES (?, ?)';
      const promises = poll.Options.map(option => {
        return new Promise((resolve, reject) => {
          db.query(optionsQuery, [pollId, option], (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      });

      Promise.all(promises)
        .then(() => resolve(results))
        .catch(reject);
    });
  });
}

module.exports = { 
  findUserByEmail, 
  savePasscode, 
  isPasscodeValid, 
  getActivePolls,
  savePoll,
  saveUser,
  voteInPoll
};