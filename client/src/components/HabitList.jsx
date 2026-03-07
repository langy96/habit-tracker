import HabitItem from "./HabitItem";

function HabitList({
  habits,
  streaks,
  historyByHabit,
  onComplete,
  onUncomplete,
  onShowStreak,
  onHideStreak,
  onShowHistory,
  onHideHistory,
  onDelete,
  onEdit,
}) {
  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          streak={streaks[habit.id]}
          history={historyByHabit[habit.id]}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          onShowStreak={onShowStreak}
          onHideStreak={onHideStreak}
          onShowHistory={onShowHistory}
          onHideHistory={onHideHistory}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default HabitList;
