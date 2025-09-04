// This is where the server starts and listens for incoming requests.
// It imports the necessary modules and sets up the server.
// It also imports the routes for authentication, events, bookings, and analytics.
// It also sets up error handling middleware.
// It also connects to the database and starts listening for incoming requests.
// It also exports the app object for testing purposes.
// To make it work, you need to have a .env file in the root directory with the necessary environment variables.
// You also need to have a MongoDB instance running on your machine.
// You also need to have Node.js and npm installed on your machine.

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("EventXStudio API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server Error" });

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});