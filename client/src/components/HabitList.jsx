import HabitItem from "./HabitItem";

function HabitList({ habits, streaks, onComplete, onShowStreak }) {
  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          streak={streaks[habit.id]}
          onComplete={onComplete}
          onShowStreak={onShowStreak}
        />
      ))}
    </ul>
  );
}

export default HabitList;
