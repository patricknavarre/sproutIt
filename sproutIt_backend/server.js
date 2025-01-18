const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB successfully connected");
    console.log("Connection state:", mongoose.connection.readyState);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/plants", require("./routes/plants"));
app.use("/api/gardens", require("./routes/gardens"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 3050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Available routes:");
  console.log("- /api/auth");
  console.log("- /api/plants");
  console.log("- /api/gardens");
});
