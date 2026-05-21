export interface Compra {
  id?: string;
  productId: string;
  producto: string;
  nombrePersonalizado?: string;
  cantidad: number;
  precio: number;
  total?: number;
}
