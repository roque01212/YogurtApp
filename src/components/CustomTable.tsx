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
    // hour: "2-digit",
    // minute: "2-digit",
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
          <TableHead className="text-zinc-300 text-center">Producto</TableHead>
          <TableHead className="text-zinc-300 text-center">Cantidad</TableHead>

          <TableHead className="text-zinc-300 text-center">Total</TableHead>
          <TableHead className="text-zinc-300 text-center">Fecha</TableHead>
          <TableHead className="text-right text-zinc-300">Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {ventas.map((venta) => {
          const total = venta.total ?? venta.quantity * venta.price;

          return (
            <TableRow
              key={venta.id}
              className="border-white/10 hover:bg-white/5 "
            >
              <TableCell className="font-medium text-zinc-100 text-center ">
                {venta.product}
              </TableCell>

              <TableCell className="text-zinc-300 text-center ">
                {venta.quantity}
              </TableCell>

              <TableCell className="font-medium text-zinc-100 text-center  ">
                {formatearPrecio(total)}
              </TableCell>

              <TableCell className="text-zinc-400 text-center">
                {formatearFecha(venta.createdAt)}
              </TableCell>

              <TableCell className="text-right ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      <MoreHorizontalIcon className="size-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="bg-purple-500 hover:bg-purple-900 p-0 "
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
