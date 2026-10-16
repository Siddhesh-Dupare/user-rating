import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import { getUsersAndAdmins } from "../../src/controllers/adminController.js";

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

describe("User and administrator retrieval", () => {
  test("returns users and administrators with filters", async () => {
    const users = [
      {
        id: 1,
        name: "Normal User",
        email: "user@example.com",
        address: "Pune, Maharashtra",
        role: "USER",
      },
      {
        id: 2,
        name: "System Administrator",
        email: "admin@example.com",
        address: "Mumbai, Maharashtra",
        role: "ADMIN",
      },
    ];
    const querySpy = vi
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: users });
    const response = responseMock();

    await getUsersAndAdmins(
      {
        query: {
          name: "User",
          email: "example.com",
          address: "Pune",
          role: "USER",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ users });
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining("role IN ('USER', 'ADMIN')"), [
      "%User%",
      "%example.com%",
      "%Pune%",
      "%USER%",
    ]);
    querySpy.mockRestore();
  });

  test("returns an error when users cannot be loaded", async () => {
    const querySpy = vi
      .spyOn(pool, "query")
      .mockRejectedValueOnce(new Error("database unavailable"));
    const response = responseMock();

    await getUsersAndAdmins({ query: {} }, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      message: "Unable to retrieve users and administrators",
    });
    querySpy.mockRestore();
  });
});
