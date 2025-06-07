import express from 'express';
import "dotenv/config.js";
import mongoose from "mongoose";
import authRoutes from './routes/authRoute.js';
import cors from 'cors'
import postRoutes from './routes/postRoute.js';
import commentRoutes from './routes/commentRoute.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});