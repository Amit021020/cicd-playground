# CI/CD Pipeline Simulator (Docker + Node.js)

A backend project that simulates how a basic CI/CD system works. Users can create projects, trigger deployments, and track build logs as the system clones a repository, builds a Docker image, and runs it inside a container.

This project was built for learning backend systems, Docker workflows, and deployment pipelines.

---

## Features

- User authentication (Register / Login / Logout)
- JWT-based session handling
- Project creation with Git repository details
- Deployment trigger per project
- Docker-based build and run system
- Deployment lifecycle tracking:
  - queued
  - building
  - success
  - failed
- Live-style logs stored per deployment
- Dashboard showing deployment statistics
- Project-wise deployment tracking

---

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Docker
- EJS (frontend rendering)
- JWT (authentication)
- bcrypt (password hashing)

---

## Project Structure
controllers/
models/
routes/
services/
middlewares/
utils/
config/
views/
app.js


---

## How It Works

1. User registers and logs in
2. A project is created with a GitHub repo URL
3. A deployment is triggered for that project
4. Worker service starts the deployment process:
   - Clones the repository
   - Builds Docker image
   - Runs the container
   - Captures logs during each step
5. Deployment status and logs are stored in MongoDB
6. User can view logs and deployment status from dashboard

---

## Environment Variables

Create a `.env` file in the root directory:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


---

## Installation

```
git clone <your-repo-url>
cd cicd-pipeline-simulator
npm install
```

## Run the Project
 ``node app.js``

or

``npx nodemon app.js``
## Docker Requirement
Make sure Docker is installed and running:
`` docker --version ``

## Important Notes
-This is a learning project, not production-ready
-Docker execution runs locally and is not sandboxed
-Logs are stored in MongoDB for simplicity
-No queue system is used for deployments

## What I Learned From This Project
-How CI/CD pipelines work internally
-Docker image build and container lifecycle
-Backend architecture using services and controllers
-JWT authentication flow
-Async execution handling in Node.js

## Future Improvements
-Add real-time logs using WebSockets
-Introduce job queue system (BullMQ + Redis)
-Improve Docker isolation and security
-Add retry mechanism for failed deployments
-Add GitHub webhook integration for auto deployment

## Author
Built as a backend + DevOps learning project to understand deployment systems and container-based workflows.
