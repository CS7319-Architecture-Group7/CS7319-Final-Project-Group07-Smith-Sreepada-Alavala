const mysql = require("mysql2");
require("dotenv").config();

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST, // Your MySQL host
  user: process.env.DB_USER, // Your MySQL username
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_NAME, // Your MySQL database name
});

// Function to query the database
async function findUserByEmail(email) {
  const query = "SELECT * FROM User WHERE EmailID = ?";

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
  const query =
    "SELECT * FROM PassCode WHERE UserId = ? AND ExpirationDateTime > NOW()";

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) {
        return reject(err);
      }

      if (results.length > 0) {
        const updateQuery =
          "UPDATE PassCode SET ExpirationDateTime = DATE_ADD(NOW(), INTERVAL -5 MINUTE) WHERE UserId = ?";
        db.query(updateQuery, [userId], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } else {
        const insertQuery =
          "INSERT INTO PassCode (UserId, Code, ExpirationDateTime) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))";
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
  const query =
    "SELECT * FROM PassCode WHERE UserId = ? AND Code = ? AND ExpirationDateTime > NOW()";

  return new Promise((resolve, reject) => {
    db.query(query, [userId, passcode], (err, results) => {
      if (err) {
        return reject(err);
      }

      // Update the record to expire the passcode
      const updateQuery =
        "UPDATE Passcode SET ExpirationDateTime = DATE_ADD(NOW(), INTERVAL -5 MINUTE) WHERE UserId = ? AND Code = ?";
      db.query(updateQuery, [userId, passcode], (err) => {
        if (err) {
          return reject(err);
        }
      });

      resolve(results.length > 0); // Returns true if the passcode is valid
    });
  });
}

// Save new User to the database
async function saveUser(user) {
  const query =
    "INSERT INTO User (FirstName, LastName, EmailID) VALUES (?, ?, ?)";

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [user.firstName, user.lastName, user.emailId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      }
    );
  });
}

async function getActivePolls() {
  const query = "SELECT * FROM Poll WHERE ExpirationDateTime > NOW()";

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getAllPolls() {
  const query = "SELECT * FROM Poll";

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getPollById(pollId) {
  const query = `SELECT * FROM Poll WHERE PollID=${pollId};`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getPollsTop3() {
  const query =
    "SELECT a.PollId, COUNT(*) as Partcipants, b.QuestionText FROM PollAnswer AS a JOIN Poll AS b  ON a.PollID = b.PollID GROUP BY 1, 3 ORDER BY 2 DESC LIMIT 3;";

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function savePoll(poll, userId) {
  const query =
    "INSERT INTO Poll (QuestionText, UserId, ExpirationDateTime) VALUES (?, ?, ?)";

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [poll.QuestionText, userId, poll.ExpirationTime],
      (err, results) => {
        if (err) {
          return reject(err);
        }

        const pollId = results.insertId;

        const optionsQuery =
          "INSERT INTO PollOption (PollId, OptionText) VALUES (?, ?)";
        const promises = poll.Options.map((option) => {
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
      }
    );
  });
}

async function updatePoll(poll, userId) {}

async function getPollOptions() {
  const query = `SELECT * FROM PollOption;`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getPollOptionsById(pollId) {
  const query = `SELECT OptionText, PollOptionId FROM PollOption WHERE PollId=${pollId};`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function savePollAnswer(answer, userId) {
  const query =
    "INSERT INTO PollAnswer (PollID, OptionID, UserID) VALUES (?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(
      query,
      [answer.PollId, answer.OptionId, userId],
      (err, results) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(results);
      }
    );
  });
}

async function getComments() {
  const query = "SELECT * FROM Comment";

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getCommentsById(pollId) {
  const query = `SELECT CommentID, Content, UserId, CreatedDate FROM Comment WHERE PollID=${pollId};`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      console.log(results);

      resolve(results);
    });
  });
}

async function saveComment(comment, userId) {
  const query =
    "INSERT INTO Comment (PollID, UserID, Content) VALUES (?, ?, ?)";
  console.log(comment);
  console.log(userId);
  console.log(query);

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [comment.PollId, userId, comment.Content],
      (err, results) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(results);
      }
    );
  });
}

async function getPollAnswers() {
  const query = "SELECT * FROM PollAnswer";

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getResultsById(pollId) {
  const query = `SELECT a.OptionID, COUNT(*) as Votes, b.OptionText FROM PollAnswer AS a JOIN PollOption AS b ON a.OptionID = b.PollOptionId WHERE a.PollID=${pollId} GROUP BY 1, 3;`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      console.log(results);

      resolve(results);
    });
  });
}

module.exports = {
  findUserByEmail,
  savePasscode,
  isPasscodeValid,
  saveUser,
  getActivePolls,
  getAllPolls,
  getPollById,
  getPollsTop3,
  savePoll,
  updatePoll,
  getPollOptions,
  getPollOptionsById,
  getPollAnswers,
  getResultsById,
  savePollAnswer,
  getComments,
  getCommentsById,
  saveComment,
};
