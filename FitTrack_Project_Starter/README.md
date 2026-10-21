# FitTrack — Personal Fitness Tracker

FitTrack is a web-based fitness tracker for recording workouts, reviewing activity history, and following fitness goals. This project uses HTML, CSS, JavaScript ES modules, Fetch API, and JSON Server.

## Features
- Create and delete workout records.
- Track exercise name, category, duration, date, and notes.
- Filter workout history by category.
- View workout count, total minutes, workouts this week, and weekly activity.
- Create and remove fitness goals with progress indicators.
- Form validation, loading/error messages, and responsive layout.
- REST API operations using GET, POST, PUT, PATCH, and DELETE endpoints.

## Requirements
Install a current LTS version of Node.js and npm.

## Setup
1. Open this project folder in VS Code.
2. Open the VS Code terminal in this folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start JSON Server in one terminal:
   ```bash
   npm run api
   ```
5. In a second terminal, start the frontend:
   ```bash
   npm run dev
   ```
6. Open the local URL printed by Vite (usually `http://localhost:5173`).

The API runs at `http://localhost:3000`. Its initial data is in `db.json`. JSON Server writes changes back to this file while running locally.

## Tests and lint
```bash
npm test
npm run lint
npm run build
```
The Jest tests cover validation, workout summaries, filtering, goal progress, and chart rendering. Review the generated coverage report and add tests as features grow.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/workouts` | List workouts |
| POST | `/workouts` | Create a workout |
| PUT | `/workouts/:id` | Replace a workout |
| PATCH | `/workouts/:id` | Update part of a workout |
| DELETE | `/workouts/:id` | Delete a workout |
| GET | `/goals` | List goals |
| POST | `/goals` | Create a goal |
| PATCH | `/goals/:id` | Update a goal |
| DELETE | `/goals/:id` | Delete a goal |

## Deployment notes
GitHub Pages can host the built frontend, but it does not run JSON Server. Deploy the API separately to a host that supports a persistent JSON Server service or a suitable database-backed API. Set `window.FITTRACK_API_URL` to the deployed API base URL before the app module loads. Do not use a temporary or ephemeral API host if the assignment requires data to persist.

## Suggested Git workflow
Use feature branches and pull requests, for example:
- `feature/dashboard`
- `feature/workout-management`
- `feature/fitness-goals`
- `feature/api-integration`
- `feature/testing`
- `feature/responsive-design`

Make at least eight meaningful commits as work is actually completed. Link your GitHub repository and deployed URLs here after publishing.

## Design
The interface uses the FitTrack palette:
- Navy `#172554`
- Teal `#14B8A6`
- Orange `#F97316`
- Light background `#F8FAFC`

## License
MIT. See `LICENSE`.
