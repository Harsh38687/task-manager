require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errorMiddleware } = require("./utils/errorHandler.js");
const compression = require("compression");
const rateLimiter = require("./middleware/rateLimiter.js");

const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
require("./services/schedulerService.js");

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(rateLimiter); // Apply to all routes

//Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/2fa", authRoutes);

// Middleware for compression (applied after all routes)
app.use(compression()); // Apply Gzip compression, Compress finalized responses
app.use(errorMiddleware);

//Database connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect("mongodb://localhost:27017/taskManagerBackend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
