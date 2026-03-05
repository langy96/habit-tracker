CREATE TABLE IF NOT EXISTS habits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_logs (
    id SERIAL PRIMARY KEY,
    habit_id INT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    completed_on DATE NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_habit_day UNIQUE (habit_id, completed_on)
);