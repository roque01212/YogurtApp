import { useEffect, useMemo, useState } from "react";
import type { Venta } from "../../interface/venta";
import { obtenerVentas } from "../../services/ventas/obtener-ventas";
import { CustomTable } from "@/components/CustomTable";
import { actualizarPago } from "@/services/ventas/actualizar-pago";

const formatearPrecio = (valor: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(valor);
};

export const DeudasPage = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalPendiente = useMemo(() => {
    return ventas.reduce((acc, venta) => {
      const total = venta.total ?? venta.quantity * venta.price;
      return acc + total;
    }, 0);
  }, [ventas]);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError("");

      const ventasObtenidas = await obtenerVentas();
      setVentas(ventasObtenidas);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las deudas pendientes.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarComoPagado = async (venta: Venta) => {
    try {
      await actualizarPago(venta);

      setVentas((prev) => prev.filter((item) => item.id !== venta.id));
    } catch (error) {
      console.error(error);
      setError("No se pudo marcar la venta como pagada.");
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-200">Cobros</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Deudas pendientes
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Ventas registradas que todavia no fueron pagadas.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold">Total pendiente</p>
          <p className="text-2xl font-bold tracking-tight">
            {formatearPrecio(totalPendiente)}
          </p>
          <p className="text-xs text-amber-100/70">{ventas.length} ventas</p>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-zinc-400">Cargando deudas pendientes...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5">
          <p className="text-sm font-medium text-red-200">{error}</p>
        </div>
      )}

      {!loading && !error && ventas.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">
            No hay deudas pendientes
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Todas las ventas registradas figuran como pagadas.
          </p>
        </div>
      )}

      {!loading && !error && ventas.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
          <CustomTable
            ventas={ventas}
            onMarcarComoPagado={handleMarcarComoPagado}
          />
        </div>
      )}
    </section>
  );
};
