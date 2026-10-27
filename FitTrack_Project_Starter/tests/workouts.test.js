import { validateWorkout, summarizeWorkouts, filterWorkouts } from "../src/workouts.js";

describe("validateWorkout", () => {
  test("accepts valid workout data", () => {
    expect(validateWorkout({ exercise: "Run", category: "Cardio", duration: 30, date: "2026-10-19" })).toEqual([]);
  });
  test("rejects empty exercise and invalid duration", () => {
    const errors = validateWorkout({ exercise: " ", category: "Cardio", duration: 0, date: "2026-10-19" });
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe("filterWorkouts", () => {
  const items = [{ category: "Cardio" }, { category: "Strength" }];
  test("returns all workouts for all filter", () => expect(filterWorkouts(items, "all")).toHaveLength(2));
  test("filters by category", () => expect(filterWorkouts(items, "Cardio")).toHaveLength(1));
});

describe("summarizeWorkouts", () => {
  test("calculates total workouts and duration", () => {
    const result = summarizeWorkouts([
      { date: "2026-10-19", duration: 30 },
      { date: "2026-10-18", duration: 45 },
    ], new Date("2026-10-19T12:00:00"));
    expect(result.totalWorkouts).toBe(2);
    expect(result.totalDuration).toBe(75);
    expect(result.weeklyWorkouts).toBe(2);
  });
});
