import { useCallback, useEffect, useState } from "react";
import "./App.css";
import HabitForm from "./components/HabitForm";
import HabitList from "./components/HabitList";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [streaks, setStreaks] = useState({});
  const [historyByHabit, setHistoryByHabit] = useState({});

  const authHeaders = useCallback((extra = {}) => {
    return {
      ...extra,
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const endpoint = authMode === "register" ? "register" : "login";
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthPassword("");
      setAuthEmail("");
      setError("");
    } catch (authError) {
      setError(authError.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken("");
    setHabits([]);
    setStreaks({});
    setName("");
    setDescription("");
    setError("");
  }

  const fetchHabits = useCallback(async () => {
    try {
      setError("");
      const res = await fetch(`${API_URL}/habits`, {
        headers: authHeaders(),
      });

      if (res.status === 401) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      }

      if (!res.ok) throw new Error("Failed to load habits");
      const data = await res.json();
      setHabits(data);
    } catch (error) {
      setError(error.message);
    }
  }, [authHeaders]);

async function fetchStreak(id) {
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits/${id}/streak`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch streak");
    const data = await res.json();
    setStreaks((prev) => ({ ...prev, [id]: data.streak }));
  } catch (error) {
    setError(error.message);
  }
}

function hideStreak(id) {
  setStreaks((prev) => {
    const next = { ...prev };
    delete next[id];
    return next;
  });
}

async function fetchHistory(id) {
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits/${id}/history`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to fetch history");
    }

    const data = await res.json();
    setHistoryByHabit((prev) => ({ ...prev, [id]: data.history }));
  } catch (historyError) {
    setError(historyError.message);
  }
}

function hideHistory(id) {
  setHistoryByHabit((prev) => {
    const next = { ...prev };
    delete next[id];
    return next;
  });
}

async function createHabit(e) {
  e.preventDefault();
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
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
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to complete habit");
    }
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed_today: true } : habit
      )
    );
  } catch (error) {
    setError(error.message);
  }
}

async function uncompleteHabit(id) {
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits/${id}/complete`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to unmark completion");
    }
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed_today: false } : habit
      )
    );
  } catch (error) {
    setError(error.message);
  }
}

async function deleteHabit(id) {
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
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
    setHistoryByHabit((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  } catch (error) {
    setError(error.message);
  }
}

async function updateHabit(id, updatedName, updatedDescription) {
  try {
    setError("");
    const res = await fetch(`${API_URL}/habits/${id}`, {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ name: updatedName, description: updatedDescription }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update habit");
    }

    const savedHabit = await res.json();
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, ...savedHabit } : habit
      )
    );
  } catch (error) {
    setError(error.message);
    throw error;
  }
}

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchHabits();
  }, [fetchHabits, token]);

  if (!token) {
    return (
      <main className="app auth-shell">
        <h1>Habit Tracker</h1>
        <p className="auth-subtitle">
          {authMode === "register" ? "Create your account" : "Welcome back"}
        </p>

        <form onSubmit={handleAuthSubmit} className="habit-form auth-form">
          <input
            type="email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
          />
          <button type="submit">
            {authMode === "register" ? "Create Account" : "Login"}
          </button>
        </form>

        <button
          className="auth-switch"
          onClick={() => setAuthMode((prev) => (prev === "login" ? "register" : "login"))}
        >
          {authMode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>

        {error && <p className="error">{error}</p>}
      </main>
    );
  }

  return (
    <main className="app">
      <div className="app-top">
        <h1>Habit Tracker</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

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
        historyByHabit={historyByHabit}
        onComplete={completeHabit}
        onUncomplete={uncompleteHabit}
        onShowStreak={fetchStreak}
        onHideStreak={hideStreak}
        onShowHistory={fetchHistory}
        onHideHistory={hideHistory}
        onDelete={deleteHabit}
        onEdit={updateHabit}
      />
    </main>
  );
}

export default App;