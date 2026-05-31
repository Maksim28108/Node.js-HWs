import { db } from "../db/index.js";
import { shipments } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const shipmentRepositoryPg = {
  async createShipment(data) {
    const result = await db.insert(shipments).values(data).returning();
    return result[0];
  },

  async getShipmentById(id) {
    const result = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, id));
    return result[0] ?? null;
  },

  async getAllShipments() {
    return await db.select().from(shipments);
  },

  async deleteShipment(id) {
    const result = await db
      .delete(shipments)
      .where(eq(shipments.id, id))
      .returning();
    return result.length > 0;
  },
};
