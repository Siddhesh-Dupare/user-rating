import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import { getStores, submitRating } from "../../src/controllers/storeController.js";

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

describe("Store listings", () => {
  test("returns store owners for dashboard listings", async () => {
    const stores = [
      { id: 1, name: "Green Valley Store", email: "store@example.com", address: "Pune" },
    ];
    const querySpy = vi.spyOn(pool, "query").mockResolvedValueOnce({ rows: stores });
    const response = responseMock();

    await getStores({}, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ stores });
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining("role = 'STORE_OWNER'"),
      [""],
    );
    querySpy.mockRestore();
  });

  test("returns an error when stores cannot be loaded", async () => {
    const querySpy = vi.spyOn(pool, "query")
      .mockRejectedValueOnce(new Error("database unavailable"));
    const response = responseMock();

    await getStores({}, response);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Unable to retrieve stores" });
    querySpy.mockRestore();
  });

  test("searches each term across store names and addresses", async () => {
    const querySpy = vi.spyOn(pool, "query").mockResolvedValueOnce({ rows: [] });
    const response = responseMock();

    await getStores({ query: { search: "ganesh pune" } }, response);

    expect(response.statusCode).toBe(200);
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining("name ILIKE $2"), [
      "",
      "%ganesh%",
      "%pune%",
    ]);
    querySpy.mockRestore();
  });

  test("submits a rating from 1 to 5 for a user and store", async () => {
    const querySpy = vi.spyOn(pool, "query").mockResolvedValueOnce({
      rows: [{ rating: 5 }],
    });
    const response = responseMock();

    await submitRating(
      {
        body: {
          storeId: "store-id",
          userEmail: "user@example.com",
          rating: 5,
        },
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ rating: 5 });
    querySpy.mockRestore();
  });

  test("rejects ratings outside the 1 to 5 scale", async () => {
    const querySpy = vi.spyOn(pool, "query");
    const response = responseMock();

    await submitRating(
      {
        body: {
          storeId: "store-id",
          userEmail: "user@example.com",
          rating: 6,
        },
      },
      response,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: "Rating must be an integer from 1 to 5",
    });
    expect(querySpy).not.toHaveBeenCalled();
    querySpy.mockRestore();
  });
});
