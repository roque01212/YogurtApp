export interface Venta {
  id: string;
  product: string;
  quantity: number;
  price: number;
  isPaid: boolean;
  createdAt: Date;
  total?: number;
}
