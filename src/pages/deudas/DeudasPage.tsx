import { useEffect, useState } from "react";
import type { Venta } from "../../interface/venta";
import { obtenerVentas } from "../../services/ventas/obtener-ventas";
import { CustomTable } from "@/components/CustomTable";
import { actualizarPago } from "@/services/ventas/actualizar-pago";

export const DeudasPage = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <section className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Deudas pendientes
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Ventas registradas que todavía no fueron pagadas.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
          Total pendientes:{" "}
          <span className="font-semibold text-white">{ventas.length}</span>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-zinc-400">Cargando deudas pendientes...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="text-sm font-medium text-red-300">{error}</p>
        </div>
      )}

      {!loading && !error && ventas.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-zinc-100">
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
