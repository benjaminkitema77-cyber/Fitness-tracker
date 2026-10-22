# FitTrack – Fitness Tracker

## About the Project

FitTrack is a web application that helps users keep track of their workouts, set fitness goals, and plan their exercise routines. It allows users to record workout details, monitor their progress, and organize upcoming workouts.

The project was built to practice JavaScript, API integration, and front-end development.

## Features

* View a dashboard with workout information and progress.
* Add and update workout records.
* Set fitness goals and update them as progress is made.
* Remove goals that are no longer needed.
* Schedule workouts for specific days.
* View workout reminders and planned activities.
* Store and retrieve information through an API.
* Use the application through a responsive interface.

## Technologies Used

* HTML
* CSS
* JavaScript
* Vite
* JSON Server
* Jest
* ESLint
* Git and GitHub

## Project Structure

The project contains the following main files and folders:

* `index.html` – Main page of the application.
* `src/` – JavaScript and application logic.
* `style.css` – Styling for the interface.
* `db.json` – Sample data used by JSON Server.
* `tests/` – Automated tests.
* `package.json` – Project dependencies and scripts.
* `README.md` – Project documentation.

## Getting Started

### Requirements

Install Node.js and npm before running the project.

### Installation

1. Open the project folder in VS Code.
2. Open the terminal.
3. Install the dependencies:

   `npm install`

### Run the API

Start JSON Server in a terminal:

`npm run api`

If this command is not available in your `package.json`, use:

`npx json-server db.json --port 3000`

The API should be available at `http://localhost:3000`.

### Run the Application

Open another terminal and run:

`npm run dev`

Open the local address shown in the terminal, usually `http://localhost:5173`.

Keep both terminals running while using the application.

## API Endpoints

The application uses JSON Server to manage workout records, fitness goals, and scheduled workouts.

| Method | Endpoint                 | Purpose                     |
| ------ | ------------------------ | --------------------------- |
| GET    | `/workouts`              | Get all workouts            |
| GET    | `/workouts/:id`          | Get one workout             |
| POST   | `/workouts`              | Add a workout               |
| PUT    | `/workouts/:id`          | Replace a workout           |
| PATCH  | `/workouts/:id`          | Update part of a workout    |
| GET    | `/goals`                 | Get all goals               |
| POST   | `/goals`                 | Add a goal                  |
| PUT    | `/goals/:id`             | Update a goal               |
| PATCH  | `/goals/:id`             | Update part of a goal       |
| DELETE | `/goals/:id`             | Remove a goal               |
| GET    | `/scheduledWorkouts`     | Get scheduled workouts      |
| POST   | `/scheduledWorkouts`     | Schedule a workout          |
| PUT    | `/scheduledWorkouts/:id` | Replace a scheduled workout |
| PATCH  | `/scheduledWorkouts/:id` | Update a scheduled workout  |

## Testing

Run the automated tests with:

`npm test`

To check the code with ESLint, run:

`npm run lint`

To create a production build, run:

`npm run build`

These commands depend on the scripts configured in `package.json`.

## Deployment

The front end can be deployed using GitHub Pages or another static hosting service.

Because JSON Server runs separately from the front end, the API must also be hosted online for the deployed application to load and save data. Update the API URL in the application configuration to point to the hosted API.

## Author

Benjamin
