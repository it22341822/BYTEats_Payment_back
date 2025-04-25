const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Better error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Routes
app.use("/api", paymentRoutes);

// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});