import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import { getStoreOwners } from "../../src/controllers/adminController.js";

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

describe("Store owner retrieval", () => {
  test("returns users with the STORE_OWNER role", async () => {
    const stores = [
      {
        id: 1,
        name: "Store Owner",
        email: "owner@example.com",
        address: "Pune, Maharashtra",
        role: "STORE_OWNER",
      },
    ];
    const querySpy = vi
      .spyOn(pool, "query")
      .mockResolvedValueOnce({ rows: stores });
    const response = responseMock();

    await getStoreOwners(
      { query: { name: "", email: "", address: "" } },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ stores });
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining("WHERE role = 'STORE_OWNER'"),
      ["%%", "%%", "%%"],
    );
    querySpy.mockRestore();
  });

  test("returns an error when store owners cannot be loaded", async () => {
    const querySpy = vi
      .spyOn(pool, "query")
      .mockRejectedValueOnce(new Error("database unavailable"));
    const response = responseMock();

    await getStoreOwners({ query: {} }, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      message: "Unable to retrieve store owners",
    });
    querySpy.mockRestore();
  });
});
