import { validateGoal, goalProgress } from "../src/goals.js";

describe("validateGoal", () => {
  test("accepts a valid goal", () => expect(validateGoal({ title: "Run weekly", target: 4 })).toEqual([]));
  test("rejects a missing title and invalid target", () => {
    expect(validateGoal({ title: " ", target: 0 }).length).toBeGreaterThan(0);
  });
});

describe("goalProgress", () => {
  test("calculates and caps progress", () => {
    expect(goalProgress({ target: 4, current: 3 })).toBe(75);
    expect(goalProgress({ target: 4, current: 8 })).toBe(100);
  });
});
