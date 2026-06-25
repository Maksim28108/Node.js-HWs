import "dotenv/config";
import app from "./app.js";
import { startStaleOrderJob } from "./jobs/staleOrderJob.js";

const PORT = process.env.PORT || 3001;

app.listen({ port: PORT, host: "0.0.0.0" }, async (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  await startStaleOrderJob();
});
