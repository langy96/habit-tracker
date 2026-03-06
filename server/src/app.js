require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const pool = require("./db/pool");
const habitsRouter = require("./routes/habits");

const app = express();
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = ["http://localhost:5173"];
const allowedOrigins = [...new Set([...configuredOrigins, ...defaultOrigins])];

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests and same-origin requests without an Origin header.
      if (!origin) return callback(null, true);

      const isRenderDomain = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(origin);
      if (allowedOrigins.includes(origin) || isRenderDomain) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
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