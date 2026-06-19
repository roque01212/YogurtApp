import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { obtenerCaja } from "../../services/caja/obtenerCaja";
import { retirarCaja } from "../../services/caja/retirarCaja";

type RetiroCajaForm = {
  monto: number;
  motivo: string;
};

const formatearPrecio = (valor: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(valor);
};

export const RetirarCajaPage = () => {
  const [caja, setCaja] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RetiroCajaForm>({
    defaultValues: {
      motivo: "",
    },
  });

  const cargarCaja = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const cajaData = await obtenerCaja();

      if (!cajaData) {
        throw new Error("No se encontro la caja.");
      }

      setCaja(Number(cajaData.total ?? 0));
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "No se pudo cargar la caja.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCaja();
  }, []);

  const onSubmit = async (data: RetiroCajaForm) => {
    try {
      setMessage("");
      setErrorMessage("");

      await retirarCaja(data.monto, data.motivo);

      setMessage("Retiro registrado correctamente.");
      reset();
      await cargarCaja();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo registrar el retiro.",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl py-6">
      <div>
        <p className="text-sm font-semibold text-emerald-200">Caja</p>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Retirar dinero
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Registra dinero que sale de caja sin permitir que el saldo quede
          negativo.
        </p>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-100">
            Disponible en caja
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white">
            {loading ? "..." : formatearPrecio(caja)}
          </p>
          <p className="mt-2 text-sm text-emerald-100/70">
            Saldo actual antes de registrar el retiro.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-white">Nuevo retiro</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Indica cuanto retiras y para que se uso.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <CustomInput
              {...register("monto", {
                required: true,
                valueAsNumber: true,
                min: 1,
              })}
              label="Monto"
              placeholder="Ej: 15000"
              type="number"
              max={caja}
              error={errors.monto && "Ingresa un monto valido"}
            />

            <CustomInput
              {...register("motivo", {
                required: true,
                minLength: 3,
              })}
              label="Motivo"
              placeholder="Ej: retiro personal o pago de servicio"
              type="text"
              error={errors.motivo && "Ingresa un motivo"}
            />

            {message && (
              <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
                {message}
              </p>
            )}

            {errorMessage && (
              <p
                className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <CustomButton
              type="submit"
              disabled={isSubmitting || loading || caja <= 0}
              variant="primary"
            >
              {isSubmitting ? "Registrando..." : "Registrar retiro"}
            </CustomButton>
          </form>
        </div>
      </section>
    </div>
  );
};
