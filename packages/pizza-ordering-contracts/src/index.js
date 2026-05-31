import { z } from "zod";

// Contract: Pizza Production Service → Pizza Ordering Service
// Describes a pizza that has been made
export const pizzaMadeSchema = z.object({
  pizzaType: z.string().min(1),
  amount: z.number().int().positive(),
});

// Contract: POST /orders
// Body: incoming pizza order from Pizza Production Service
export const createOrderBodySchema = pizzaMadeSchema;

export const createOrderResponseSchema = z.object({
  id: z.string(),
  pizzaType: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "ready"]),
  createdAt: z.string(),
});

// Contract: PATCH /orders/:orderId/ready
// Mark a received order as ready
export const markOrderReadyParamsSchema = z.object({
  orderId: z.string(),
});

export const markOrderReadyResponseSchema = z.object({
  id: z.string(),
  pizzaType: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "ready"]),
  readyAt: z.string(),
});
