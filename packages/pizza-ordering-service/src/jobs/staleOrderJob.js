import PgBoss from "pg-boss";
import { markOrderStale } from "../orders.js";

const JOB_NAME = "stale-order-job";
const DELAY_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

let boss;

export async function startStaleOrderJob() {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/pizza";

  boss = new PgBoss(connectionString);

  boss.on("error", (err) => console.error("[StaleOrderJob] pg-boss error:", err));

  await boss.start();

  // Register worker — fires when the delayed job triggers
  await boss.work(JOB_NAME, async ([job]) => {
    const { orderId } = job.data;
    const order = markOrderStale(orderId);

    if (!order) {
      console.log(`[StaleOrderJob] Order ${orderId} not found`);
      return;
    }

    if (order.status === "stale") {
      console.log(`[StaleOrderJob] Order ${orderId} marked as stale`);
    } else {
      console.log(
        `[StaleOrderJob] Order ${orderId} already finished (status: ${order.status}), skipping`
      );
    }
  });

  console.log("[StaleOrderJob] Worker ready — 2h delay per order");
}

export async function scheduleStaleCheck(orderId) {
  if (!boss) {
    console.warn("[StaleOrderJob] Boss not started — skipping schedule for order", orderId);
    return;
  }

  await boss.sendAfter(JOB_NAME, { orderId }, {}, DELAY_MS);
  console.log(`[StaleOrderJob] Scheduled stale check for order ${orderId} in 2h`);
}

export async function stopStaleOrderJob() {
  if (boss) await boss.stop();
}
