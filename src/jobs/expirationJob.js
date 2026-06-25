import PgBoss from "pg-boss";
import { db } from "../db/index.js";
import { shipments } from "../db/schema.js";
import { lt } from "drizzle-orm";

const JOB_NAME = "expiration-job";
const CRON_DAILY = "0 0 * * *"; // every day at midnight

let boss;

export async function startExpirationJob() {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/pizza";

  boss = new PgBoss(connectionString);

  boss.on("error", (err) => console.error("[ExpirationJob] pg-boss error:", err));

  await boss.start();

  // Register daily cron schedule
  await boss.schedule(JOB_NAME, CRON_DAILY, {}, { tz: "UTC" });

  // Register worker
  await boss.work(JOB_NAME, async () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const deleted = await db
      .delete(shipments)
      .where(lt(shipments.createdAt, oneWeekAgo))
      .returning({ id: shipments.id });

    console.log(
      `[ExpirationJob] Deleted ${deleted.length} expired shipment(s) older than ${oneWeekAgo.toISOString()}`
    );
  });

  console.log("[ExpirationJob] Scheduled — runs daily at midnight UTC");
}

export async function stopExpirationJob() {
  if (boss) await boss.stop();
}
