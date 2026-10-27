import { renderWeeklyChart } from "../src/dashboard.js";

describe("renderWeeklyChart", () => {
  test("renders seven days", () => {
    document.body.innerHTML = '<div id="chart"></div>';
    const chart = document.querySelector("#chart");
    renderWeeklyChart(chart, [], new Date("2026-10-19T12:00:00"));
    expect(chart.querySelectorAll(".chart-day")).toHaveLength(7);
  });
});
