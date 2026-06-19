import { use, useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../context/auth-context-value";
import { obtenerCaja } from "../../services/caja/obtenerCaja";
import { obtenerStock } from "../../services/stock/obtener-stock";

const formatearPrecio = (valor: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(valor);
};

const accesosDinero = [
  {
    link: "ventas",
    title: "Registrar venta",
    description: "Carga una venta nueva.",
    primary: true,
  },
  {
    link: "deudas",
    title: "Deudas y pagos",
    description: "Revisa cobros pendientes.",
    primary: false,
  },
  {
    link: "caja",
    title: "Retirar dinero",
    description: "Registra una salida de caja.",
    primary: false,
  },
];

const accesosProduccion = [
  {
    link: "compras",
    title: "Registrar compra",
    description: "Leche, potes e insumos.",
  },
  {
    link: "stock",
    title: "Controlar stock",
    description: "Sachets y retiros.",
  },
  {
    link: "historial",
    title: "Movimientos",
    description: "Ventas y compras cargadas.",
  },
];

export const HomePage = () => {
  const { isAdmin, user } = use(AuthContext);

  const [caja, setCaja] = useState(0);
  const [sachetsDisponibles, setSachetsDisponibles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const cargarDatosHome = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const stockData = await obtenerStock();
      setSachetsDisponibles(stockData.sachets);

      if (isAdmin) {
        const cajaData = await obtenerCaja();

        if (cajaData) {
          setCaja(cajaData.total);
        }
      }
    } catch {
      setErrorMessage("No se pudieron cargar los datos del inicio.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!user) return;
    cargarDatosHome();
  }, [cargarDatosHome, user]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-medium text-zinc-300">
            Cargando datos del inicio...
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {isAdmin && (
              <div className="h-28 animate-pulse rounded-xl bg-white/10" />
            )}
            <div className="h-28 animate-pulse rounded-xl bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
        <p className="font-semibold">{errorMessage}</p>
        <p className="mt-1 text-red-200/80">
          Revisa la conexion e intenta nuevamente.
        </p>
      </div>
    );
  }

  const stockBajo = sachetsDisponibles <= 5;

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-white/10 bg-white/5 p-5 text-zinc-100 shadow-sm">
        <p className="text-sm font-semibold text-emerald-200">
          Caja y produccion
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Resumen operativo
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-300">
              Informacion principal para vender, cobrar y preparar produccion
              durante el dia.
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/ventas"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-50 shadow-sm transition hover:bg-emerald-400/25 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Registrar venta
            </Link>
          )}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Dinero</h2>
              <p className="text-sm text-zinc-400">Ventas, caja y cobros.</p>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Caja
            </span>
          </div>

          {isAdmin && (
            <article className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-sm font-medium text-emerald-100">
                Plata disponible en caja
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                {formatearPrecio(caja)}
              </p>
              <p className="mt-2 text-sm text-emerald-100/70">
                Total registrado como pagado.
              </p>
            </article>
          )}

          {isAdmin && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {accesosDinero.map((acceso) => (
                <Link
                  key={acceso.link}
                  to={`/${acceso.link}`}
                  className={`rounded-xl border p-4 transition focus:outline-none focus:ring-2 focus:ring-white/30 ${
                    acceso.primary
                      ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-50 hover:bg-emerald-400/25"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <p className="text-sm font-semibold">{acceso.title}</p>
                  <p
                    className={`mt-1 text-sm ${
                      acceso.primary ? "text-emerald-50/75" : "text-zinc-400"
                    }`}
                  >
                    {acceso.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Produccion</h2>
              <p className="text-sm text-zinc-400">Leche, stock e insumos.</p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                stockBajo
                  ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                  : "border-sky-400/30 bg-sky-400/10 text-sky-200"
              }`}
            >
              {stockBajo ? "Stock bajo" : "Stock OK"}
            </span>
          </div>

          <article
            className={`rounded-xl border p-4 ${
              stockBajo
                ? "border-amber-400/20 bg-amber-400/10"
                : "border-sky-400/20 bg-sky-400/10"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                stockBajo ? "text-amber-100" : "text-sky-100"
              }`}
            >
              Sachets de leche disponibles
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {sachetsDisponibles} unidades
            </p>
            <p
              className={`mt-2 text-sm ${
                stockBajo ? "text-amber-100/80" : "text-sky-100/70"
              }`}
            >
              {stockBajo
                ? "Conviene revisar compras antes de producir."
                : "Cantidad actual registrada en stock."}
            </p>
          </article>

          {isAdmin && (
            <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {accesosProduccion.map((acceso) => (
                <Link
                  key={acceso.link}
                  to={`/${acceso.link}`}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <p className="text-sm font-semibold">{acceso.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {acceso.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};
