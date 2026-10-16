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

export async function getStores(req, res) {
  const userEmail = String(req.query?.userEmail || "");
  const searchTerms = String(req.query?.search || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  try {
    const searchConditions = searchTerms.map(
      (_, index) =>
        `(store.name ILIKE $${index + 2} OR store.address ILIKE $${index + 2})`,
    );
    const values = searchTerms.map((term) => `%${term}%`);

    const result = await pool.query(
      `SELECT store.id, store.name, store.address,
              COALESCE(ROUND(AVG(all_ratings.rating), 2), 0) AS "overallRating",
              user_rating.rating AS "userRating"
       FROM users store
       LEFT JOIN ratings all_ratings ON all_ratings.store_id = store.id
       LEFT JOIN users rating_user ON rating_user.email = $1
       LEFT JOIN ratings user_rating
         ON user_rating.store_id = store.id
        AND user_rating.user_id = rating_user.id
       WHERE store.role = 'STORE_OWNER'
       ${searchConditions.length ? `AND ${searchConditions.join(" AND ")}` : ""}
       GROUP BY store.id, store.name, store.address, user_rating.rating
       ORDER BY name`,
      [userEmail, ...values],
    );

    return res.status(200).json({ stores: result.rows });
  } catch (error) {
    console.error("Store retrieval failed", error);
    return res.status(500).json({ message: "Unable to retrieve stores" });
  }
}

export async function submitRating(req, res) {
  const { storeId, userEmail, rating } = req.body;
  const numericRating = Number(rating);

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: "Rating must be an integer from 1 to 5" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ratings (store_id, user_id, rating)
       SELECT $1, id, $3 FROM users WHERE email = $2 AND role = 'USER'
       ON CONFLICT (store_id, user_id)
       DO UPDATE SET rating = EXCLUDED.rating
       RETURNING rating`,
      [storeId, userEmail, numericRating],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User or store not found" });
    }

    return res.status(200).json({ rating: result.rows[0].rating });
  } catch (error) {
    console.error("Rating submission failed", error);
    return res.status(500).json({ message: "Unable to submit rating" });
  }
}
