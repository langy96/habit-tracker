function HabitForm({ name, description, onNameChange, onDescriptionChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="habit-form">
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Habit name"
        required
      />
      <input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Description (optional)"
      />
      <button type="submit">Add Habit</button>
    </form>
  );
}

export default HabitForm;
