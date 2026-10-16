import { describe, expect, test, vi } from "vitest";
import { pool } from "../../src/db.js";
import { getStoreOwnerRatings } from "../../src/controllers/storeController.js";

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

describe("Store owner ratings", () => {
  test("returns average rating and rating users", async () => {
    const querySpy = vi.spyOn(pool, "query").mockResolvedValueOnce({
      rows: [
        {
          storeId: "store-id",
          storeName: "Ganesh Store",
          averageRating: 4.5,
          rating: 5,
          name: "User One",
          email: "user@example.com",
          address: "Pune",
        },
      ],
    });
    const response = responseMock();

    await getStoreOwnerRatings(
      { query: { ownerEmail: "owner@example.com" } },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      store: { id: "store-id", name: "Ganesh Store", averageRating: 4.5 },
      ratings: [
        {
          name: "User One",
          email: "user@example.com",
          address: "Pune",
          rating: 5,
        },
      ],
    });
    querySpy.mockRestore();
  });

  test("requires a store owner email", async () => {
    const response = responseMock();
    await getStoreOwnerRatings({ query: {} }, response);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      message: "Store owner email is required",
    });
  });
});
