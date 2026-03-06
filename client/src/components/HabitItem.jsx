import { useState } from "react";

function HabitItem({
  habit,
  streak,
  onComplete,
  onUncomplete,
  onShowStreak,
  onHideStreak,
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
    <li>
      <div>
        {isEditing ? (
          <>
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
          </>
        ) : (
          <>
            <strong>{habit.name}</strong>
            <p>{habit.description}</p>
          </>
        )}
      </div>
      {habit.completed_today ? (
        <button onClick={() => onUncomplete(habit.id)}>Unmark Today</button>
      ) : (
        <button onClick={() => onComplete(habit.id)}>Mark Complete</button>
      )}
      {streak !== undefined ? (
        <button onClick={() => onHideStreak(habit.id)}>Hide Streak</button>
      ) : (
        <button onClick={() => onShowStreak(habit.id)}>Show Streak</button>
      )}
      {isEditing ? (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <button onClick={handleStartEdit}>Edit</button>
      )}
      <button onClick={() => onDelete(habit.id)}>Delete</button>
      {streak !== undefined && <p>Streak: {streak} day(s)</p>}
    </li>
  );
}

export default HabitItem;
