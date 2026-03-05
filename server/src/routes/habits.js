const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// Get all habits
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, name, description, created_at
       FROM habits
       ORDER BY id ASC`);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch habits" });
    }
});

router.post('/', async (req, res) => {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO habits (name, description)
             VALUES ($1, $2)
             RETURNING id, name, description, created_at`,
             [name.trim(), description.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create habit" });
    }
});

router.post("/:id/complete", async (req, res) => {
    const habitId = Number(req.params.id);

    if (Number.isNaN(habitId)) {
        return res.status(400).json({ error: "Invalid habit ID" });
    }

        try {
            const result = await pool.query(
                `INSERT INTO habit_logs (habit_id, completed_on)
                VALUES ($1, CURRENT_DATE)
                RETURNING id, habit_id, completed_on, completed_at`,
                [habitId]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            if (error.code === "23505") {
                return res.status(409).json({ error: "Habit already completed today" });
            }

            if (error.code === "23503") {
                return res.status(404).json({ error: "Habit not found" });
            }

            res.status(500).json({ error: "Failed to complete habit" });
        }
});

router.get("/:id/streak", async (req, res) => {
  const habitId = Number(req.params.id);

  if (Number.isNaN(habitId)) {
    return res.status(400).json({ error: "Invalid habit ID" });
  }

  try {
    const result = await pool.query(
      `SELECT completed_on
       FROM habit_logs
       WHERE habit_id = $1
       ORDER BY completed_on DESC`,
      [habitId]
    );

    const dates = result.rows.map((row) => row.completed_on.toISOString().slice(0, 10));
    const dateSet = new Set(dates);

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      if (dateSet.has(key)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    res.json({ habitId, streak });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate streak" });
  }
});

module.exports = router;