import { pool } from "../db.js";

export async function loginAdministrator(req, res) {
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
         AND password = $2
         AND role = 'ADMIN'`,
      [email, password],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid administrator credentials",
      });
    }

    return res.status(200).json({
      message: "Administrator authenticated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Administrator login failed", error);

    return res.status(500).json({
      message: "Unable to authenticate administrator",
    });
  }
}
