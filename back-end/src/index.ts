import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import spinRoutes from "./routes/spinRoutes";
import adminRoutes from "./routes/adminRoutes";
import connectDB from "./config/db";

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

// Import routes
app.use("/api", spinRoutes);
app.use("/api/admin", adminRoutes);

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
