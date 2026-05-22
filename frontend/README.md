# Taskera Frontend

This repository contains the interactive frontend client for Taskera, a high-end, responsive full-stack task management application. The interface features a clean "Indigo Ink" layout system, real-time feedback with premium toasts, and smooth Kanban-board interactions.

## Technology Stack

- React (User interface library)
- Vite (Next-generation frontend toolchain and development server)
- Tailwind CSS v4 (Utility-first CSS framework for modern styling)
- React Router DOM (Declarative routing for React apps)
- @hello-pangea/dnd (Beautiful and accessible drag-and-drop for lists)
- Axios (Promise-based HTTP client for API interactions)
- React Hot Toast (Sleek, customizable notification toasts)

## Key Features

- Clean and fully responsive design built using Tailwind CSS v4.
- Kanban Board View with integrated drag-and-drop card status updates.
- Staggered entry keyframe animations for list items and stat cards.
- Comprehensive task lists with filters for task priority and full text search.
- Interactive authentication forms with client-side password strength validation.
- Secure private routing mechanism for dashboard and profile sections.

## Setup and Installation

### Prerequisites

Ensure you have Node.js installed on your system.

### Environment Configuration

Create a `.env` file in the root of the frontend folder and define the API endpoint URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### Installation Commands

Install the required npm packages:

```bash
npm install
```

### Development and Build Commands

To launch the local development server:

```bash
npm run dev
```

To build production-ready static assets:

```bash
npm run build
```

To preview the built production site locally:

```bash
npm run preview
```

## Directory Structure Overview

- `/src/components` - Reusable UI elements (Navbar, TaskCard, TaskForm, Modal, Loader).
- `/src/context` - React Context providers for global authentication state.
- `/src/pages` - Page-level components (Login, Register, Dashboard, Profile).
- `/src/routes` - Route guards and private route controllers.
- `/src/services` - Axios API connectors for authentication and tasks.
- `/src/index.css` - Global theme variables, animations, and custom Tailwind layer overrides.
