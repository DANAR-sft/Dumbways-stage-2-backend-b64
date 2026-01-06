export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  created_at: Date;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Keyboard",
    price: 250000,
    description: "Mechanical keyboard",
  },
  { id: 2, name: "Mouse", price: 150000, description: "Wireless mouse" },
  { id: 3, name: "Monitor", price: 1250000, description: "24 inch 144Hz" },
];

export const orders: Order[] = [];
