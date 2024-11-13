require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db");
const emailService = require("./email-service");
const cors = require("cors");
const rabbitmqService = require("./rabbitmq");
const socketIO = require("socket.io");
const http = require("http");
const winston = require("winston");
const MySQLTransport = require("winston-mysql");

// Secret key for JWT signing (in production, store this securely)
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const port = 5001;

const server = http.createServer(app);
const io = socketIO(server, {
  path: "/socket.io",
  cors: {
    origin: "*", // Allow all origins, or specify specific origin like 'http://localhost:5000'
    methods: ["GET", "POST"], // Allow only necessary methods
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Middleware to parse JSON bodies
app.use(express.json());

// Logger
const options_custom = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  table: "Performance",
  fields: {
    level: "Level",
    meta: "Metadata",
    message: "Message",
    timestamp: "AddDate",
  },
};

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "performance" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new MySQLTransport(options_custom),
  ],
});

/* 
  CORS
*/
const corsOptionsDev = {
  credentials: true,
  origin: "http://localhost:3000",
  methods: ["POST", "GET", "PUT", "DELETE"],
};
const corsOptionsProd = {
  credentials: true,
  allowedHeaders: ["Accept", "Content-Type"],
  origin: "http://localhost:5173",
  // url from DO eventualy    origin: "https://bbc-frontend-z6g9z.ondigitalocean.app",
  methods: ["POST", "GET", "PUT", "DELETE"],
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
    console.log(passcode);
    // Save it to the database
    await db.savePasscode(validUser.UserId, passcode);

    // Send email with One-Time-Passcode
    await emailService.sendEmail(email, passcode);

    // Send response that passcode is sent to email
    res.json({ message: "Passcode sent to email", id: validUser.UserId });
  } catch (err) {
    console.log(err);
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

// Make a performance entry
app.post("/performance", authenticateToken, (req, res) => {
  let id = "Client-server";
  //let id = "Publish-subscribe";
  let method = req.body.method;
  let start = req.body.start;
  let end = req.body.end;
  let delta = req.body.delta;
  let payload = `from: ${id}, method: ${method}, millis: ${delta}, start: ${start}, end: ${end}`;
  logger.info(payload);
  res.json({ payload });
});

// Retrieve all performance data
app.get("/performance", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const polls = await db.getPerformanceData();

    res.json(polls);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all Polls
app.get("/api/poll", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const polls = await db.getAllPolls(validUser.UserId);

    res.json(polls);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/poll/:id", authenticateToken, async (req, res) => {
  const email = req.user.emailId;
  try {
    const validUser = await db.findUserByEmail(email);
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const poll = await db.getPollById(req.params.id);
    res.json(poll);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/pollpopular/:pollCount", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert pollCount to a number
    req.params.pollCount = parseInt(req.params.pollCount);
    const popularPolls = await db.getTopNPolls(req.params.pollCount);

    if (popularPolls.length !== 0) {
      const pollIdList = popularPolls.map((poll) => poll.PollId);
      if (pollIdList.length !== 0) {
        const pollOptions = await db.getPollOptionsByPollIdList(pollIdList);
        const pollAnswers = await db.getPollAnswersByPollIdList(pollIdList);

        // Add options and answers to each poll
        popularPolls.forEach((poll) => {
          poll.Options = pollOptions.filter(
            (option) => option.PollId === poll.PollId
          );
          poll.Answers = pollAnswers.filter(
            (answer) => answer.PollId === poll.PollId
          );
        });
      }
    }

    res.json(popularPolls);
  } catch (err) {
    console.log(err);
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

    // Publish PollResult message to RabbitMQ
    const channel = rabbitmqService.getChannel();
    channel.publish(
      rabbitmqService.exchangeName,
      "",
      Buffer.from(newPoll.PollId.toString())
    );

    // Return the new Poll
    res.status(201).json(newPoll);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/poll", authenticateToken, async (req, res) => {
  const existingPoll = req.body;

  // Validate the input
  // if (!existingPoll.QuestionText || existingPoll.QuestionText.length <= 10) {
  //   return res.status(400).json({ message: "Invalid Poll Question" });
  // }

  // if (existingPoll.Options.length < 2) {
  //   return res.status(400).json({ message: "At least 2 options are required" });
  // }

  // for (const OptionText of existingPoll.Options) {
  //   if (!OptionText || OptionText.length == 0) {
  //     return res.status(400).json({ message: "Invalid Option Text" });
  //   }
  // }

  if (
    !existingPoll.ExpirationTime ||
    existingPoll.ExpirationTime <= new Date()
  ) {
    return res.status(400).json({ message: "Invalid Poll Expiration Date" });
  }

  try {
    // Save to database
    await db.updatePoll(existingPoll, req.user.userId);

    // Publish PollResult message to RabbitMQ
    const channel = rabbitmqService.getChannel();
    channel.publish(
      rabbitmqService.exchangeName,
      "",
      Buffer.from(existingPoll.PollId.toString())
    );

    // Return the updated Poll
    res.status(201).json(existingPoll);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/poll", authenticateToken, async (req, res) => {
  const email = req.user.emailId;
  const existingPoll = req.body;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete from database
    const results = await db.deletePoll(existingPoll.PollId);

    // Publish message to RabbitMQ
    const channel = rabbitmqService.getChannel();
    channel.publish(
      rabbitmqService.exchangeName,
      "",
      Buffer.from(existingPoll.PollId.toString())
    );
    // Return the updated Poll
    res.status(201).json({ message: "Successfully deleted." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" + err });
  }
});

app.get("/api/polloption", authenticateToken, async (req, res) => {
  const email = req.user.emailId;
  try {
    const validUser = await db.findUserByEmail(email);
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const allOptions = await db.getPollOptions();
    res.json(allOptions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/polloption/:id", authenticateToken, async (req, res) => {
  const email = req.user.emailId;
  try {
    const validUser = await db.findUserByEmail(email);
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const options = await db.getPollOptionsByPollId(req.params.id);
    res.json(options);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/pollanswer", authenticateToken, async (req, res) => {
  const email = req.user.emailId;
  try {
    const validUser = await db.findUserByEmail(email);
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const allAnswers = await db.getPollAnswers();
    res.json(allAnswers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/pollanswer", authenticateToken, async (req, res) => {
  const newAnswer = req.body;
  // Validate the input

  try {
    // Save to database
    await db.savePollAnswer(newAnswer, req.user.userId);

    // Publish PollResult message to RabbitMQ
    const channel = rabbitmqService.getChannel();
    channel.publish(
      rabbitmqService.exchangeName,
      "",
      Buffer.from(newAnswer.PollId.toString())
    );

    // Return the new Answer
    res.status(201).json(newAnswer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/comment", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const comments = await db.getComments();

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/comment/:id", authenticateToken, async (req, res) => {
  const email = req.user.emailId;

  try {
    const validUser = await db.findUserByEmail(email);

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const comments = await db.getCommentsById(req.params.id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/comment", authenticateToken, async (req, res) => {
  const newComment = req.body;

  // Validate the input
  if (!newComment.Content || newComment.Content.length >= 500) {
    return res
      .status(400)
      .json({ message: "Comment should be between 1 and 500 characters" });
  }

  try {
    // Save to database
    await db.saveComment(newComment, req.user.userId);

    // Return the new Answer
    res.status(201).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/results/:id", authenticateToken, async (req, res) => {
  const email = req.user.emailId;
  try {
    const validUser = await db.findUserByEmail(email);
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const options = await db.getResultsById(req.params.id);
    res.json(options);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
server.listen(port, async () => {
  await rabbitmqService.createFanoutExchange();
  await setupPublishToClients();

  console.log(`Server running at http://localhost:${port}`);
});

const setupPublishToClients = async () => {
  const channel = rabbitmqService.getChannel();
  const q = await channel.assertQueue("", { exclusive: true });
  channel.bindQueue(q.queue, rabbitmqService.exchangeName, "");

  channel.consume(
    q.queue,
    (msg) => {
      db.getTopNPolls(10).then((popularPolls) => {
        if (popularPolls.length !== 0) {
          let pollIdList = popularPolls.map((poll) => poll.PollId);

          db.getPollOptionsByPollIdList(pollIdList).then((pollOptions) => {
            db.getPollAnswersByPollIdList(pollIdList).then((pollAnswers) => {
              // Add options and answers to each poll
              popularPolls.forEach((poll) => {
                poll.Options = pollOptions.filter(
                  (option) => option.PollId === poll.PollId
                );
                poll.Answers = pollAnswers.filter(
                  (answer) => answer.PollId === poll.PollId
                );
              });

              // Broadcast poll updates to all connected clients
              io.emit("pollUpdate", popularPolls);
            });
          });
        }
      });
    },
    { noAck: true }
  );
};

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
