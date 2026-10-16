import { describe, test, expect } from "vitest";
import { pool } from "../../src/db.js";

describe("Get the application user", () => {
  test("should retrieve a user with the USER role", async () => {
    const result = await pool.query(`
      SELECT id, name, email, address, role
      FROM users
      WHERE role = 'USER'
    `);

    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].email).toBe("user@gmail.com");
    expect(result.rows[0].role).toBe("USER");
  });
});
