export function validateWorkout(input) {
  const errors = [];
  if (!input.exercise || !input.exercise.trim()) errors.push("Enter an exercise name.");
  if (!input.category) errors.push("Choose a workout category.");
  const duration = Number(input.duration);
  if (!Number.isFinite(duration) || duration < 1 || duration > 1440) {
    errors.push("Duration must be between 1 and 1440 minutes.");
  }
  if (!input.date || Number.isNaN(Date.parse(input.date))) errors.push("Choose a valid workout date.");
  return errors;
}

export function summarizeWorkouts(workouts, now = new Date()) {
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  const day = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - day);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekly = workouts.filter((workout) => {
    const date = new Date(`${workout.date}T00:00:00`);
    return date >= weekStart && date < weekEnd;
  });
  return {
    totalWorkouts: workouts.length,
    totalDuration: workouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0),
    weeklyWorkouts: weekly.length,
  };
}

export function filterWorkouts(workouts, category) {
  if (!category || category === "all") return [...workouts];
  return workouts.filter((workout) => workout.category === category);
}
