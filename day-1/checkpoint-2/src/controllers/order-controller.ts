import { Request, Response } from "express";
import { products, orders, Order } from "../models/data-dummy";

export const createOrder = (req: Request, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: "items required" });

  const orderId = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
  const newItems = [];

  for (const it of items) {
    const product = products.find((p) => p.id === it.product_id);
    if (!product)
      return res
        .status(400)
        .json({ error: `product ${it.product_id} not found` });
    newItems.push({
      product_id: product.id,
      quantity: Number(it.quantity) || 1,
      unit_price: product.price,
    });
  }

  const order: Order = { id: orderId, items: newItems, created_at: new Date() };
  orders.push(order);
  res.status(201).json(order);
};

export const getOrders = (req: Request, res: Response) => {
  res.json(orders);
};

export const getOrderById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: "not found" });
  const detailedItems = order.items.map((it) => {
    const product = products.find((p) => p.id === it.product_id);
    const total = it.quantity * it.unit_price;
    return { ...it, product_name: product?.name, total };
  });
  const grandTotal = detailedItems.reduce((s, i) => s + i.total, 0);
  res.json({ ...order, items: detailedItems, grandTotal });
};

export const updateOrder = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { items } = req.body;

  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: "order not found" });

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items required for update" });
  }

  const updatedItems = [];

  for (const it of items) {
    const product = products.find((p) => p.id === it.product_id);
    if (!product) {
      return res
        .status(400)
        .json({ error: `product ${it.product_id} not found` });
    }
    updatedItems.push({
      product_id: product.id,
      quantity: Number(it.quantity) || 1,
      unit_price: product.price,
    });
  }

  order.items = updatedItems;
  order.created_at = new Date();

  res.json({
    message: "Order updated successfully",
    order,
  });
};

export const deleteOrder = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return res.status(404).json({ error: "not found" });
  orders.splice(index, 1);
  res.status(204).send();
};
