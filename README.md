# Stickies 

Sticky Note manager UI that connects to the  [Stickies API Backend](https://github.com/wassamz/Stickies-API)

Built on React v18 

**User Features:** 
* User Access
* Password Reset with OTP
* Notes CRUD Operations
* Search

**Security Features**
* JWT handling for Access Tokens (Local Storage) and Refresh Tokens (Cookie). 


## Getting Started
To start, configure the environment settings: 
1. PORT - Port for this application to run on
2. REACT_APP_API_URL - Backend API Server URL 

Once the API server is running, start this UI and create a user, and begin creating your own sticky notes. 

## Available Scripts

In the project directory, you can run:

### `npm start run:dev`

Runs the app in the development mode.\
The page will reload when you make changes.\

### `npm test`

Launches the test runner in the interactive watch mode.\

### `npm run build:dev`

Builds the app for development to the `build` folder.\
It correctly bundles React and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run build:production`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


### Deployment
Dockerfile included to deploy as a standalone frontend server. 
Sample deploy commands:
```bash
docker build -t stickies-app .
docker run --name stickies-app -p 4001:4001 stickies-app
```
