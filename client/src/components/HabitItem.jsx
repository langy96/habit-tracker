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
      </div>
    </li>
  );
}

export default HabitItem;
