import { describe, test, expect } from "vitest";
import { pool } from "../../src/db.js";
import { loginAdministrator } from "../../src/controllers/authController.js";

describe("Get the system administrator", () => {
  const administratorCredentials = {
    email: "admin@gmail.com",
    password: "Admin@12345",
  };

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

  test("should verify administrator email and password", async () => {
    const result = await pool.query(
      `
        SELECT id, email, role
        FROM users
        WHERE email = $1
          AND password = $2
          AND role = 'ADMIN'
      `,
      [administratorCredentials.email, administratorCredentials.password],
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].email).toBe(administratorCredentials.email);
    expect(result.rows[0].role).toBe("ADMIN");
  });

  const invalidCredentials = {
    email: "invalid@example.com",
    password: "invalid-password",
  };

  test("should produce error for invalid email and password", async () => {
    const result = await pool.query(
      `
        SELECT id, email, role
        FROM users
        WHERE email = $1
          AND password = $2
          AND role = 'ADMIN'
      `,
      [invalidCredentials.email, invalidCredentials.password],
    );

    expect(result.rows).toHaveLength(0);
  });

  test("should return 401 for invalid administrator credentials", async () => {
    const response = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        return this;
      },
    };

    await loginAdministrator(
      {
        body: invalidCredentials,
      },
      response,
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message: "Invalid email or password",
    });
  });
});
