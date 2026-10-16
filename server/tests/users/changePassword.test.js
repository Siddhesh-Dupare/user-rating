import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import { changePassword } from "../../src/controllers/userController.js";

function responseMock() {
  return {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

describe("Change password", () => {
  test("updates the password after validating the current password", async () => {
    const querySpy = vi.spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ password: "Current@123" }] })
      .mockResolvedValueOnce({ rowCount: 1 });
    const response = responseMock();

    await changePassword({
      body: {
        email: "user@example.com",
        role: "USER",
        currentPassword: "Current@123",
        newPassword: "NewPass@456",
      },
    }, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Password changed successfully" });
    expect(querySpy).toHaveBeenLastCalledWith(
      "UPDATE users SET password = $1 WHERE email = $2 AND role = $3",
      ["NewPass@456", "user@example.com", "USER"],
    );
    querySpy.mockRestore();
  });

  test("rejects an incorrect current password", async () => {
    const querySpy = vi.spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ password: "Current@123" }] });
    const response = responseMock();

    await changePassword({
      body: {
        email: "user@example.com",
        role: "USER",
        currentPassword: "Wrong@123",
        newPassword: "NewPass@456",
      },
    }, response);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: "Current password is incorrect" });
    querySpy.mockRestore();
  });

  test("rejects administrators changing their password", async () => {
    const querySpy = vi.spyOn(pool, "query");
    const response = responseMock();

    await changePassword(
      {
        body: {
          email: "admin@example.com",
          role: "ADMIN",
          currentPassword: "Current@123",
          newPassword: "NewPass@456",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({
      message: "Only users and store owners can change their password",
    });
    expect(querySpy).not.toHaveBeenCalled();
    querySpy.mockRestore();
  });
});
