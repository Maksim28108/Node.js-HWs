import { describe, it, expect, vi, afterEach } from "vitest";
import { registerShipment } from "../src/services/shipmentService.js";

const mockHour = (hour) => {
  vi.useFakeTimers();
  vi.setSystemTime(
    new Date(`2024-01-01T${String(hour).padStart(2, "0")}:00:00`),
  );
};

afterEach(() => {
  vi.useRealTimers();
});

describe("registerShipment", () => {
  it("throws if warehouse not found", async () => {
    await expect(
      registerShipment("unknownWarehouse", [{ id: "apple", units: 100 }]),
    ).rejects.toThrow('Warehouse "unknownWarehouse" not found');
  });

  it("throws if outside working hours", async () => {
    mockHour(20);
    await expect(
      registerShipment("kyivWarehouse", [{ id: "apple", units: 100 }]),
    ).rejects.toThrow("closed");
  });

  it("throws if units below minimum", async () => {
    mockHour(10);
    await expect(
      registerShipment("kyivWarehouse", [{ id: "apple", units: 5 }]),
    ).rejects.toThrow("below minimum");
  });

  it("splits shipment if units exceed maximum", async () => {
    mockHour(10);
    const result = await registerShipment("kyivWarehouse", [
      { id: "apple", units: 2500 },
    ]);
    expect(result).toHaveLength(3);
    expect(result.map((s) => s.units)).toEqual([1000, 1000, 500]);
  });
});
