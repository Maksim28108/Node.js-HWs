let shipments = [];
let nextId = 1;

export const shipmentRepository = {
  createShipment(data) {
    const shipment = { id: nextId++, ...data };
    shipments.push(shipment);
    return shipment;
  },

  _reset() {
    shipments = [];
    nextId = 1;
  },

  getShipmentById(id) {
    return shipments.find((s) => s.id === id) ?? null;
  },

  getAllShipments() {
    return [...shipments];
  },

  deleteShipment(id) {
    const index = shipments.findIndex((s) => s.id === id);
    if (index === -1) return false;
    shipments.splice(index, 1);
    return true;
  },
};
