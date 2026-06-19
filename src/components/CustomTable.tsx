import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Venta } from "@/interface/venta";
import { CustomAlert } from "./CustomAlert";

interface Props {
  ventas: Venta[];
  onMarcarComoPagado: (venta: Venta) => void;
}

const formatearFecha = (fecha?: Date | null) => {
  if (!fecha) return "Sin fecha";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(fecha);
};

const formatearPrecio = (valor: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(valor);
};

export const CustomTable = ({ ventas, onMarcarComoPagado }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/10 hover:bg-transparent">
          <TableHead className="text-center text-zinc-300">Producto</TableHead>
          <TableHead className="text-center text-zinc-300">Cantidad</TableHead>
          <TableHead className="text-center text-zinc-300">Total</TableHead>
          <TableHead className="text-center text-zinc-300">Fecha</TableHead>
          <TableHead className="text-right text-zinc-300">Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {ventas.map((venta) => {
          const total = venta.total ?? venta.quantity * venta.price;

          return (
            <TableRow
              key={venta.id}
              className="border-white/10 hover:bg-white/5"
            >
              <TableCell className="text-center font-medium text-zinc-100">
                {venta.product}
              </TableCell>

              <TableCell className="text-center text-zinc-300">
                {venta.quantity}
              </TableCell>

              <TableCell className="text-center font-medium text-zinc-100">
                {formatearPrecio(total)}
              </TableCell>

              <TableCell className="text-center text-zinc-400">
                {formatearFecha(venta.createdAt)}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      <MoreHorizontalIcon className="size-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="border-white/10 bg-zinc-950 p-0"
                  >
                    <CustomAlert onConfirm={() => onMarcarComoPagado(venta)} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
