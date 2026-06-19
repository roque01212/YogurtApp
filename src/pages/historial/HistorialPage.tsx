import { useEffect, useMemo, useState } from "react";
import { obtenerMovimientos } from "../../services/movimientos/obtener-movimientos";
import type { Movimiento } from "../../interface/movimiento";
import { CustomButton } from "@/components/CustomButton";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const ITEMS_PER_PAGE = 10;

const formatearPrecio = (valor: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(valor);
};

const formatearFecha = (fecha?: Date | null) => {
  if (!fecha) return "Sin fecha";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(fecha);
};

type Tipos = "todos" | "venta" | "compra" | "retiro";

export const HistorialPage = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtroTipo, setFiltroTipo] = useState<Tipos>("todos");

  const [currentPage, setCurrentPage] = useState(1);

  const cargarMovimientos = async () => {
    try {
      setLoading(true);
      setError("");

      const respuesta = await obtenerMovimientos();

      setMovimientos(respuesta.movimientos);
      setLastDoc(respuesta.lastDoc);
      setHasMore(respuesta.movimientos.length === ITEMS_PER_PAGE);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar el historial de movimientos.");
    } finally {
      setLoading(false);
    }
  };

  const cargarMasMovimientos = async () => {
    if (!lastDoc) return false;

    try {
      setLoadingMore(true);
      setError("");

      const respuesta = await obtenerMovimientos(lastDoc);

      if (respuesta.movimientos.length === 0) {
        setHasMore(false);
        return false;
      }

      setMovimientos((prev) => [...prev, ...respuesta.movimientos]);
      setLastDoc(respuesta.lastDoc);
      setHasMore(respuesta.movimientos.length === ITEMS_PER_PAGE);

      return true;
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar mas movimientos.");
      return false;
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const movimientosFiltrados = useMemo(() => {
    if (filtroTipo === "todos") return movimientos;

    return movimientos.filter((movimiento) => movimiento.tipo === filtroTipo);
  }, [movimientos, filtroTipo]);

  const totalPages = Math.max(
    1,
    Math.ceil(movimientosFiltrados.length / ITEMS_PER_PAGE),
  );

  const movimientosPaginados = movimientosFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const cambiarFiltro = (tipo: Tipos) => {
    setFiltroTipo(tipo);
    setCurrentPage(1);
  };

  const handleAnterior = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSiguiente = async () => {
    const paginasCargadas = Math.ceil(
      movimientosFiltrados.length / ITEMS_PER_PAGE,
    );

    if (currentPage < paginasCargadas) {
      setCurrentPage((prev) => prev + 1);
      return;
    }

    if (!hasMore) return;

    const cargoMas = await cargarMasMovimientos();

    if (cargoMas) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const noHaySiguiente = !hasMore && currentPage >= totalPages;

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-zinc-400">Cargando historial...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-6xl py-6">
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5">
          <p className="text-sm font-medium text-red-200">{error}</p>

          <div className="mt-4">
            <CustomButton type="button" onClick={cargarMovimientos}>
              Reintentar
            </CustomButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-200">Historial</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Movimientos
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Consulta ventas, compras y retiros registrados.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
          <p className="font-semibold text-white">Movimientos cargados</p>
          <p className="text-2xl font-bold tracking-tight text-white">
            {movimientos.length}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => cambiarFiltro("todos")}
          className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            filtroTipo === "todos"
              ? "border border-white/20 bg-white/10 text-white"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          }`}
        >
          Todos
        </button>

        <button
          type="button"
          onClick={() => cambiarFiltro("venta")}
          className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            filtroTipo === "venta"
              ? "bg-emerald-400/20 text-emerald-100"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          }`}
        >
          Ventas
        </button>

        <button
          type="button"
          onClick={() => cambiarFiltro("compra")}
          className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            filtroTipo === "compra"
              ? "bg-red-500/20 text-red-100"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          }`}
        >
          Compras
        </button>

        <button
          type="button"
          onClick={() => cambiarFiltro("retiro")}
          className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            filtroTipo === "retiro"
              ? "bg-amber-400/20 text-amber-100"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          }`}
        >
          Retiros
        </button>
      </div>

      {movimientosFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">
            No hay movimientos para mostrar
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Proba cambiando el filtro o registra nuevas ventas y compras.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr className="text-left text-zinc-300">
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Descripcion</th>
                    <th className="px-4 py-3 text-center font-medium">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-center font-medium">Total</th>
                    <th className="px-4 py-3 text-center font-medium">
                      Estado
                    </th>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {movimientosPaginados.map((movimiento) => (
                    <tr
                      key={movimiento.id}
                      className="border-b border-white/10 last:border-0 hover:bg-white/5"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            movimiento.tipo === "venta"
                              ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                              : movimiento.tipo === "retiro"
                                ? "border border-amber-400/30 bg-amber-400/10 text-amber-200"
                                : "border border-red-400/30 bg-red-500/10 text-red-200"
                          }`}
                        >
                          {movimiento.tipo === "venta"
                            ? "Venta"
                            : movimiento.tipo === "retiro"
                              ? "Retiro"
                              : "Compra"}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-medium text-zinc-100">
                        {movimiento.descripcion}
                      </td>

                      <td className="px-4 py-3 text-center text-zinc-300">
                        {movimiento.cantidad ?? "-"}
                      </td>

                      <td className="px-4 py-3 text-center font-medium text-zinc-100">
                        {formatearPrecio(movimiento.total)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {movimiento.tipo === "venta" ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              movimiento.isPaid
                                ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                                : "border border-amber-400/30 bg-amber-400/10 text-amber-200"
                            }`}
                          >
                            {movimiento.isPaid ? "Pagado" : "Pendiente"}
                          </span>
                        ) : movimiento.tipo === "retiro" ? (
                          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                            Retirado
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                            Pagado
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-zinc-400">
                        {formatearFecha(movimiento.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-400">
              Mostrando pagina {currentPage} con {movimientosPaginados.length}{" "}
              movimientos
            </p>

            <div className="flex items-center gap-3">
              <CustomButton
                type="button"
                disabled={currentPage === 1}
                onClick={handleAnterior}
              >
                Anterior
              </CustomButton>

              <span className="text-sm text-zinc-300">
                Pagina {currentPage}
              </span>

              <CustomButton
                type="button"
                disabled={loadingMore || noHaySiguiente}
                onClick={handleSiguiente}
              >
                {loadingMore ? "Cargando..." : "Siguiente"}
              </CustomButton>
            </div>
          </div>

          {!hasMore && currentPage >= totalPages && (
            <p className="mt-4 text-center text-sm text-zinc-500">
              No hay mas movimientos para mostrar.
            </p>
          )}
        </>
      )}
    </section>
  );
};
