import { describe, it, expect, beforeEach } from "vitest";
import { shipmentRepository } from "../src/repositories/shipmentRepository.js";

beforeEach(() => {
  shipmentRepository._reset();
});

describe("shipmentRepository", () => {
  it("createShipment — создаёт и возвращает объект с id", () => {
    const result = shipmentRepository.createShipment({
      ingredientId: "apple",
      units: 100,
    });
    expect(result).toEqual({ id: 1, ingredientId: "apple", units: 100 });
  });

  it("getShipmentById — возвращает нужный shipment", () => {
    shipmentRepository.createShipment({ ingredientId: "apple", units: 100 });
    const result = shipmentRepository.getShipmentById(1);
    expect(result).toEqual({ id: 1, ingredientId: "apple", units: 100 });
  });

  it("getShipmentById — возвращает null если не найден", () => {
    const result = shipmentRepository.getShipmentById(999);
    expect(result).toBeNull();
  });

  it("getAllShipments — возвращает все", () => {
    shipmentRepository.createShipment({ ingredientId: "apple", units: 100 });
    shipmentRepository.createShipment({ ingredientId: "banana", units: 200 });
    const result = shipmentRepository.getAllShipments();
    expect(result).toHaveLength(2);
  });

  it("deleteShipment — удаляет и возвращает true", () => {
    shipmentRepository.createShipment({ ingredientId: "apple", units: 100 });
    const result = shipmentRepository.deleteShipment(1);
    expect(result).toBe(true);
    expect(shipmentRepository.getAllShipments()).toHaveLength(0);
  });

  it("deleteShipment — возвращает false если не найден", () => {
    const result = shipmentRepository.deleteShipment(999);
    expect(result).toBe(false);
  });
});
