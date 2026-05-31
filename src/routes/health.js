export default function healthRoute(app) {
  app.get("/health", async (requet, reply) => {
    return reply.send("OK");
  });
}
