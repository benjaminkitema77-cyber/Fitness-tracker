import {
  getWorkouts,
  createWorkout,
  getGoals,
  createGoal,
  deleteGoal,
  getScheduledWorkouts,
  createScheduledWorkout,
  updateScheduledWorkout,
} from "./api.js";

import {
  validateWorkout,
  summarizeWorkouts,
  filterWorkouts,
} from "./workouts.js";

import { validateGoal, goalProgress } from "./goals.js";
import { renderWeeklyChart } from "./dashboard.js";

const $ = (selector) => document.querySelector(selector);

const workoutForm = $("#workout-form");
const goalForm = $("#goal-form");
const scheduleForm = $("#schedule-form");
const message = $("#app-message");
const plannerMessage = $("#planner-message");
const workoutList = $("#workouts-list");
const goalsList = $("#goals-list");
const scheduledList = $("#scheduled-workouts-list");
const categoryFilter = $("#category-filter");

let workouts = [];
let goals = [];
let scheduledWorkouts = [];

function today() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function showMessage(element, text, error = false) {
  if (!element) return;

  element.textContent = text;
  element.classList.toggle("error", error);
}

function renderStats() {
  const stats = summarizeWorkouts(workouts);

  $("#total-workouts").textContent = stats.totalWorkouts;
  $("#total-duration").textContent = stats.totalDuration;
  $("#weekly-workouts").textContent = stats.weeklyWorkouts;
  $("#active-goals").textContent = goals.length;

  renderWeeklyChart($("#weekly-chart"), workouts);
}

function renderWorkouts() {
  if (!workoutList || !categoryFilter) return;

  workoutList.replaceChildren();

  const visible = filterWorkouts(workouts, categoryFilter.value)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!visible.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 5;
    cell.textContent = "No workouts found.";

    row.append(cell);
    workoutList.append(row);

    return;
  }

  visible.forEach((workout) => {
    const row = document.createElement("tr");

    const values = [
      workout.exercise,
      workout.category,
      workout.date,
      `${workout.duration} min`,
    ];

    values.forEach((value, index) => {
      const cell = document.createElement("td");

      if (index === 1) {
        const badge = document.createElement("span");

        badge.className = "category-badge";
        badge.textContent = value;

        cell.append(badge);
      } else {
        cell.textContent = value;
      }

      row.append(cell);
    });

    // Keep the action column but do not add a workout delete button.
    row.append(document.createElement("td"));
    workoutList.append(row);
  });
}

function renderGoals() {
  if (!goalsList) return;

  goalsList.replaceChildren();

  if (!goals.length) {
    goalsList.textContent = "No goals yet. Add one above.";
    return;
  }

  goals.forEach((goal) => {
    const item = document.createElement("article");
    const line = document.createElement("div");
    const title = document.createElement("span");
    const percentage = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("div");
    const footer = document.createElement("div");
    const progress = document.createElement("span");
    const remove = document.createElement("button");

    const percent = goalProgress(goal, workouts);

    item.className = "goal-item";
    line.className = "goal-line";
    title.textContent = goal.title;
    percentage.textContent = `${percent}%`;

    track.className = "progress-track";
    fill.className = "progress-fill";
    fill.style.width = `${percent}%`;

    footer.className = "goal-foot";

    progress.textContent =
      `${Math.min(workouts.length, Number(goal.target))} of ${goal.target} workouts`;

    remove.className = "text-button";
    remove.type = "button";
    remove.textContent = "Remove";

    remove.addEventListener("click", async () => {
      try {
        await deleteGoal(goal.id);

        goals = goals.filter((saved) => saved.id !== goal.id);

        renderAll();
        showMessage(message, "Goal removed.");
      } catch (error) {
        showMessage(message, error.message, true);
      }
    });

    line.append(title, percentage);
    track.append(fill);
    footer.append(progress, remove);
    item.append(line, track, footer);
    goalsList.append(item);
  });
}

function workoutDate(workout) {
  return new Date(`${workout.date}T${workout.time}`);
}

function renderScheduledWorkouts() {
  if (!scheduledList) return;

  scheduledList.replaceChildren();

  const sorted = [...scheduledWorkouts].sort(
    (a, b) => workoutDate(a) - workoutDate(b)
  );

  const plannedCount = $("#planned-count");
  const completedCount = $("#completed-count");

  if (plannedCount) {
    plannedCount.textContent = sorted.filter(
      (item) =>
        item.status === "Planned" ||
        item.status === "In Progress"
    ).length;
  }

  if (completedCount) {
    completedCount.textContent = sorted.filter(
      (item) => item.status === "Completed"
    ).length;
  }

  if (!sorted.length) {
    scheduledList.textContent = "No scheduled workouts yet.";
    return;
  }

  sorted.forEach((workout) => {
    const card = document.createElement("article");
    const title = document.createElement("h4");
    const details = document.createElement("p");
    const status = document.createElement("span");

    card.className = "scheduled-workout-card";
    title.textContent = workout.exercise;

    const date = workoutDate(workout);

    details.textContent =
      `${workout.category} · ${date.toLocaleDateString()} · ` +
      `${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} · ${workout.duration} minutes`;

    status.className = "workout-status";
    status.textContent = workout.status || "Planned";

    card.append(title, details, status);

    if (workout.notes) {
      const notes = document.createElement("p");

      notes.textContent = workout.notes;
      card.append(notes);
    }

    if (workout.status !== "Completed") {
      const actions = document.createElement("div");

      actions.className = "scheduled-workout-actions";

      if (workout.status !== "In Progress") {
        const start = document.createElement("button");

        start.type = "button";
        start.className = "button secondary";
        start.textContent = "Start workout";

        start.addEventListener("click", () => {
          changeStatus(workout, "In Progress");
        });

        actions.append(start);
      }

      const complete = document.createElement("button");

      complete.type = "button";
      complete.className = "button primary";
      complete.textContent = "Mark completed";

      complete.addEventListener("click", () => {
        changeStatus(workout, "Completed");
      });

      actions.append(complete);
      card.append(actions);
    }

    scheduledList.append(card);
  });
}

async function changeStatus(workout, status) {
  try {
    await updateScheduledWorkout(workout.id, { status });

    scheduledWorkouts = scheduledWorkouts.map((item) =>
      item.id === workout.id ? { ...item, status } : item
    );

    renderScheduledWorkouts();

    showMessage(
      plannerMessage,
      `${workout.exercise} marked ${status.toLowerCase()}.`
    );
  } catch (error) {
    showMessage(plannerMessage, error.message, true);
  }
}

function renderAll() {
  renderStats();
  renderWorkouts();
  renderGoals();
  renderScheduledWorkouts();
}

if (workoutForm) {
  workoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(workoutForm));
    const errors = validateWorkout(data);

    if (errors.length) {
      showMessage(message, errors.join(" "), true);
      return;
    }

    try {
      const saved = await createWorkout({
        exercise: data.exercise.trim(),
        category: data.category,
        duration: Number(data.duration),
        date: data.date,
        notes: data.notes.trim(),
      });

      workouts.push(saved);
      workoutForm.reset();

      const workoutDateInput = $("#workout-date");

      if (workoutDateInput) {
        workoutDateInput.value = today();
      }

      renderAll();
      showMessage(message, "Workout saved.");
    } catch (error) {
      showMessage(message, error.message, true);
    }
  });
}

if (goalForm) {
  goalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(goalForm));
    const errors = validateGoal(data);

    if (errors.length) {
      showMessage(message, errors.join(" "), true);
      return;
    }

    try {
      const saved = await createGoal({
        title: data.title.trim(),
        target: Number(data.target),
        current: 0,
      });

      goals.push(saved);
      goalForm.reset();

      const targetInput = $("#goal-target");

      if (targetInput) {
        targetInput.value = "4";
      }

      renderAll();
      showMessage(message, "Goal added.");
    } catch (error) {
      showMessage(message, error.message, true);
    }
  });
}

if (scheduleForm) {
  scheduleForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(scheduleForm));
    const date = new Date(`${data.date}T${data.time}`);

    if (!Number.isFinite(date.getTime()) || date <= new Date()) {
      showMessage(
        plannerMessage,
        "Choose a future date and time.",
        true
      );
      return;
    }

    if (!data.exercise.trim() || Number(data.duration) < 1) {
      showMessage(
        plannerMessage,
        "Enter valid workout details.",
        true
      );
      return;
    }

    try {
      const saved = await createScheduledWorkout({
        exercise: data.exercise.trim(),
        category: data.category,
        date: data.date,
        time: data.time,
        duration: Number(data.duration),
        notes: data.notes.trim(),
      });

      scheduledWorkouts.push(saved);
      scheduleForm.reset();

      const scheduledDateInput = $("#scheduled-date");
      const scheduledDurationInput = $("#scheduled-duration");

      if (scheduledDateInput) {
        scheduledDateInput.value = today();
      }

      if (scheduledDurationInput) {
        scheduledDurationInput.value = "30";
      }

      renderScheduledWorkouts();
      showMessage(plannerMessage, "Workout scheduled.");
    } catch (error) {
      showMessage(plannerMessage, error.message, true);
    }
  });
}

const notificationButton = $("#enable-notifications");

if (notificationButton) {
  notificationButton.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      showMessage(
        plannerMessage,
        "Notifications are not supported.",
        true
      );
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      showMessage(
        plannerMessage,
        permission === "granted"
          ? "Reminders enabled. Keep FitTrack open to receive them."
          : "Notifications are disabled.",
        permission !== "granted"
      );
    } catch {
      showMessage(
        plannerMessage,
        "Could not enable notifications.",
        true
      );
    }
  });
}

function checkReminders() {
  if (
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  const now = Date.now();

  scheduledWorkouts.forEach(async (workout) => {
    if (workout.status !== "Planned" || workout.reminderSent) {
      return;
    }

    const time = workoutDate(workout).getTime();

    if (time <= now || time - now > 60_000) {
      return;
    }

    new Notification("FitTrack workout reminder", {
      body: `${workout.exercise} starts in less than a minute.`,
      tag: `fittrack-${workout.id}`,
    });

    try {
      await updateScheduledWorkout(workout.id, {
        reminderSent: true,
      });

      workout.reminderSent = true;
    } catch (error) {
      console.error("Could not save reminder status:", error);
    }
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", renderWorkouts);
}

async function init() {
  const workoutDateInput = $("#workout-date");
  const scheduledDateInput = $("#scheduled-date");
  const todayLabel = $("#today-label");

  if (workoutDateInput) {
    workoutDateInput.value = today();
  }

  if (scheduledDateInput) {
    scheduledDateInput.value = today();
  }

  if (todayLabel) {
    todayLabel.textContent = new Date()
      .toLocaleDateString("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  }

  try {
    [workouts, goals, scheduledWorkouts] = await Promise.all([
      getWorkouts(),
      getGoals(),
      getScheduledWorkouts(),
    ]);

    renderAll();
    checkReminders();

    window.setInterval(checkReminders, 15000);
  } catch (error) {
    showMessage(
      message,
      `${error.message} Check that JSON Server is running.`,
      true
    );
  }
}

init();