export function renderWeeklyChart(container, workouts, now = new Date()) {
  const days = [];
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const minutes = workouts.filter((w) => w.date === key)
      .reduce((sum, w) => sum + Number(w.duration || 0), 0);
    days.push({ label: date.toLocaleDateString("en", { weekday: "short" }), minutes });
  }
  const max = Math.max(60, ...days.map((d) => d.minutes));
  container.replaceChildren();
  days.forEach((day, index) => {
    const column = document.createElement("div");
    column.className = "chart-day";
    const bar = document.createElement("div");
    bar.className = `chart-bar${index === ((now.getDay() + 6) % 7) ? " today" : ""}`;
    bar.style.height = `${Math.max(4, (day.minutes / max) * 115)}px`;
    bar.title = `${day.label}: ${day.minutes} minutes`;
    const label = document.createElement("span");
    label.textContent = day.label;
    column.append(bar, label);
    container.append(column);
  });
}
