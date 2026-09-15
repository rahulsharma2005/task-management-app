# Task Management App — Full Stack (Spring Boot + React)

A full-stack task management application with a **Spring Boot REST backend** and a modern **React (JavaScript)** frontend. Supports organizing tasks into task lists, tracking progress, filtering by priority and status, with full CRUD operations.

---

## Tech Stack

### Backend
- **Java 21 / OpenJDK**
- **Spring Boot 3.3.5**
- **Spring Data JPA** (Hibernate)
- **PostgreSQL** (Docker) & **H2 Database** (local file-persisted dev profile)
- **Maven**

### Frontend (React + JavaScript)
- **React 18** (JavaScript / JSX)
- **Tailwind CSS**
- **Lucide Icons**
- **Vite & Axios**
- **Embedded SPA Mode**: Zero-setup React UI served directly by Spring Boot at `http://localhost:8080/`.

---

## Features

- **Task Lists**: Create, read, update, and delete task lists with auto cascade cleanup of child tasks.
- **Tasks**: Create, view, update, and delete tasks nested within each list.
- **Live Progress Tracking**: Dynamic completion rate calculation and visual progress indicators.
- **Priority & Status**: Categorize tasks as `HIGH`, `MEDIUM`, or `LOW`, and toggle between `OPEN` and `CLOSED`.
- **Search & Filter**: Search by title or description; filter by status or priority.
- **CORS & Dual-Route Support**: Seamlessly supports both `/task-lists` and `/api/task-lists` prefixes.

---

## API Endpoints

### Task Lists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/task-lists` | Get all task lists |
| POST | `/task-lists` | Create a new task list |
| GET | `/task-lists/{task_list_id}` | Get a single task list |
| PUT | `/task-lists/{task_list_id}` | Update a task list |
| DELETE | `/task-lists/{task_list_id}` | Delete a task list |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/task-lists/{task_list_id}/tasks` | Get all tasks in a task list |
| POST | `/task-lists/{task_list_id}/tasks` | Create a new task |
| GET | `/task-lists/{task_list_id}/tasks/{task_id}` | Get a single task |
| PUT | `/task-lists/{task_list_id}/tasks/{task_id}` | Update a task |
| DELETE | `/task-lists/{task_list_id}/tasks/{task_id}` | Delete a task |

---

## Running the Application

### Option A: Embedded React UI (Fastest — No Node.js Needed)

1. Start the backend with the `h2` profile:
   ```bash
   # On Windows PowerShell
   .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"

   # On Linux/macOS
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
   ```

2. Open your browser to:
   **[http://localhost:8080](http://localhost:8080)**

*(If you prefer PostgreSQL, start Docker with `docker compose up -d` and run `./mvnw spring-boot:run` without the h2 profile).*

---

### Option B: Standalone Vite + React Frontend Dev Server

1. Start the Spring Boot backend on port 8080 as shown above.
2. In a separate terminal, run the React frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open **[http://localhost:5173](http://localhost:5173)** in your browser.
