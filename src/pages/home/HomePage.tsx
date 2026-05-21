import { use, useEffect, useState } from "react";
import { CardLink } from "../../components/CardLink";
import { StatCard } from "../../components/StatCard";
import { AuthContext } from "../../context/AuthContext";
import { obtenerCaja } from "../../services/caja/obtenerCaja";
import { obtenerStock } from "../../services/stock/obtener-stock";

const formatearPrecio = (valor: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(valor);
};

export const HomePage = () => {
  const { isAdmin, user } = use(AuthContext);

  const [caja, setCaja] = useState(0);
  const [sachetsDisponibles, setSachetsDisponibles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const cargarDatosHome = async () => {
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
    } catch (error) {
      setErrorMessage("No se pudieron cargar los datos del inicio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    cargarDatosHome();
  }, [isAdmin, user]);

  if (loading) {
    return (
      <p className="text-sm text-zinc-400">Cargando datos del inicio...</p>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
        {errorMessage}
      </div>
    );
  }
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2">
        {isAdmin && (
          <StatCard
            title="Plata que dede haber en cajpa"
            description={"Plata en caja"}
            value={`${formatearPrecio(caja)}`}
          />
        )}

        <StatCard
          title="Sachets disponibles"
          description="Cantidad de sachets disponibles en stock"
          value={`${sachetsDisponibles} unidades`}
        />
      </section>

      {/* Accesos */}
      {isAdmin && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Accesos</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CardLink
              link="ventas"
              title="Ventas"
              description="Registrar ventas"
            />

            <CardLink
              link="compras"
              title="Compras"
              description="Leche, potes, insumos"
            />

            <CardLink
              link="stock"
              title="Stock"
              description="Saches, potos, leche en polvo"
            />

            <CardLink
              link="historial"
              title="Historial"
              description="Movimientos y filtros"
            />

            <CardLink
              link="deudas"
              title="Deudas y pagos"
              description=" Registrar deudas y pagos de clientes"
            />
          </div>
        </section>
      )}
    </>
  );
};
