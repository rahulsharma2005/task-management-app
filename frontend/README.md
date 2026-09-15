# TaskPulse - React & JavaScript Frontend

A modern, responsive task tracking frontend built with **React (JavaScript / JSX)**, **Tailwind CSS**, **Lucide Icons**, and **Axios**.

## Features

- **Task Lists Management**: Create, edit, and delete multiple task lists.
- **Task Management**: Create, view, edit, and delete tasks within each list.
- **Priority & Status Badging**: Visually categorize tasks with HIGH, MEDIUM, and LOW priorities, and toggle between OPEN and CLOSED (completed).
- **Live Search & Filtering**: Filter tasks by status (All, Open, Completed), priority (All, High, Medium, Low), or title/description search.
- **Progress Tracking**: Real-time calculation and visual progress bar for list completion percentage.
- **Spring Boot Proxying**: Vite dev server proxies `/task-lists` and `/api` requests directly to Spring Boot on port 8080.

## Prerequisites

- [Node.js (v18+)](https://nodejs.org/) installed.
  - On Windows, install via winget:
    ```bash
    winget install OpenJS.NodeJS.LTS -e
    ```

## Quick Start

1. Start the Spring Boot backend on port 8080:
   ```bash
   cd ../backend-finished
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
   ```

2. In a new terminal, install dependencies and start the frontend:
   ```bash
   cd frontend-js
   npm install
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note**: You can also run the embedded React frontend directly from the Spring Boot app at [http://localhost:8080](http://localhost:8080) without running Node.js!

