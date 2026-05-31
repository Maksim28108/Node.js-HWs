import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  ingredientId: varchar("ingredient_id", { length: 255 }).notNull(),
  units: integer("units").notNull(),
});
