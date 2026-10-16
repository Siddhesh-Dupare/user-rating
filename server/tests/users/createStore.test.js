import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import {
  createStore,
  validateStoreInput,
} from "../../src/controllers/storeController.js";

const validStore = {
  name: "Store Owner Test Account",
  email: "new-store-owner@example.com",
  password: "Store@123",
  address: "Pune, Maharashtra",
  role: "STORE_OWNER",
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

describe("Create store owner", () => {
  test.each([
    { name: "Short name" },
    { name: "a".repeat(61) },
    { email: "not-an-email" },
    { password: "Aa@1234" },
    { password: "A".repeat(16) + "@" },
    { password: "store@123" },
    { password: "Store1234" },
    { address: "a".repeat(401) },
  ])("rejects invalid field data", (invalidField) => {
    expect(validateStoreInput({ ...validStore, ...invalidField })).toBeTypeOf(
      "string",
    );
  });

  test("creates a store owner with valid fields", async () => {
    const querySpy = vi.spyOn(pool, "query").mockResolvedValueOnce({
      rows: [{ id: 3, ...validStore }],
    });
    const response = responseMock();

    await createStore({ body: validStore }, response);

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toMatchObject(validStore);
    expect(querySpy).toHaveBeenCalledOnce();
    querySpy.mockRestore();
  });

  test("rejects a non-STORE_OWNER role", async () => {
    const response = responseMock();

    await createStore({ body: { ...validStore, role: "OWNER" } }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Role must be STORE_OWNER");
  });
});
