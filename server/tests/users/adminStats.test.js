import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import { getAdminStats } from "../../src/controllers/adminController.js";

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

describe("Admin dashboard statistics", () => {
  test("returns total users and stores", async () => {
    const querySpy = vi
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: [{ totalUsers: 8, totalStores: 3 }] });
    const response = responseMock();

    await getAdminStats({}, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ totalUsers: 8, totalStores: 3 });
    expect(querySpy).toHaveBeenCalledOnce();
    querySpy.mockRestore();
  });

  test("returns an error when statistics cannot be loaded", async () => {
    const querySpy = vi
      .spyOn(pool, "query")
      .mockRejectedValueOnce(new Error("database unavailable"));
    const response = responseMock();

    await getAdminStats({}, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      message: "Unable to retrieve administrator statistics",
    });
    querySpy.mockRestore();
  });
});
