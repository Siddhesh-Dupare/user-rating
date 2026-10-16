import { pool } from "../db.js";

export function validateStoreInput({ name, email, password, address, role }) {
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
  if (role !== "STORE_OWNER") {
    return "Role must be STORE_OWNER";
  }
  return null;
}

export async function createStore(req, res) {
  const { name, email, password, address, role = "STORE_OWNER" } = req.body;
  const validationError = validateStoreInput({
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
       VALUES ($1, $2, $3, $4, 'STORE_OWNER')
       RETURNING id, name, email, address, role`,
      [name, email, password, address],
    );

    return res.status(201).json({
      message: "Store owner created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A store owner with this email already exists",
      });
    }
    console.error("Store owner creation failed", error);
    return res.status(500).json({ message: "Unable to create store owner" });
  }
}
