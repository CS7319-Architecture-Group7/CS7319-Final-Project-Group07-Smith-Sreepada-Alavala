const mysql = require("mysql2");

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

async function getAllPolls(userId) {
  const query = "SELECT * FROM Poll WHERE UserId = ?";

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getPollById(pollId) {
  const query = "SELECT * FROM Poll WHERE PollID = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [pollId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getTopNPolls(pollCount = 10) {
  const query =
    "SELECT b.PollId, b.QuestionText, b.ExpirationDateTime, COUNT(a.PollAnswerId) as PollAnswerCount FROM PollAnswer AS a JOIN Poll AS b  ON a.PollID = b.PollID GROUP BY b.PollId, b.QuestionText, b.ExpirationDateTime ORDER BY COUNT(a.PollAnswerId) DESC LIMIT ?;";

  return new Promise((resolve, reject) => {
    db.query(query, [pollCount], (err, results) => {
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

async function updatePoll(poll, userId) {
  const query =
    "UPDATE Poll SET QuestionText= ?, UserId= ?, ExpirationDateTime = ? WHERE PollId = ?";

  const promise1 = new Promise((resolve, reject) => {
    db.query(
      query,
      [poll.QuestionText, userId, poll.ExpirationTime, poll.PollId],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
  // Create an array of promises for each OptionID
  const queries = poll.Options.map((option, index) => {
    console.log("Option " + " " + option + poll.Ids[index]);
    return new Promise((resolve, reject) => {
      // Check if the record exists with the specified PollID and OptionID
      const checkQuery =
        "SELECT * FROM PollOption WHERE PollId = ? AND OptionText = ?";
      db.query(checkQuery, [poll.PollId, option], (err, results) => {
        if (err) {
          return reject(err);
        }

        if (results.length > 0) {
          console.log("Found ", option);
          // Record exists, update it
          const updateQuery =
            "UPDATE PollOption SET OptionText = ? WHERE PollId = ? AND PollOptionId = ?";
          db.query(
            updateQuery,
            [option, poll.PollId, poll.Ids[index]],
            (err, updateResult) => {
              if (err) return reject(err);
              console.log(
                "updated poll option " + option + " " + poll.Ids[index]
              );
              resolve(updateResult);
            }
          );
        } else {
          console.log("Didnt find");
          // Record does not exist, insert a new one
          const insertQuery =
            "INSERT INTO PollOption (PollId, OptionText) VALUES (?, ?)";
          db.query(insertQuery, [poll.PollId, option], (err, insertResult) => {
            if (err) return reject(err);
            console.log("inserted poll option " + option);
            resolve(insertResult);
          });
        }
      });
    });
  });

  // Use Promise.all to resolve once all queries are complete
  return Promise.all([promise1, ...queries])
    .then((results) => {
      return results;
    })
    .catch(reject);
}

async function deletePoll(pollId) {
  const queries = [
    `DELETE FROM PollAnswer WHERE PollId = ?;`,
    `DELETE FROM Comment WHERE PollId = ?;`,
    `DELETE FROM PollOption WHERE PollId = ?;`,
    `DELETE FROM Poll WHERE PollId = ?;`
  ];

  const promises = queries.map((query) => {
    return new Promise((resolve, reject) => {
      db.query(query, [pollId], (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
  return Promise.all(promises);
}

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

async function getPollOptionsByPollIdList(pollIdList) {
  const query = `SELECT * FROM PollOption WHERE PollId IN (?)`;
  return new Promise((resolve, reject) => {
    db.query(query, [pollIdList], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

async function getPollOptionsByPollId(pollId) {
  const query = `SELECT OptionText, PollOptionId FROM PollOption WHERE PollId = ?;`;
  return new Promise((resolve, reject) => {
    db.query(query, [pollId], (err, results) => {
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
  const query = `SELECT CommentID, Content, UserId, CreatedDate FROM Comment WHERE PollID = ?;`;
  return new Promise((resolve, reject) => {
    db.query(query, [pollId], (err, results) => {
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

async function getPollAnswersByPollIdList(pollIdList) {
  const query = `SELECT * FROM PollAnswer WHERE PollId IN (?);`;
  return new Promise((resolve, reject) => {
    db.query(query, [pollIdList], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
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
  const query = `SELECT a.OptionID, COUNT(*) as Votes, b.OptionText FROM PollAnswer AS a JOIN PollOption AS b ON a.OptionID = b.PollOptionId WHERE a.PollID = ? GROUP BY 1, 3;`;
  return new Promise((resolve, reject) => {
    db.query(query, [pollId], (err, results) => {
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
  getTopNPolls,
  savePoll,
  updatePoll,
  deletePoll,
  getPollOptions,
  getPollOptionsByPollIdList,
  getPollAnswersByPollIdList,
  getPollOptionsByPollId,
  getPollAnswers,
  getResultsById,
  savePollAnswer,
  getComments,
  getCommentsById,
  saveComment,
};
