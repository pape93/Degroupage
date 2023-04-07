const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://pape93:tTNvRtDrSxBRAEZC@cluster0.quynr8t.mongodb.net/degroup";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const apiRouter = express.Router();

apiRouter.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Received login request:", { username, password });

  try {
    const user = await User.findOne({ username });

    console.log("Found user:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Is password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Password is invalid");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    console.log("Login successful");
    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add any other API routes to the apiRouter as well
// ...

// Use the apiRouter for all /api routes
app.use("/api", apiRouter);

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, "../client/dist/degroupage")));

// Handle any other routes excluding /api routes (this should be the last route)
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/degroupage/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
