# Issue Tracking System

A full-stack application built with React (TypeScript), Express.js, and PostgreSQL.
![testing issue tracker123](https://github.com/user-attachments/assets/48cbbcf8-ba5b-40ef-bb76-dfd45bf28996)


## Prerequisites

- **Node.js** (v18 or higher recommended)
- **Docker** & **Docker Compose** (for running the database)

## Project Structure

```
/
├── client/          # React Frontend
├── server/          # Express Backend
└── docker-compose.yml # Database Configuration
```

## Setup Instructions

### 1. Start the Database

The project uses PostgreSQL hosted in a Docker container.

1. Open a terminal in the root directory.
2. Run the following command to start the database:

```bash
docker-compose up -d
```

> **Note**: The database listens on port **5433** to avoid conflicts with default PostgreSQL installations.

---

### 2. Configure and Run the Server (Backend)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create/Verify environment variables:
   Ensure a `.env` file exists in the `server` directory with the following content (this should be auto-created during setup, but verify manually if needed):
   ```env
   DATABASE_URL="postgresql://admin:password123@localhost:5433/issue_tracker"
   PORT=3000
   JWT_SECRET="supersecretkey"
   ```

4. Run Database Migrations:
   This creates the necessary tables in your PostgreSQL database.
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the Server:
   ```bash
   npm run dev
   ```
   The backend will start at `http://localhost:3000`.

---

### 3. Configure and Run the Client (Frontend)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Development Server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173` (or the port shown in your terminal).

## Usage

1. Open your browser and go to `http://localhost:5173`.
2. **Register** a new account.
3. **Login** with your credentials.
4. Use the Dashboard to:
   - Create new issues.
   - Filter issues by Status or Priority.
   - Search for issues.
   - Click on an issue to View Details, Edit, or Delete.

## Technologies

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Zustand, Axios
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM, JSONWebToken, Bcrypt
- **Database**: PostgreSQL
