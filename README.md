# User Rating

User Rating is a full-stack application with an Express/Node.js backend and a React/Vite frontend. The server connects to PostgreSQL, while the web application currently provides the sign-in interface.

## Prerequisites

- Node.js 18 or later
- npm
- PostgreSQL 14 or later

## Project structure

```text
user_rating/
├── server/   # Express API and PostgreSQL connection
└── web/      # React frontend powered by Vite
```

## Server installation

1. Create the PostgreSQL database:

   ```sql
   CREATE DATABASE user_rating;
   ```

2. Open a terminal in the server directory and install dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create `server/.env` with your local PostgreSQL credentials:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=user_rating
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   PORT=5000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The server runs at <http://localhost:5000>.

### Server commands

```bash
npm start       # Start the server
npm run dev     # Start with Nodemon
npm test        # Run Vitest
```

The `GET /health` endpoint checks the PostgreSQL connection:

```text
http://localhost:5000/health
```

## Web installation

Open a second terminal, then install and start the frontend:

```bash
cd web
npm install
npm run dev
```

Vite prints the local development URL in the terminal, usually <http://localhost:5173>.

### Web commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build in web/dist
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Running both applications

Run `npm run dev` from `server/` and `web/` in separate terminals. Keep PostgreSQL running before starting the server.

Environment files, dependencies, build output, logs, caches, and local database files are excluded by the root `.gitignore`. Do not commit real database passwords or other credentials.
