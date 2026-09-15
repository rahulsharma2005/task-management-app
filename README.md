# Task Management App — Full Stack (Spring Boot + React)

A modern full-stack task management application with a **Spring Boot REST API backend** and an interactive, responsive **React (JavaScript & JSX)** frontend. Organize tasks into custom lists, track progress in real-time, filter by status and priority, and manage your workflow with complete CRUD capabilities.

---

## What Was Added (Frontend & Full-Stack Upgrades)

Here is a comprehensive breakdown of the frontend and full-stack features introduced to this project:

### 1. Dual-Mode Frontend Deployment

To make running and developing the application as flexible as possible, two complementary frontend modes are provided:

- **Mode 1: Zero-Setup Embedded React UI (`src/main/resources/static/`)**
  - Served directly by the Spring Boot server on **`http://localhost:8080/`**.
  - Uses **React 18**, **Babel Standalone** (in-browser JSX transpilation), and **Tailwind CSS**.
  - **Requires ZERO additional tooling** — no Node.js, npm, or build step needed. Just run `./mvnw spring-boot:run` and open your browser!
  - Fully self-contained with inline SVG icons, ensuring 100% offline availability.

- **Mode 2: Standalone Modern Vite + React (JavaScript) Project (`frontend/`)**
  - Modular project configured with **Vite 5**, **React 18**, **Tailwind CSS**, **Lucide Icons**, and **Axios**.
  - Includes a pre-configured Vite proxy (`/task-lists` and `/api` $\rightarrow$ `http://localhost:8080`).
  - Provides instant Hot Module Replacement (HMR) for rapid local frontend development.

---

### 2. Frontend UI & UX Features

- **Task Lists Sidebar**:
  - Browse and switch between task lists with active selection highlighting.
  - Real-time completion progress indicator per list (`%` bar).
  - Quick actions to create, rename, or delete task lists.
  - Responsive layout that collapses cleanly on smaller screens.

- **Interactive Task Board & Metrics**:
  - **Live Statistics Cards**: Real-time counter for **Total Tasks**, **Open Tasks**, **Completed Tasks**, and overall **Progress %**.
  - **Animated Progress Bar**: Visual progress bar tracking completion percentage.
  - **Task Cards**:
    - **One-Click Toggle**: Checkbox button to immediately toggle between `OPEN` and `CLOSED` (completed), with strikethrough styling for completed tasks.
    - **Priority Badges**: Distinct color-coded pills for `HIGH` (rose/red), `MEDIUM` (amber/orange), and `LOW` (emerald/green).
    - **Due Date Indicator**: Calendar icon and formatted date display.
    - **Actions**: One-click edit and delete with confirmation dialogs.

- **Live Search & Filtering Toolbar**:
  - **Real-Time Search**: Filters tasks instantaneously by matching titles or descriptions.
  - **Status Filter**: Toggle between `All`, `Open`, and `Closed (Completed)`.
  - **Priority Filter**: Filter by `All Priorities`, `High`, `Medium`, or `Low`.

- **Modal Dialogs & Validation**:
  - **Task Modal**: Create and edit tasks with title, description, due date/time, priority, and status fields.
  - **List Modal**: Create and edit task lists with title and description.
  - Client-side validation ensuring required fields cannot be submitted blank.

- **Toast Notifications**:
  - Non-intrusive banner alerts providing feedback for actions (e.g., "Task created!", "Task list deleted", error alerts).

---

### 3. Backend Enhancements to Support the Frontend

To enable complete frontend functionality, the following backend enhancements were added:

1. **Completed Task CRUD Endpoints**:
   - `GET /task-lists/{task_list_id}/tasks/{task_id}` — fetch a specific task.
   - `PUT /task-lists/{task_list_id}/tasks/{task_id}` — update task details, priority, or status.
   - `DELETE /task-lists/{task_list_id}/tasks/{task_id}` — atomic, `@Transactional` task deletion.
   - Added `deleteByTaskListIdAndId` query method to `TaskRepository`.

2. **CORS Configuration (`WebConfig.java`)**:
   - Enabled cross-origin requests for Vite dev servers running on ports `5173` and `3000`.

3. **Dual-Route Support**:
   - Controllers handle both `/task-lists/...` and `/api/task-lists/...` paths, ensuring seamless compatibility across different client setups.

4. **H2 In-Memory/File Database Profile (`application-h2.properties`)**:
   - Added an optional `h2` profile that stores data in `./data/tasksdb`.
   - Allows running the entire application immediately **without needing Docker Desktop or PostgreSQL** running.

---

## Project Structure

```
task-management-app/
├── pom.xml                                  # Maven project configuration (Spring Boot 3.3.5)
├── docker-compose.yml                       # Docker Compose for PostgreSQL
├── frontend/                                # Standalone Vite + React (JavaScript) Project
│   ├── package.json                         # React 18, Vite, Tailwind CSS, Lucide, Axios
│   ├── vite.config.js                       # Proxy configuration to Spring Boot (port 8080)
│   ├── tailwind.config.js                   # Tailwind CSS configuration
│   ├── index.html                           # Entry HTML for Vite app
│   └── src/
│       ├── main.jsx                         # React root mount
│       ├── App.jsx                          # Main application layout and state management
│       ├── index.css                        # Tailwind directives and custom utility styles
│       ├── api/
│       │   └── client.js                    # Axios API service layer
│       └── components/
│           ├── TaskListsSidebar.jsx         # Sidebar navigation and list controls
│           ├── TaskBoard.jsx                # Main workspace with stats, filters, and cards
│           ├── TaskListModal.jsx            # Modal for creating/editing task lists
│           └── TaskModal.jsx                # Modal for creating/editing tasks
└── src/
    └── main/
        ├── java/com/devtiro/tasks/
        │   ├── TasksApplication.java       # Spring Boot main application entry
        │   ├── config/
        │   │   └── WebConfig.java           # CORS & web MVC configuration
        │   ├── controllers/                 # REST controllers (TaskListController, TasksController)
        │   ├── domain/                      # Entities and DTOs
        │   ├── mappers/                     # Entity <-> DTO mappers
        │   ├── repositories/                # Spring Data JPA repositories
        │   └── services/                    # Business logic interfaces and implementations
        └── resources/
            ├── application.properties       # Default configuration (PostgreSQL)
            ├── application-h2.properties    # Dev profile (H2 database with local persistence)
            └── static/                      # Embedded React + JavaScript Single Page App
                ├── index.html               # React 18 + Tailwind HTML shell
                ├── app.jsx                  # Complete React SPA written in JavaScript
                └── styles.css               # Modern UI styling and animations
```

---

## REST API Reference

### Task Lists
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/task-lists` | Get all task lists |
| `POST` | `/task-lists` | Create a new task list |
| `GET` | `/task-lists/{task_list_id}` | Get a single task list |
| `PUT` | `/task-lists/{task_list_id}` | Update a task list |
| `DELETE` | `/task-lists/{task_list_id}` | Delete a task list (cascades to tasks) |

### Tasks (Scoped to a Task List)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/task-lists/{task_list_id}/tasks` | Get all tasks in a task list |
| `POST` | `/task-lists/{task_list_id}/tasks` | Create a new task in a task list |
| `GET` | `/task-lists/{task_list_id}/tasks/{task_id}` | Get a single task |
| `PUT` | `/task-lists/{task_list_id}/tasks/{task_id}` | Update a task (status, priority, due date, etc.) |
| `DELETE` | `/task-lists/{task_list_id}/tasks/{task_id}` | Delete a task |

*Note: All endpoints also respond to the `/api/` prefix (e.g. `/api/task-lists`).*

---

## How to Run

### Option 1: Embedded React UI (Immediate — No Node.js Required)

1. Start the backend with the H2 profile:
   ```bash
   # On Windows PowerShell
   .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"

   # On Linux/macOS
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
   ```

2. Open your browser and navigate to:
   **[http://localhost:8080/](http://localhost:8080/)**

*(To run with PostgreSQL instead: start Docker with `docker compose up -d` and run `./mvnw spring-boot:run` without the `-Dspring-boot.run.profiles=h2` flag).*

---

### Option 2: Standalone Vite + React Frontend (Dev Server)

1. Ensure the Spring Boot backend is running on port 8080 (as in Option 1).
2. Open a separate terminal, navigate to the `frontend` folder, and start the Vite dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open your browser at **[http://localhost:5173/](http://localhost:5173/)**.
