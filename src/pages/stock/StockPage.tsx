import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { obtenerStock } from "../../services/stock/obtener-stock";
import { retirarSachetsLeche } from "../../services/stock/retirar-sachets-leche";

type RetiroForm = {
  cantidad: number;
};

export const StockPage = () => {
  const [sachets, setSachets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RetiroForm>();

  const cargarStock = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await obtenerStock();
      setSachets(data.sachets);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cargar el stock de leche.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarStock();
  }, []);

  const onSubmit = async (data: RetiroForm) => {
    try {
      setMessage("");
      setErrorMessage("");

      await retirarSachetsLeche(data.cantidad);

      setMessage("Sachets retirados correctamente.");
      reset();

      await cargarStock();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("No se pudo retirar stock.");
      }
    }
  };

  const stockBajo = sachets <= 5;

  return (
    <div className="mx-auto w-full max-w-4xl py-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-200">Stock</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Control de leche
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Sachets disponibles y retiros para produccion.
          </p>
        </div>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div
          className={`rounded-2xl border p-5 shadow-sm ${
            stockBajo
              ? "border-amber-400/30 bg-amber-400/10"
              : "border-sky-400/20 bg-sky-400/10"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              stockBajo ? "text-amber-100" : "text-sky-100"
            }`}
          >
            Sachets disponibles
          </p>

          <p className="mt-2 text-4xl font-bold tracking-tight text-white">
            {loading ? "..." : sachets}
          </p>

          <p
            className={`mt-2 text-sm ${
              stockBajo ? "text-amber-100/80" : "text-sky-100/70"
            }`}
          >
            {stockBajo
              ? "Stock bajo: conviene revisar compras."
              : "El stock aumenta cuando registras una promo de leche."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-white">Retirar sachets</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Usalo cuando consumis leche para produccion o retiras unidades.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <CustomInput
              {...register("cantidad", {
                required: true,
                valueAsNumber: true,
                min: 1,
              })}
              label="Cantidad a retirar"
              placeholder="Ej: 3"
              type="number"
              error={errors.cantidad && "Ingresa una cantidad valida"}
            />

            {message && (
              <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
                {message}
              </p>
            )}

            {errorMessage && (
              <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            <CustomButton type="submit" disabled={isSubmitting} variant="primary">
              {isSubmitting ? "Retirando..." : "Retirar"}
            </CustomButton>
          </form>
        </div>
      </section>
    </div>
  );
};
