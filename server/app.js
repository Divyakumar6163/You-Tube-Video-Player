require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sentimentRoutes = require("./routes/sentimentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://you-tube-video-player-chi.vercel.app",
      "http://localhost:5000",
      "https://you-tube-video-player.onrender.com",
      "https://you-tube-video-player.onrender.com/api",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api", sentimentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
