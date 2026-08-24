# Task Management App — Backend

A RESTful backend for a task management application, built with **Spring Boot** and **PostgreSQL**. Supports organizing tasks into task lists, with full CRUD operations for both.

## Tech Stack

- **Java 21**
- **Spring Boot 3.3.5**
- **Spring Data JPA** (Hibernate)
- **PostgreSQL** (containerized with Docker)
- **Maven**
- **Docker & Docker Compose**

## Features

- Create, read, update, and delete **Task Lists**
- Create and list **Tasks** nested within a Task List (`OneToMany` relationship)
- DTO-based architecture with dedicated mapper classes for clean separation between API and persistence layers
- Global exception handling for consistent error responses
- Dockerized PostgreSQL database for easy local setup

## API Endpoints

### Task Lists
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/task-lists` | Get all task lists |
| POST | `/task-lists` | Create a new task list |
| GET | `/task-lists/{task_list_id}` | Get a single task list |
| PUT | `/task-lists/{task_list_id}` | Update a task list |
| DELETE | `/task-lists/{task_list_id}` | Delete a task list |

### Tasks (nested under a Task List)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/task-lists/{task_list_id}/tasks` | Get all tasks in a task list |
| POST | `/task-lists/{task_list_id}/tasks` | Create a new task in a task list |

## Architecture

The project follows a layered architecture:

```
Controller  →  Service  →  Repository  →  Database
     ↓             ↓
   DTOs  ←—  Mapper
```

- **Controllers** — handle HTTP requests and responses
- **Services** — contain business logic
- **Repositories** — Spring Data JPA interfaces for database access
- **DTOs & Mappers** — decouple the API contract from internal JPA entities
- **Entities** — `TaskList` and `Task`, connected via a `OneToMany` / `ManyToOne` relationship

## Running Locally

**Prerequisites:** JDK 21, Docker

```bash
# Start PostgreSQL
docker compose up -d

# Run the application
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

## Example Usage

```bash
# Create a task list
curl -X POST http://localhost:8080/task-lists \
  -H "Content-Type: application/json" \
  -d '{"title": "Work", "description": "Work-related tasks"}'

# Get all task lists
curl http://localhost:8080/task-lists
```

---

Built as part of backend engineering practice, focused on core Spring Boot concepts: dependency injection, JPA entity relationships, REST API design, and clean layered architecture.
