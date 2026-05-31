import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../src/app.js";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("POST /stock", () => {
  it("returns 400 for invalid data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/stock",
      payload: { ingredient: 123, quantity: "flour" },
    });

    expect(response.statusCode).toBe(400);
  });

  it("returns 200 for valid data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/stock",
      payload: { ingredient: "flour", quantity: 50 },
    });

    expect(response.statusCode).toBe(200);
  });
});
