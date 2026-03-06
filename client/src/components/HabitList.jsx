import HabitItem from "./HabitItem";

function HabitList({ habits, streaks, onComplete, onUncomplete, onShowStreak, onDelete, onEdit }) {
  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          streak={streaks[habit.id]}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          onShowStreak={onShowStreak}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default HabitList;
