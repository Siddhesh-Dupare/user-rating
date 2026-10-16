import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import {
  createAdmin,
  validateAdminInput,
} from "../../src/controllers/adminController.js";

const validAdmin = {
  name: "Administrator Test Account",
  email: "new-admin@example.com",
  password: "Admin@123",
  address: "Pune, Maharashtra",
  role: "ADMIN",
};

function responseMock() {
  return {
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
}

describe("Create administrator", () => {
  test.each([
    ["name shorter than 20 characters", { name: "Short name" }],
    ["name longer than 60 characters", { name: "a".repeat(61) }],
    ["invalid email", { email: "not-an-email" }],
    ["short password", { password: "Aa@1234" }],
    ["long password", { password: "A".repeat(16) + "@" }],
    ["password without uppercase", { password: "admin@123" }],
    ["password without special character", { password: "Admin123" }],
    ["address longer than 400 characters", { address: "a".repeat(401) }],
  ])("rejects %s", (description, invalidField) => {
    expect(
      validateAdminInput({ ...validAdmin, ...invalidField }),
    ).toBeTypeOf("string");
  });

  test("creates an administrator with valid fields", async () => {
    const querySpy = vi.spyOn(pool, "query").mockResolvedValueOnce({
      rows: [
        {
          id: 2,
          name: validAdmin.name,
          email: validAdmin.email,
          address: validAdmin.address,
          role: "ADMIN",
        },
      ],
    });
    const response = responseMock();

    await createAdmin({ body: validAdmin }, response);

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toMatchObject({
      name: validAdmin.name,
      email: validAdmin.email,
      address: validAdmin.address,
      role: "ADMIN",
    });
    expect(querySpy).toHaveBeenCalledOnce();
    querySpy.mockRestore();
  });

  test("returns 400 when the role is not ADMIN", async () => {
    const response = responseMock();

    await createAdmin(
      { body: { ...validAdmin, role: "USER" } },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Role must be ADMIN");
  });
});
