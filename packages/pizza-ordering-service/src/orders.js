// In-memory store for orders
const orders = new Map();
let nextId = 1;

export function createOrder({ pizzaType, amount }) {
  const id = String(nextId++);
  const order = {
    id,
    pizzaType,
    amount,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.set(id, order);
  return order;
}

export function getOrderById(id) {
  return orders.get(id) ?? null;
}

export function markOrderReady(id) {
  const order = orders.get(id);
  if (!order) return null;
  order.status = "ready";
  order.readyAt = new Date().toISOString();
  return order;
}
