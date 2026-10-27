module.exports = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.js$": "babel-jest" },
  collectCoverageFrom: ["src/workouts.js", "src/goals.js", "src/dashboard.js"],
  coverageThreshold: {
    global: { branches: 50, functions: 50, lines: 50, statements: 50 }
  },
};
