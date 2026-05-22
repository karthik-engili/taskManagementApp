# Taskera

Taskera is a professional full-stack MERN (MongoDB, Express, React, Node.js) task management application. It features a modern, fully responsive user interface utilizing Tailwind CSS v4, secure JSON Web Token (JWT) authenticated accounts, a dynamic Kanban board with native drag-and-drop actions, and complete task filtering and search functionality.

## Live Deployments

- **Frontend Client**: [https://task-management-app-coral-xi.vercel.app](https://task-management-app-coral-xi.vercel.app)
- **Backend API Server**: [https://taskmanagementapp-g95d.onrender.com](https://taskmanagementapp-g95d.onrender.com)

## Project Structure

The project is divided into two separate service directories:

- **`/backend`**: The Node.js and Express RESTful API server.
- **`/frontend`**: The React client built with Vite and Tailwind CSS v4.

Detailed documentations for each environment are situated in their respective folder directories:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## Technology Overview

### Backend Services
- Express.js and Node.js
- MongoDB & Mongoose ODM
- JWT Token Authentication & BcryptJS encryption
- Express-Validator request bodies validation

### Frontend Client
- React 19 & Vite
- Tailwind CSS v4
- @hello-pangea/dnd (Kanban Drag and Drop)
- React Router DOM
- Axios and React Hot Toast

## Quick Start Guide

Follow these steps to run the complete MERN application locally.

### 1. Database Setup
Ensure that MongoDB is installed and running on your local machine.

### 2. Configure Environment Variables

Create a `.env` file inside the `/backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskera
JWT_SECRET=your_jwt_secret_key_here
```

Create a `.env` file inside the `/frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Backend Server
Open a terminal in the root project directory, then navigate into the backend folder, install dependencies, and start the development server:

```bash
cd backend
npm install
npm run dev
```

The backend API server will run at `http://localhost:5000`.

### 4. Run Frontend Client
Open a second terminal in the root project directory, then navigate into the frontend folder, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be served at `http://localhost:5173`.
