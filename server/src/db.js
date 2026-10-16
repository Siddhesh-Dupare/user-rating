import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function ensureRatingsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      store_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      UNIQUE (store_id, user_id)
    )
  `);
}

export async function ensureRoleScopedEmailConstraint() {
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'users'::regclass AND conname = 'users_email_role_key'
      ) THEN
        NULL;
      ELSE
        ALTER TABLE users DROP CONSTRAINT users_email_role_key;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'users'::regclass AND conname = 'users_email_key'
      ) THEN
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'users'::regclass AND conname = 'users_name_key'
      ) THEN
        ALTER TABLE users ADD CONSTRAINT users_name_key UNIQUE (name);
      END IF;
    END $$;
  `);
}

pool.on("error", (err) => {
  console.error("Unexpected PostGreSQL pool Error: ", err);
});
