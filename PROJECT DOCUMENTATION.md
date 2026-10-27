# FitTrack Project Documentation

## Project goal
Build a personal fitness tracker that allows users to record workouts, review workout history, monitor weekly activity, and manage fitness goals.

## Main features
1. Workout creation and deletion, including validation.
2. Category-based workout filtering.
3. Dashboard statistics and weekly activity visualization.
4. Goal creation, progress indicators, and deletion.
5. API loading/error handling and success feedback.
6. Responsive desktop and mobile layouts.

## Architecture
- `index.html`: semantic application structure.
- `style.css`: responsive styles and FitTrack design system.
- `src/main.js`: UI event handling and rendering.
- `src/api.js`: REST API requests.
- `src/workouts.js`: workout validation, filtering, summaries.
- `src/goals.js`: goal validation and progress calculation.
- `src/dashboard.js`: weekly chart rendering.
- `db.json`: JSON Server seed data.
- `tests/`: automated unit tests.

## Palette
- Navy: `#172554`
- Teal: `#14B8A6`
- Orange: `#F97316`
- Light neutral: `#F8FAFC`

## Current implementation notes
This starter contains the initial local app structure and sample data. Test it locally, review the assignment rubric, and extend or adjust it before claiming every rubric item is complete. A persistent, publicly accessible deployed API still needs to be configured for a live deployment.
