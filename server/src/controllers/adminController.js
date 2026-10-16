import { pool } from "../db.js";

export function validateAdminInput({ name, email, password, address, role }) {
  if (typeof name !== "string" || name.length < 20 || name.length > 60) {
    return "Name must be between 20 and 60 characters";
  }

  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return "Email must be valid";
  }

  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 16 ||
    !/[A-Z]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return "Password must be 8-16 characters and include an uppercase letter and special character";
  }

  if (typeof address !== "string" || address.length > 400) {
    return "Address must be 400 characters or fewer";
  }

  if (role !== "ADMIN") {
    return "Role must be ADMIN";
  }

  return null;
}

export async function createAdmin(req, res) {
  const { name, email, password, address, role = "ADMIN" } = req.body;
  const validationError = validateAdminInput({
    name,
    email,
    password,
    address,
    role,
  });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, 'ADMIN')
       RETURNING id, name, email, address, role`,
      [name, email, password, address],
    );

    return res.status(201).json({
      message: "Administrator created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "An administrator with this email already exists",
      });
    }

    console.error("Administrator creation failed", error);
    return res.status(500).json({
      message: "Unable to create administrator",
    });
  }
}

export async function getAdminStats(req, res) {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE role = 'USER')::int AS "totalUsers",
        COUNT(*) FILTER (WHERE role = 'STORE_OWNER')::int AS "totalStores",
        (SELECT COUNT(*)::int FROM ratings) AS "totalRatings"
      FROM users
    `);

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Admin statistics retrieval failed", error);
    return res.status(500).json({
      message: "Unable to retrieve administrator statistics",
    });
  }
}

export async function getStoreOwners(req, res) {
  const {
    name = "",
    email = "",
    address = "",
    role = "STORE_OWNER",
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;
  const sortColumns = { name: "store.name", email: "store.email", address: "store.address", rating: "rating" };
  const sortColumn = sortColumns[sortBy] || sortColumns.name;
  const direction = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  try {
    const result = await pool.query(
      `SELECT store.id, store.name, store.email, store.address, store.role,
              COALESCE(ROUND(AVG(ratings.rating), 2), 0) AS rating
       FROM users store
       LEFT JOIN ratings ON ratings.store_id = store.id
       WHERE store.role ILIKE $1
         AND store.name ILIKE $2
         AND store.email ILIKE $3
         AND store.address ILIKE $4
       GROUP BY store.id
       ORDER BY ${sortColumn} ${direction}`,
      [`%${role}%`, `%${name}%`, `%${email}%`, `%${address}%`],
    );

    return res.status(200).json({ stores: result.rows });
  } catch (error) {
    console.error("Store owner retrieval failed", error);
    return res.status(500).json({
      message: "Unable to retrieve store owners",
    });
  }
}

export async function getUsersAndAdmins(req, res) {
  const {
    name = "",
    email = "",
    address = "",
    role = "",
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;
  const sortColumns = { name: "listed.name", email: "listed.email", address: "listed.address", role: "listed.role", rating: "rating" };
  const sortColumn = sortColumns[sortBy] || sortColumns.name;
  const direction = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  try {
    const result = await pool.query(
      `SELECT listed.id, listed.name, listed.email, listed.address, listed.role,
              CASE WHEN listed.role = 'STORE_OWNER'
                THEN COALESCE(ROUND(AVG(ratings.rating), 2), 0)
                ELSE NULL
              END AS rating
       FROM users listed
       LEFT JOIN ratings ON ratings.store_id = listed.id
       WHERE listed.name ILIKE $1
         AND listed.email ILIKE $2
         AND listed.address ILIKE $3
         AND listed.role ILIKE $4
       GROUP BY listed.id
       ORDER BY ${sortColumn} ${direction}`,
      [`%${name}%`, `%${email}%`, `%${address}%`, `%${role}%`],
    );

    return res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("User and administrator retrieval failed", error);
    return res.status(500).json({
      message: "Unable to retrieve users and administrators",
    });
  }
}
