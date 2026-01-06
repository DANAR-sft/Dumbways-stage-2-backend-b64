import { Request, Response } from "express";
import { products } from "../models/data-dummy";

export const createProduct = (req: Request, res: Response) => {
  const { name, price, description } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const id = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = { id, name, price: Number(price) || 0, description };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

export const getProducts = (req: Request, res: Response) => {
  res.json(products);
};

export const getProductById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "not found" });
  res.json(product);
};

export const updateProduct = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, price, description } = req.body;
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "not found" });
  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.description = description ?? product.description;
  res.json(product);
};

export const deleteProduct = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "not found" });
  products.splice(index, 1);
  res.status(204).send();
};
