const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db");

// Example in-memory user data (in production, use a database)
const users = [
  {
    id: 1,
    email: "john@example.com",
    password: "$2a$10$7TO/t5KN8CpD7JKyC1uXu.JV7rTgVzMyUBGRY5zZs6R0k08Xg.qpS",
  }, // password: 'password123'
];

// Secret key for JWT signing (in production, store this securely)
const JWT_SECRET = "your_jwt_secret";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", async (req, res) => {
  // await db
  // .connect()
  // .then(async () => {
  //   // query the databse for project records
  //   polls = await db.getAllProjects();
  //   polls.forEach((item) => {
  //   // do stuff to data
  //   });
  res.json({ message: "Ready to accept requests!" });
});

// User login route (POST request to authenticate)
app.post("/login", async (req, res) => {
  const { email } = req.body;

  // Check if the user exists in database
  db.findUserByEmail(email, (err, user) => {});

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate One-Time-Passcode

  // Save it to the database

  // Send email with One-Time-Passcode

  // Send response that passcode is sent to email
});

app.post("/validate_otp", async (req, res) => {
  const { email, passcode } = req.body;

  // Retrieve User and Passcode from Database
  var user = { userId: 1, email: email };

  // Check the validity of the OTP

  // If OTP is valid, generate access token and send it in the response
  // Generate JWT token
  const token = jwt.sign({ id: user.userId, email: user.email }, JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  res.json({ token });

  // Else, send invalid OTP response
});

// Get all Active Polls
app.get("/api/poll", authenticateToken, (req, res) => {
  // Get all active polls from database

  // Send them in the respinse

  // DELETE this
  const polls = [
    {
      id: 1,
      question: "How do you feel?",
      options: ["Fine", "Just OK", "Good", "Not so good"],
    },
    { id: 2, question: "Are you ready to start?", options: ["Yes", "Not yet"] },
  ];
  res.json(polls);
});

app.post("/api/poll", authenticateToken, (req, res) => {
  const newPoll = req.body;

  // Validate the input

  // Save to database

  // Return the new Poll

  res.status(201).json(newPoll);
});

app.put("/api/poll", authenticateToken, (req, res) => {
  const existingPoll = req.body;

  // Validate the input

  // Save to database

  // Return the updated Poll

  res.status(201).json(existingPoll);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Middleware to check JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(403).json({ message: "Access Token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Add user info to request
    next(); // Proceed to the next middleware or route handler
  });
}
