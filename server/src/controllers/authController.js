import { pool } from "../db.js";

const supportedRoles = new Set(["ADMIN", "USER", "STORE_OWNER"]);

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, address, role
       FROM users
       WHERE email = $1
         AND password = $2`,
      [email, password],
    );

    const user = result.rows[0];

    if (!user || !supportedRoles.has(user.role)) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Administrator login failed", error);

    return res.status(500).json({
      message: "Unable to authenticate administrator",
    });
  }
}

export const loginAdministrator = login;
