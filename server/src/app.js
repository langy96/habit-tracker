require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const pool = require("./db/pool");
const habitsRouter = require("./routes/habits");

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json());
app.use("/api/habits", habitsRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, dbTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Database connection failed" });
  }
});

module.exports = app;