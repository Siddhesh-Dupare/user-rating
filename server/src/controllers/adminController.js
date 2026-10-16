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
        COUNT(*) FILTER (WHERE role = 'STORE_OWNER')::int AS "totalStores"
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
  const { name = "", email = "", address = "", role = "STORE_OWNER" } = req.query;

  try {
    const result = await pool.query(
      `SELECT id, name, email, address, role
       FROM users
       WHERE role ILIKE $1
         AND name ILIKE $2
         AND email ILIKE $3
         AND address ILIKE $4
       ORDER BY name`,
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
