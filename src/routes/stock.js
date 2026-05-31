import { z } from "zod";
import { registerShipment } from "../services/shipmentService.js";

const stockSchema = z.object({
  targetWarehouse: z.string(),
  ingredients: z.array(
    z.object({
      id: z.string(),
      units: z.number(),
    }),
  ),
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
      try {
        const { targetWarehouse, ingredients } = request.body;
        const shipments = await registerShipment(targetWarehouse, ingredients);
        return reply.status(200).send({ shipments });
      } catch (err) {
        return reply.status(400).send({ error: err.message });
      }
    },
  );
}
