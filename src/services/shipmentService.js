import { warehouses } from "../strategies/warehouseStrategies.js";
import { shipmentRepository as shipmentRepositoryPg } from "../repositories/shipmentRepository.js";

function splitUnits(units) {
  const chunks = [];
  while (units > 0) {
    const chunk = Math.min(units, 1000);
    chunks.push(chunk);
    units -= chunk;
  }
  return chunks;
}

export async function registerShipment(targetWarehouse, ingredients) {
  const strategy = warehouses[targetWarehouse];
  if (!strategy) {
    throw new Error(`Warehouse "${targetWarehouse}" not found`);
  }

  const currentHour = new Date().getHours();
  if (
    currentHour < strategy.workingHours.start ||
    currentHour >= strategy.workingHours.end
  ) {
    throw new Error(
      `Warehouse "${targetWarehouse}" is closed. Working hours: ${strategy.workingHours.start}:00–${strategy.workingHours.end}:00`,
    );
  }

  const inserts = [];

  for (const ingredient of ingredients) {
    if (ingredient.units < strategy.minUnits) {
      throw new Error(
        `Ingredient "${ingredient.id}": units ${ingredient.units} is below minimum ${strategy.minUnits}`,
      );
    }

    if (ingredient.units > strategy.maxUnits) {
      const chunks = splitUnits(ingredient.units);
      for (const chunk of chunks) {
        inserts.push(
          shipmentRepositoryPg.createShipment({
            ingredientId: ingredient.id,
            units: chunk,
          }),
        );
      }
    } else {
      inserts.push(
        shipmentRepositoryPg.createShipment({
          ingredientId: ingredient.id,
          units: ingredient.units,
        }),
      );
    }
  }

  return Promise.all(inserts);
}
