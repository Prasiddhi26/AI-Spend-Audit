import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import auditRoutes from "./routes/auditRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();

connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api/audit", auditRoutes);
app.use("/api/lead", leadRoutes);
app.use("/api/audit", auditRoutes);

// test route 
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running successfully 🚀"
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});