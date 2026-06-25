import { describe, it, expect } from "vitest";
import { createOrder, markOrderReady, markOrderStale } from "../packages/pizza-ordering-service/src/orders.js";

describe("markOrderStale", () => {
  it("marks a pending order as stale", () => {
    const order = createOrder({ pizzaType: "margherita", amount: 1 });
    const result = markOrderStale(order.id);
    expect(result.status).toBe("stale");
    expect(result.staleAt).toBeDefined();
  });

  it("does NOT overwrite a ready order", () => {
    const order = createOrder({ pizzaType: "pepperoni", amount: 2 });
    markOrderReady(order.id);
    const result = markOrderStale(order.id);
    expect(result.status).toBe("ready");
  });

  it("returns null for unknown order id", () => {
    const result = markOrderStale("nonexistent");
    expect(result).toBeNull();
  });

  it("calling stale twice is idempotent", () => {
    const order = createOrder({ pizzaType: "quattro", amount: 1 });
    markOrderStale(order.id);
    const result = markOrderStale(order.id);
    expect(result.status).toBe("stale");
  });
});
