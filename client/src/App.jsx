import { useEffect, useState } from "react";
import "./App.css";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";

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

async function deleteHabit(id) {
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to delete habit");
    }

    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    setStreaks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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

      <HabitForm
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onSubmit={createHabit}
      />

      {error && <p className="error">{error}</p>}

      <HabitList
        habits={habits}
        streaks={streaks}
        onComplete={completeHabit}
        onShowStreak={fetchStreak}
        onDelete={deleteHabit}
      />
    </main>
  );
}

export default App;