import { z } from "zod";
import {
  createOrderBodySchema,
  createOrderResponseSchema,
  markOrderReadyParamsSchema,
  markOrderReadyResponseSchema,
} from "pizza-ordering-contracts";
import { createOrder, markOrderReady } from "../orders.js";
import { scheduleStaleCheck } from "../jobs/staleOrderJob.js";

const errorResponseSchema = z.object({ error: z.string() });

export default function ordersRoute(app) {
  app.post(
    "/orders",
    {
      schema: {
        body: createOrderBodySchema,
        response: { 201: createOrderResponseSchema },
      },
    },
    async (request, reply) => {
      const { pizzaType, amount } = request.body;
      const order = createOrder({ pizzaType, amount });
      await scheduleStaleCheck(order.id);
      return reply.status(201).send(order);
    },
  );

  app.patch(
    "/orders/:orderId/ready",
    {
      schema: {
        params: markOrderReadyParamsSchema,
        response: {
          200: markOrderReadyResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { orderId } = request.params;
      const order = markOrderReady(orderId);
      if (!order) {
        return reply.status(404).send({ error: `Order "${orderId}" not found` });
      }
      return reply.status(200).send(order);
    },
  );
}
