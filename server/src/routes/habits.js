const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

// Get all habits
router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(`SELECT h.id,
     h.name,
     h.description,
     h.created_at,
     EXISTS (
     SELECT 1
     FROM habit_logs hl
     WHERE hl.habit_id = h.id
       AND hl.completed_on = CURRENT_DATE
     ) AS completed_today
     FROM habits h
     WHERE h.user_id = $1
     ORDER BY h.id ASC`, [userId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

router.post('/', async (req, res) => {
  const userId = req.user.id;
  const { name, description = "" } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const result = await pool.query(
        `INSERT INTO habits (user_id, name, description)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, name, description, created_at`,
         [userId, name.trim(), description.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create habit" });
    }
});

router.post("/:id/complete", async (req, res) => {
    const habitId = Number(req.params.id);
  const userId = req.user.id;

    if (Number.isNaN(habitId)) {
        return res.status(400).json({ error: "Invalid habit ID" });
    }

        try {
            const result = await pool.query(
                `INSERT INTO habit_logs (habit_id, completed_on)
                SELECT id, CURRENT_DATE
                FROM habits
                WHERE id = $1
                  AND user_id = $2
                RETURNING id, habit_id, completed_on, completed_at`,
                [habitId, userId]
            );

            if (result.rowCount === 0) {
              return res.status(404).json({ error: "Habit not found" });
            }

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

router.delete("/:id/complete", async (req, res) => {
  const habitId = Number(req.params.id);
  const userId = req.user.id;

  if (Number.isNaN(habitId)) {
    return res.status(400).json({ error: "Invalid habit ID" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM habit_logs hl
       USING habits h
       WHERE hl.habit_id = h.id
         AND h.id = $1
         AND h.user_id = $2
         AND hl.completed_on = CURRENT_DATE
       RETURNING hl.id`,
      [habitId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Habit is not completed today" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to unmark completion" });
  }
});

router.get("/:id/streak", async (req, res) => {
  const habitId = Number(req.params.id);
  const userId = req.user.id;

  if (Number.isNaN(habitId)) {
    return res.status(400).json({ error: "Invalid habit ID" });
  }

  try {
    const result = await pool.query(
      `SELECT 1 FROM habits WHERE id = $1 AND user_id = $2`,
      [habitId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const streakResult = await pool.query(
      `WITH RECURSIVE streak AS (
         SELECT CURRENT_DATE AS day, 0 AS count
         UNION ALL
         SELECT day - 1, count + 1
         FROM streak
         WHERE EXISTS (
           SELECT 1
           FROM habit_logs hl
           WHERE hl.habit_id = $1
             AND hl.completed_on = streak.day
         )
       )
       SELECT MAX(count) AS streak
       FROM streak`,
      [habitId]
    );

    res.json({ habitId, streak: Number(streakResult.rows[0].streak || 0) });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate streak" });
  }
});

router.delete("/:id", async (req, res) => {
  const habitId = Number(req.params.id);
  const userId = req.user.id;

  if (Number.isNaN(habitId)) {
    return res.status(400).json({ error: "Invalid habit ID" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM habits
       WHERE id = $1
         AND user_id = $2
       RETURNING id`,
      [habitId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete habit" });
  }
});

router.put("/:id", async (req, res) => {
  const habitId = Number(req.params.id);
  const userId = req.user.id;
  const { name, description = "" } = req.body;

  if (Number.isNaN(habitId)) {
    return res.status(400).json({ error: "Invalid habit ID" });
  }

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE habits
       SET name = $1,
           description = $2
       WHERE id = $3
         AND user_id = $4
       RETURNING id, name, description, created_at`,
      [name.trim(), description.trim(), habitId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update habit" });
  }
});

module.exports = router;