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

type Tipos = "todos" | "venta" | "compra";

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
      setError("No se pudieron cargar más movimientos.");
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

  const totalVentas = movimientos
    .filter((movimiento) => movimiento.tipo === "venta")
    .reduce((acc, movimiento) => acc + movimiento.total, 0);

  const totalCompras = movimientos
    .filter((movimiento) => movimiento.tipo === "compra")
    .reduce((acc, movimiento) => acc + movimiento.total, 0);

  const balance = totalVentas - totalCompras;

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
      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-zinc-400">Cargando historial...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
          <p className="text-sm font-medium text-red-300">{error}</p>

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
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Historial de movimientos
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Consultá las ventas, compras y movimientos registrados.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
          Movimientos cargados:{" "}
          <span className="font-semibold text-white">{movimientos.length}</span>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Total ventas cargadas</p>
          <p className="mt-1 text-xl font-semibold text-green-300">
            {formatearPrecio(totalVentas)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Total compras cargadas</p>
          <p className="mt-1 text-xl font-semibold text-red-300">
            {formatearPrecio(totalCompras)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-400">Balance cargado</p>
          <p
            className={`mt-1 text-xl font-semibold ${
              balance >= 0 ? "text-green-300" : "text-red-300"
            }`}
          >
            {formatearPrecio(balance)}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => cambiarFiltro("todos")}
          className={`rounded-xl px-4 py-2 text-sm transition ${
            filtroTipo === "todos"
              ? "bg-white text-black"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          }`}
        >
          Todos
        </button>

        <button
          type="button"
          onClick={() => cambiarFiltro("venta")}
          className={`rounded-xl px-4 py-2 text-sm transition ${
            filtroTipo === "venta"
              ? "bg-green-400 text-black"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          }`}
        >
          Ventas
        </button>

        <button
          type="button"
          onClick={() => cambiarFiltro("compra")}
          className={`rounded-xl px-4 py-2 text-sm transition ${
            filtroTipo === "compra"
              ? "bg-red-400 text-black"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
          }`}
        >
          Compras
        </button>
      </div>

      {movimientosFiltrados.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-zinc-100">
            No hay movimientos para mostrar
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Probá cambiando el filtro o registrá nuevas ventas y compras.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-left text-zinc-300">
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Descripción</th>
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
                              ? "border border-green-500/30 bg-green-500/10 text-green-300"
                              : "border border-red-500/30 bg-red-500/10 text-red-300"
                          }`}
                        >
                          {movimiento.tipo === "venta" ? "Venta" : "Compra"}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-medium text-zinc-100">
                        {movimiento.descripcion}
                      </td>

                      <td className="px-4 py-3 text-center text-zinc-300">
                        {movimiento.cantidad}
                      </td>

                      <td className="px-4 py-3 text-center font-medium text-zinc-100">
                        {formatearPrecio(movimiento.total)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {movimiento.tipo === "venta" ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              movimiento.isPaid
                                ? "border border-green-500/30 bg-green-500/10 text-green-300"
                                : "border border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                            }`}
                          >
                            {movimiento.isPaid ? "Pagado" : "Pendiente"}
                          </span>
                        ) : (
                          <span className="rounded-full border border-zinc-500/30 bg-zinc-500/10 px-3 py-1 text-xs font-semibold text-zinc-300">
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
              Mostrando página {currentPage} con {movimientosPaginados.length}{" "}
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
                Página {currentPage}
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
              No hay más movimientos para mostrar.
            </p>
          )}
        </>
      )}
    </section>
  );
};
