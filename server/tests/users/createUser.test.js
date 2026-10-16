import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import {
  createUser,
  validateUserInput,
} from "../../src/controllers/userController.js";

const validUser = {
  name: "Application User Test Account",
  email: "new-user@example.com",
  password: "User@123",
  address: "Pune, Maharashtra",
  role: "USER",
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

describe("Create user", () => {
  test.each([
    { name: "Short name" },
    { name: "a".repeat(61) },
    { email: "not-an-email" },
    { password: "Aa@1234" },
    { password: "A".repeat(16) + "@" },
    { password: "user@123" },
    { password: "User1234" },
    { address: "a".repeat(401) },
  ])("rejects invalid field data", (invalidField) => {
    expect(validateUserInput({ ...validUser, ...invalidField })).toBeTypeOf(
      "string",
    );
  });

  test("creates a user with valid fields", async () => {
    const querySpy = vi.spyOn(pool, "query").mockResolvedValueOnce({
      rows: [{ id: 2, ...validUser }],
    });
    const response = responseMock();

    await createUser({ body: validUser }, response);

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toMatchObject(validUser);
    expect(querySpy).toHaveBeenCalledOnce();
    querySpy.mockRestore();
  });

  test("rejects a non-USER role", async () => {
    const response = responseMock();

    await createUser({ body: { ...validUser, role: "ADMIN" } }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Role must be USER");
  });
});
