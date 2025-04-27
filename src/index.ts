import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect";
import paymentRoutes from "./routes/payment.route";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5003;
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json());

app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
