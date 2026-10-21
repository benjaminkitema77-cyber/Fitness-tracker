export function validateGoal(input) {
  const errors = [];
  if (!input.title || !input.title.trim()) errors.push("Enter a goal name.");
  const target = Number(input.target);
  if (!Number.isInteger(target) || target < 1 || target > 1000) {
    errors.push("Goal target must be a whole number between 1 and 1000.");
  }
  return errors;
}

export function goalProgress(goal, workouts = []) {
  const target = Math.max(1, Number(goal.target) || 1);
  const relatedCount = goal.category
    ? workouts.filter((workout) => workout.category === goal.category).length
    : workouts.length;
  const current = Number.isFinite(Number(goal.current)) ? Number(goal.current) : relatedCount;
  return Math.min(100, Math.round((current / target) * 100));
}
