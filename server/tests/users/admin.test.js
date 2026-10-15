import { describe, test, expect } from "vitest";
import { pool } from "../../src/db.js";

describe("Get the system administrator", () => {
  test("should retrieve administrator user", async () => {
    const result = await pool.query(`
      SELECT id, name, email, address, role
      FROM users
      WHERE role = 'ADMIN'
    `);

    expect(result).toBeDefined();
    expect(result.rows).toBeDefined();
    expect(Array.isArray(result.rows)).toBe(true);

    // Verify at least one admin exists
    expect(result.rows.length).toBeGreaterThan(0);

    // Verify admin user structure
    const admin = result.rows[0];
    expect(admin.name).toBe("System Administrator");
    expect(admin.email).toBe("admin@gmail.com");
    expect(admin.address).toBe("Pune, Maharashtra");
    expect(admin.role).toBe("ADMIN");
  });
});
