const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db");
const emailService = require("./email-service");
const cors = require("cors");

// Secret key for JWT signing (in production, store this securely)
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const port = 5001;

// Middleware to parse JSON bodies
app.use(express.json());

/* 
  CORS
*/
const corsOptionsDev = {
  credentials: true,
  origin: "http://localhost:3000",
  methods: ["POST", "GET"],
};
const corsOptionsProd = {
  credentials: true,
  allowedHeaders: ["Accept", "Content-Type"],
  origin: "http://localhost:5173",
  // url from DO eventualy    origin: "https://bbc-frontend-z6g9z.ondigitalocean.app",
  methods: ["POST", "GET"],
};
app.use(
  cors(app.get("env") === "production" ? corsOptionsProd : corsOptionsDev)
);

app.get("/", async (req, res) => {
  res.json({ message: "Ready to accept requests!" });
});

// User login route (POST request to authenticate)
app.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate One-Time-Passcode with 8 digits
    const passcode = Math.floor(10000000 + Math.random() * 90000000);

    // Save it to the database
    await db.savePasscode(validUser.UserId, passcode);

    // Send email with One-Time-Passcode
    await emailService.sendEmail(email, passcode);

    // Send response that passcode is sent to email
    res.json({ message: "Passcode sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" + err });
  }
});

// User registration route (POST request to register)
app.post("/register", async (req, res) => {
  const user = req.body;

  try {
    const existingUser = await db.findUserByEmail(user.emailId);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Save user to database
    await db.saveUser(user);

    res.json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/validate_otp", async (req, res) => {
  const { email, passcode } = req.body;

  try {
    const validUser = await db.findUserByEmail(email);

    const isValid = await db.isPasscodeValid(validUser.UserId, passcode);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // If OTP is valid, generate access token and send it in the response
    const token = jwt.sign(
      { userId: validUser.UserId, emailId: validUser.EmailID },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Extend the token validity
app.post("/refresh_token", authenticateToken, (req, res) => {
  const token = jwt.sign(
    { id: req.user.id, email: req.user.email },
    JWT_SECRET,
    {
      expiresIn: "1h", // Token expires in 1 hour
    }
  );

  res.json({ token });
});

// Get all Active Polls
app.get("/api/poll", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const polls = await db.getAllPolls();

    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create a new Poll
app.post("/api/poll", authenticateToken, async (req, res) => {
  const newPoll = req.body;

  // Validate the input
  if (!newPoll.QuestionText || newPoll.QuestionText.length <= 10) {
    return res.status(400).json({ message: "Invalid Poll Question" });
  }

  if (!newPoll.Options || newPoll.Options.length < 2) {
    return res.status(400).json({ message: "At least 2 options are required" });
  }

  for (const option of newPoll.Options) {
    if (!option || option.length == 0) {
      return res.status(400).json({ message: "Invalid Option Text" });
    }
  }

  if (!newPoll.ExpirationTime || newPoll.ExpirationTime <= new Date()) {
    return res.status(400).json({ message: "Invalid Poll Expiration Date" });
  }

  try {
    // Save to database
    await db.savePoll(newPoll, req.user.userId);

    // Return the new Poll
    res.status(201).json(newPoll);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/poll", authenticateToken, async (req, res) => {
  const existingPoll = req.body;

  // Validate the input
  if (!existingPoll.QuestionText || existingPoll.Options.length <= 10) {
    return res.status(400).json({ message: "Invalid Poll Question" });
  }

  if (existingPoll.Options.length < 2) {
    return res.status(400).json({ message: "At least 2 options are required" });
  }

  for (const option of existingPoll.Options) {
    if (!option.OptionText || option.OptionText.length == 0) {
      return res.status(400).json({ message: "Invalid Option Text" });
    }
  }

  if (
    !existingPoll.ExpirationTime ||
    existingPoll.ExpirationTime <= new Date()
  ) {
    return res.status(400).json({ message: "Invalid Poll Expiration Date" });
  }

  try {
    // Save to database
    await db.updatePoll(existingPoll);

    // Return the updated Poll
    res.status(201).json(existingPoll);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get the top 5 pollIDs based on the number of participants
app.get("/api/pollanswers", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const polls = await db.getPollAnswers();

    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/saveanswer", authenticateToken, async (req, res) => {});

// Get all comments
app.get("/api/comment", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const polls = await db.getComments();

    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/savecomment", authenticateToken, async (req, res) => {});

// Get all options
app.get("/api/options", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const polls = await db.getOptions();

    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Adds a comment to the database
app.post("/api/comment", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const polls = await db.saveComment();

    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
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

// Async function to get user by email from database
async function getUserByEmail(email) {
  const user = await db.findUserByEmail(email);
  return user;
}
