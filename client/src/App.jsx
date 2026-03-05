import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [streaks, setStreaks] = useState({});

  async function fetchHabits() {
    try {
      setError("");
      const res = await fetch(`${API_URL}/habits`);
      if (!res.ok) throw new Error("Failed to load habits");
      const data = await res.json();
      setHabits(data);
    } catch (error) {
      setError(error.message);
    }
}

async function fetchStreak(id) {
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits/${id}/streak`);
    if (!res.ok) throw new Error("Failed to fetch streak");
    const data = await res.json();
    setStreaks((prev) => ({ ...prev, [id]: data.streak }));
  } catch (error) {
    setError(error.message);
  }
}

async function createHabit(e) {
  e.preventDefault();
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) {
      throw new Error("Failed to create habit");
    }
    setName("");
    setDescription("");
    fetchHabits();
  } catch (error) {
    setError(error.message);
  }
}

async function completeHabit(id) {
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits/${id}/complete`, {
      method: "POST",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to complete habit");
    }
    alert("Completed for today");
  } catch (error) {
    setError(error.message);
  }
}

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <main className="app">
      <h1>Habit Tracker</h1>

      <form onSubmit={createHabit} className="habit-form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <button type="submit">Add Habit</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="habit-list">
        {habits.map((habit) => (
          <li key={habit.id}>
            <div>
              <strong>{habit.name}</strong>
              <p>{habit.description}</p>
            </div>
            <button onClick={() => completeHabit(habit.id)}>Mark Complete</button>
            <button onClick={() => fetchStreak(habit.id)}>Show Streak</button>
            {streaks[habit.id] !== undefined && <p>Streak: {streaks[habit.id]} day(s)</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;