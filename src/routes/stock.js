import { z } from "zod";

const stockSchema = z.object({
  ingredient: z.string(),
  quantity: z.number(),
});

export default function stockRoute(app) {
  app.post(
    "/stock",
    {
      schema: {
        body: stockSchema,
      },
    },
    async (request, reply) => {
      return reply.status(200).send({ message: "Stock received" });
    },
  );
}
