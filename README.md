# Stickies - Sticky Note Manager

A user-friendly sticky note manager built with React, Material UI, and integrated with the [Stickies API Backend](https://github.com/wassamz/Stickies-API).

## Features

### User Features:
- **User Registration & Login** – Create an account and log in securely.
- **One Time Password** – Sign Up & Reset your password using a one-time password (OTP).
- **Notes CRUD Operations** – Create, Read, Update, and Delete sticky notes (via Axios).
- **Search Functionality** – Quickly find your notes with a search feature.
- **Draggable Notes** – Organize your notes by dragging them. The order is saved automatically (using `@dnd-kit`).
- **Mobile Friendly** – Responsive design to support small screen sizes.

### Security Features:
- **JWT Authentication** – Secure access with JSON Web Tokens (JWT) stored in Local Storage for access tokens, and refresh tokens in Cookies.

---

## Getting Started

### Prerequisites
Before you start, ensure you have the following:

- Node.js (v18 or above) installed.
- Access to the [Stickies API Backend](https://github.com/wassamz/Stickies-API).

### Configuration

To configure the environment settings:

1. **PORT** - The port on which this application will run.
2. **REACT_APP_API_URL** - URL of the backend API server.
3. **REACT_APP_NOTE_*** - Configurable character limits for sticky notes.

---

### Running the Application

Once your API server is up and running, you can start the UI:

1. **Create a user** and start managing your sticky notes!

---

## Available Scripts

In the project directory, you can run the following commands:

### `npm start` or `npm run start:dev`

Runs the app in development mode. The page will automatically reload whenever you make changes.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build:dev`

Builds the app for development into the `build` folder. This optimizes the app for best performance but keeps the build suitable for development.

### `npm run build:production`

Builds the app for production into the `build` folder. This optimizes React for production and minifies the files. The resulting build is ready to be deployed.

---

## Deployment

To deploy this app as a standalone frontend server, you can use Docker.

### Docker Commands:

```bash
# Build the Docker image
docker build -t stickies-app .

# Run the Docker container
docker run --name stickies-app -p 4001:4001 stickies-app
