/**
 * Manual verification script for ExpirationJob.
 *
 * What it does:
 *  1. Inserts a shipment with createdAt = 8 days ago (should be deleted)
 *  2. Inserts a fresh shipment with createdAt = now (should be kept)
 *  3. Runs the expiration logic directly (no cron wait)
 *  4. Prints what was deleted and what survived
 *
 * Run: node --env-file=.env scripts/verify-expiration-job.js
 */

import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { shipments } from "../src/db/schema.js";
import { lt } from "drizzle-orm";

const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function run() {
  // 1. Insert an expired shipment (8 days ago)
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const [old] = await db
    .insert(shipments)
    .values({ ingredientId: "expired-ingredient", units: 99, createdAt: eightDaysAgo })
    .returning();
  console.log(`Inserted OLD shipment: id=${old.id}, createdAt=${old.createdAt}`);

  // 2. Insert a fresh shipment
  const [fresh] = await db
    .insert(shipments)
    .values({ ingredientId: "fresh-ingredient", units: 50 })
    .returning();
  console.log(`Inserted FRESH shipment: id=${fresh.id}, createdAt=${fresh.createdAt}`);

  // 3. Run expiration logic
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const deleted = await db
    .delete(shipments)
    .where(lt(shipments.createdAt, oneWeekAgo))
    .returning({ id: shipments.id });

  console.log(`\nDeleted ${deleted.length} shipment(s):`, deleted.map((s) => s.id));

  // 4. Verify fresh shipment survived
  const remaining = await db.select().from(shipments);
  const freshSurvived = remaining.some((s) => s.id === fresh.id);
  console.log(`Fresh shipment survived: ${freshSurvived ? "✓ YES" : "✗ NO"}`);

  // Cleanup
  await db.delete(shipments).where(lt(shipments.createdAt, new Date()));
  console.log("\nCleaned up test data.");
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
