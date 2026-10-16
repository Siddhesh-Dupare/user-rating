# User Rating

User Rating is a full-stack store-rating application. It uses an Express and
Node.js API, PostgreSQL for persistence, and a React/Vite frontend.

The application has three roles:

- **Administrator**: creates stores, users, and administrators; views filtered
  and sortable store and user listings; and sees platform totals.
- **Normal User**: signs up, views and searches stores, submits ratings from 1
  to 5, and modifies previously submitted ratings.
- **Store Owner**: views the average rating for their store and the users who
  submitted ratings.

## Requirements

- Node.js 18 or later
- npm
- PostgreSQL 14 or later

## Project structure

```text
user_rating/
├── server/                 # Express API and PostgreSQL access
│   ├── src/
│   │   ├── controllers/
│   │   └── routes/
│   └── tests/
└── web/                    # React/Vite frontend
    └── src/
        └── components/
```

## Database setup

Create the database:

```sql
CREATE DATABASE user_rating;
```

Create `server/.env` using your local PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=user_rating
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
PORT=5000
```

The server creates the ratings table when it starts. The existing `users` table
must contain `id`, `name`, `email`, `password`, `address`, and `role` columns.
User roles are `USER`, `STORE_OWNER`, and `ADMIN`. Names and email addresses
must be unique across all roles.

## Installation and development

Install and start the backend:

```bash
cd server
npm install
npm run dev
```

The API runs at <http://localhost:5000>.

In a second terminal, install and start the frontend:

```bash
cd web
npm install
npm run dev
```

The frontend runs at <http://localhost:5173>.

## Commands

### Server

Run these commands from `server/`:

```bash
npm start       # Start the API
npm run dev     # Start the API with Nodemon
npm test        # Run the Vitest test suite
```

### Web

Run these commands from `web/`:

```bash
npm run dev     # Start the Vite development server
npm run build   # Create a production build
npm run preview # Preview the production build
npm run lint    # Run ESLint
```

## Main API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Authenticate any supported role |
| `POST` | `/api/user` | Create a normal user account |
| `PATCH` | `/api/user/password` | Change a USER or STORE_OWNER password |
| `GET` | `/api/admin/stats` | Retrieve administrator dashboard totals |
| `GET` | `/api/admin/stores` | List and filter store owners |
| `GET` | `/api/admin/users` | List and filter users and administrators |
| `POST` | `/api/admin` | Create an administrator |
| `GET` | `/api/store` | List stores for normal users |
| `POST` | `/api/store` | Create a store owner |
| `POST` | `/api/store/ratings` | Submit or modify a 1–5 store rating |
| `GET` | `/api/store-owner/ratings` | Retrieve a store owner's ratings |

Store searches accept a `search` query parameter. Multiple words are matched
against store name and address, for example:

```text
/api/store?search=ganesh%20pune&userEmail=user@example.com
```

## Validation and access rules

- Names are 20–60 characters.
- Addresses are limited to 400 characters.
- Passwords are 8–16 characters and require uppercase, lowercase, numeric, and
  special characters.
- Email addresses use standard email validation.
- Signup creates only `USER` accounts.
- Only `USER` and `STORE_OWNER` accounts can change their own passwords.
- Ratings must be whole numbers from 1 through 5.
- Dashboard views are rendered according to the authenticated user role.

## Testing

Run the complete backend suite:

```bash
cd server
npm test -- --run
```

Build the frontend:

```bash
cd web
npm run build
```

Do not commit `.env` files, database credentials, dependencies, build output,
or local logs.
