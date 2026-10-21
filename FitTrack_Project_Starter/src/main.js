import {
  getWorkouts, createWorkout, deleteWorkout, getGoals, createGoal, deleteGoal,
} from "./api.js";
import { validateWorkout, summarizeWorkouts, filterWorkouts } from "./workouts.js";
import { validateGoal, goalProgress } from "./goals.js";
import { renderWeeklyChart } from "./dashboard.js";

const $ = (selector) => document.querySelector(selector);
const workoutForm = $("#workout-form");
const goalForm = $("#goal-form");
const message = $("#app-message");
const workoutList = $("#workouts-list");
const goalsList = $("#goals-list");
const categoryFilter = $("#category-filter");
let workouts = [];
let goals = [];

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
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
  const visible = filterWorkouts(workouts, categoryFilter.value);
  workoutList.replaceChildren();
  if (!visible.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "No workouts found. Add a workout to get started.";
    row.append(cell); workoutList.append(row); return;
  }
  visible.sort((a, b) => b.date.localeCompare(a.date)).forEach((workout) => {
    const row = document.createElement("tr");
    const values = [workout.exercise, workout.category, workout.date, `${workout.duration} min`];
    values.forEach((value, index) => {
      const cell = document.createElement("td");
      if (index === 1) {
        const badge = document.createElement("span");
        badge.className = "category-badge";
        badge.textContent = value;
        cell.append(badge);
      } else cell.textContent = value;
      row.append(cell);
    });
    const actionCell = document.createElement("td");
    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete ${workout.exercise}`);
    remove.addEventListener("click", async () => {
      if (!window.confirm(`Delete "${workout.exercise}"?`)) return;
      try {
        await deleteWorkout(workout.id);
        workouts = workouts.filter((item) => item.id !== workout.id);
        renderAll();
        showMessage("Workout deleted.");
      } catch (error) { showMessage(error.message, true); }
    });
    actionCell.append(remove); row.append(actionCell); workoutList.append(row);
  });
}

function renderGoals() {
  goalsList.replaceChildren();
  if (!goals.length) {
    const empty = document.createElement("p");
    empty.className = "muted"; empty.textContent = "No goals yet. Add one above.";
    goalsList.append(empty); return;
  }
  goals.forEach((goal) => {
    const item = document.createElement("article");
    item.className = "goal-item";
    const line = document.createElement("div"); line.className = "goal-line";
    const title = document.createElement("span"); title.textContent = goal.title;
    const percent = goalProgress(goal, workouts);
    const percentLabel = document.createElement("span"); percentLabel.textContent = `${percent}%`;
    line.append(title, percentLabel);
    const track = document.createElement("div"); track.className = "progress-track";
    const fill = document.createElement("div"); fill.className = "progress-fill"; fill.style.width = `${percent}%`;
    track.append(fill);
    const foot = document.createElement("div"); foot.className = "goal-foot";
    const progressText = document.createElement("span"); progressText.textContent = `${Math.min(workouts.length, Number(goal.target))} of ${goal.target} workouts`;
    const remove = document.createElement("button"); remove.className = "text-button"; remove.type = "button"; remove.textContent = "Remove";
    remove.addEventListener("click", async () => {
      try {
        await deleteGoal(goal.id);
        goals = goals.filter((itemGoal) => itemGoal.id !== goal.id);
        renderAll(); showMessage("Goal removed.");
      } catch (error) { showMessage(error.message, true); }
    });
    foot.append(progressText, remove); item.append(line, track, foot); goalsList.append(item);
  });
}

function renderAll() { renderStats(); renderWorkouts(); renderGoals(); }

workoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(workoutForm).entries());
  const errors = validateWorkout(data);
  if (errors.length) { showMessage(errors.join(" "), true); return; }
  try {
    const saved = await createWorkout({
      exercise: data.exercise.trim(), category: data.category,
      duration: Number(data.duration), date: data.date, notes: data.notes.trim(),
    });
    workouts.push(saved);
    workoutForm.reset();
    $("#workout-date").value = new Date().toISOString().slice(0, 10);
    renderAll(); showMessage("Workout saved successfully.");
  } catch (error) { showMessage(error.message, true); }
});

goalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(goalForm).entries());
  const errors = validateGoal(data);
  if (errors.length) { showMessage(errors.join(" "), true); return; }
  try {
    const saved = await createGoal({ title: data.title.trim(), target: Number(data.target), current: 0 });
    goals.push(saved); goalForm.reset(); $("#goal-target").value = "4";
    renderAll(); showMessage("Goal added successfully.");
  } catch (error) { showMessage(error.message, true); }
});

categoryFilter.addEventListener("change", renderWorkouts);

async function init() {
  $("#workout-date").value = new Date().toISOString().slice(0, 10);
  $("#today-label").textContent = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase();
  try {
    [workouts, goals] = await Promise.all([getWorkouts(), getGoals()]);
    renderAll();
  } catch (error) {
    showMessage(`${error.message} Start the backend with "npm run api".`, true);
    workoutList.innerHTML = '<tr><td colspan="5">API unavailable. Start JSON Server, then refresh.</td></tr>';
    goalsList.innerHTML = '<p class="muted">API unavailable. Start JSON Server, then refresh.</p>';
  }
}
init();
