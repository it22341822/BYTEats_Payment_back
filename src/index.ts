import express from "express";
import http from 'http';
import dotenv from "dotenv";
import statusRoutes from './routes/status.route';
import connectDB from "./config/dbConnect";
import paymentRoutes from "./routes/payment.route";
import cors from "cors";
import { initializeSocket } from './services/socketServices';

const app = express();
const PORT = process.env.PORT || 5003;
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json());
const server = http.createServer(app)

// Initialize Socket.IO
initializeSocket(server);

app.use("/api/payment", paymentRoutes);

// Routes
app.use('/api/statustrack', statusRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
