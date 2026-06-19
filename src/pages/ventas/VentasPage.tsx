import { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomInput } from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import { registrarVenta } from "../../services/ventas/registrar-venta";
import type { Venta } from "../../interface/venta";

export const VentasPage = () => {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Venta>({
    defaultValues: {
      product: "",
      isPaid: false,
    },
  });

  const onSubmit = async (ventaLike: Venta) => {
    try {
      setMessage("");
      setErrorMessage("");

      await registrarVenta(ventaLike);
      setMessage("Venta registrada correctamente.");

      reset({
        product: "",
        isPaid: false,
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la venta.",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl py-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-200">Ventas</p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Registrar venta
          </h1>
        </div>

        <p className="text-sm text-zinc-400">
          Carga productos vendidos y marca si ya fueron pagados.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
        <form
          className="grid gap-4 sm:grid-cols-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CustomInput
            {...register("product", { required: true })}
            label="Producto"
            placeholder="Ej: Yogurt 1 kg"
            type="text"
            error={errors.product && "El producto es requerido"}
          />

          <CustomInput
            {...register("quantity", {
              required: true,
              valueAsNumber: true,
              min: 1,
            })}
            label="Cantidad"
            placeholder="Cantidad vendida"
            type="number"
            error={errors.quantity && "La cantidad debe ser mayor a cero"}
          />

          <CustomInput
            {...register("price", {
              required: true,
              valueAsNumber: true,
              min: 1,
            })}
            label="Precio unitario"
            placeholder="Precio por unidad"
            type="number"
            error={errors.price && "El precio debe ser mayor a cero"}
          />

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/40 p-3 sm:col-span-3">
            <div>
              <p className="text-sm font-semibold text-zinc-100">Pagado</p>
              <p className="text-xs text-zinc-500">
                Si esta marcado, suma el total a caja.
              </p>
            </div>

            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-2">
              <input
                {...register("isPaid")}
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-emerald-300"
              />

              <span className="text-sm text-zinc-200">Ya pago</span>
            </label>
          </div>

          {message && (
            <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100 sm:col-span-3">
              {message}
            </p>
          )}

          {errorMessage && (
            <p
              className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 sm:col-span-3"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end pt-2 sm:col-span-3">
            <CustomButton type="submit" disabled={isSubmitting} variant="primary">
              {isSubmitting ? "Registrando..." : "Registrar venta"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};
