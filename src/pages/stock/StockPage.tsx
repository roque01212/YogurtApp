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
  } = useForm<RetiroForm>({
    defaultValues: {
      cantidad: 0,
    },
  });

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

  return (
    <div className="mx-auto w-full max-w-4xl p-4 py-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Stock
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Control de sachets de leche disponibles.
          </p>
        </div>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <p className="text-sm text-zinc-400">Sachets disponibles</p>

          <p className="mt-2 text-4xl font-bold text-zinc-100">
            {loading ? "..." : sachets}
          </p>

          <p className="mt-2 text-xs text-zinc-500">
            Este stock se incrementa cuando registrás una promo de leche.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-100">
            Retirar sachets
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Usalo cuando consumís leche para producción o retirás unidades.
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
              error={errors.cantidad && "Ingresá una cantidad válida"}
            />

            {message && (
              <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-200">
                {message}
              </p>
            )}

            {errorMessage && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            <CustomButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Retirando..." : "Retirar"}
            </CustomButton>
          </form>
        </div>
      </section>
    </div>
  );
};
