import { useState } from "react";

function formatHistoryDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function HabitItem({
  habit,
  streak,
  history,
  onComplete,
  onUncomplete,
  onShowStreak,
  onHideStreak,
  onShowHistory,
  onHideHistory,
  onDelete,
  onEdit,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description || "");

  async function handleSave() {
    await onEdit(habit.id, editName, editDescription);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditName(habit.name);
    setEditDescription(habit.description || "");
    setIsEditing(false);
  }

  function handleStartEdit() {
    setEditName(habit.name);
    setEditDescription(habit.description || "");
    setIsEditing(true);
  }

  return (
    <li className="habit-item">
      <div>
        {isEditing ? (
          <div className="habit-edit">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Habit name"
            />
            <input
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
        ) : (
          <div className="habit-copy">
            <strong>{habit.name}</strong>
            <p>{habit.description}</p>
          </div>
        )}
      </div>
      <div>
        <div className="habit-actions">
      {habit.completed_today ? (
        <button className="btn-mark" onClick={() => onUncomplete(habit.id)}>Unmark Today</button>
      ) : (
        <button className="btn-mark" onClick={() => onComplete(habit.id)}>Mark Complete</button>
      )}
      {streak !== undefined ? (
        <button className="btn-show" onClick={() => onHideStreak(habit.id)}>Hide Streak</button>
      ) : (
        <button className="btn-show" onClick={() => onShowStreak(habit.id)}>Show Streak</button>
      )}
      {history !== undefined ? (
        <button className="btn-show" onClick={() => onHideHistory(habit.id)}>Hide History</button>
      ) : (
        <button className="btn-show" onClick={() => onShowHistory(habit.id)}>Show History</button>
      )}
      {isEditing ? (
        <>
          <button className="btn-save" onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <button onClick={handleStartEdit}>Edit</button>
      )}
      <button className="btn-delete" onClick={() => onDelete(habit.id)}>Delete</button>
        </div>
      {streak !== undefined && <p className="habit-streak">Streak: {streak} day(s)</p>}
        {history !== undefined && (
          <div className="habit-history">
            <p>Recent completions:</p>
            {history.length === 0 ? (
              <p className="habit-history-empty">No completion records yet.</p>
            ) : (
              <ul>
                {history.map((date) => (
                  <li key={date}>{formatHistoryDate(date)}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export default HabitItem;
