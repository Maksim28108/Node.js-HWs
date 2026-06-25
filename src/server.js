import "dotenv/config";
import app from "./app.js";
import { startExpirationJob } from "./jobs/expirationJob.js";

app.listen({ port: 3000 }, async (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("server running on port 3000");
  await startExpirationJob();
});
