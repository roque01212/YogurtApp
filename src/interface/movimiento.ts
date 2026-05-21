export interface Movimiento {
  id: string;
  tipo: string;
  referenciaId?: string;
  descripcion: string;
  cantidad?: number;
  precio?: number;
  total: number;
  monto?: number;
  isPaid?: boolean;
  createdAt: Date | null;
}
