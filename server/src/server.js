import express from "express";
import { pool } from "./db.js";

const server = express();
const PORT = 5000;

server.use(express.json());

server.get("/", (req, res) => {
  res.send('Hello');
});

server.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.json({
      message: "PostgreSQL connected successfully",
      time: result.rows[0].current_time
    });
  } catch (error) {
    console.error("Database connection failed ", error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
