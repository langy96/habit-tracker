function HabitItem({ habit, streak, onComplete, onShowStreak }) {
  return (
    <li>
      <div>
        <strong>{habit.name}</strong>
        <p>{habit.description}</p>
      </div>
      <button onClick={() => onComplete(habit.id)}>Mark Complete</button>
      <button onClick={() => onShowStreak(habit.id)}>Show Streak</button>
      {streak !== undefined && <p>Streak: {streak} day(s)</p>}
    </li>
  );
}

export default HabitItem;
