# Taskera Backend

This repository contains the backend server for Taskera, a professional full-stack task management application. The backend operates as a RESTful API to manage secure user authentication, dashboard statistics, and task statuses in a Kanban structure.

## Technology Stack

- Node.js (Runtime environment)
- Express.js (Web application framework)
- MongoDB & Mongoose (NoSQL Database and Object Data Modeling)
- JSON Web Tokens (JWT) (Secure stateless user authorization)
- BcryptJS (Cryptographic hashing of user passwords)
- Express-Validator (Request body validation middleware)
- CORS (Cross-Origin Resource Sharing)
- Dotenv (Environment variable management)

## Key Features

- Secure user sign-up and login with JWT and bcrypt password encryption.
- Robust task validation schema utilizing Express-Validator.
- Standardized REST endpoints for full CRUD operations on tasks.
- Kanban drag-and-drop support by exposing precise task status updates.
- Centralized custom error-handling middleware.

## Setup and Installation

### Prerequisites

Ensure you have Node.js and MongoDB installed on your local environment.


### Installation Commands

Install the project dependencies using npm:

```bash
npm install
```

### Running the Application

To start the server in development mode with automatic reload support (using nodemon):

```bash
npm run dev
```

To run the server in standard production mode:

```bash
npm run start
```

## API Endpoint Reference

### Authentication Routes

- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate a user and receive a JWT.
- `GET /api/auth/profile` - Retrieve the current authenticated user profile (Requires Authorization Header).

### Task Routes (All require Authorization header)

- `GET /api/tasks` - Retrieve all tasks for the logged-in user.
- `POST /api/tasks` - Create a new task.
- `PUT /api/tasks/:id` - Update an existing task's title, description, priority, status, or due date.
- `DELETE /api/tasks/:id` - Delete a task.
