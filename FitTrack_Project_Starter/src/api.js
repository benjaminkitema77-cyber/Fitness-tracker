// API module: all network requests are kept in one place.

const API_BASE_URL =
  typeof window !== "undefined" && window.FITTRACK_API_URL
    ? window.FITTRACK_API_URL.replace(/\/$/, "")
    : "http://localhost:3000";

async function request(resource, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/${resource}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the API. Make sure JSON Server is running."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status}). Please try again.`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Completed workout history

export const getWorkouts = () => request("workouts");

export const createWorkout = (workout) =>
  request("workouts", {
    method: "POST",
    body: JSON.stringify(workout),
  });

export const updateWorkout = (id, updates) =>
  request(`workouts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

export const replaceWorkout = (id, workout) =>
  request(`workouts/${id}`, {
    method: "PUT",
    body: JSON.stringify(workout),
  });

// Fitness goals

export const getGoals = () => request("goals");

export const createGoal = (goal) =>
  request("goals", {
    method: "POST",
    body: JSON.stringify(goal),
  });

export const updateGoal = (id, updates) =>
  request(`goals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

export const deleteGoal = (id) =>
  request(`goals/${id}`, {
    method: "DELETE",
  });

// Weekly workout planner

export const getScheduledWorkouts = () =>
  request("scheduledWorkouts");

export const createScheduledWorkout = (workout) =>
  request("scheduledWorkouts", {
    method: "POST",
    body: JSON.stringify({
      ...workout,
      status: "Planned",
      reminderSent: false,
    }),
  });

export const updateScheduledWorkout = (id, updates) =>
  request(`scheduledWorkouts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });