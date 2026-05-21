import { useForm } from "react-hook-form";
import { CustomInput } from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import { registrarVenta } from "../../services/ventas/registrar-venta";
import type { Venta } from "../../interface/venta";

export const VentasPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Venta>({
    defaultValues: {
      product: "",
      quantity: 0,
      price: 0,
      isPaid: false,
    },
  });

  const onSubmit = async (ventaLike: Venta) => {
    try {
      await registrarVenta(ventaLike);

      reset({
        product: "",
        quantity: 0,
        price: 0,
        isPaid: false,
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la venta. Intentá nuevamente.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4 py-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Ventas
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Registrá productos vendidos
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
        <form
          className="grid gap-3 sm:grid-cols-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CustomInput
            {...register("product", { required: true })}
            label="Producto"
            placeholder="Ej: Yogurt 1kg"
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
            label="Precio"
            placeholder="Precio del kilo"
            type="number"
            error={errors.price && "El precio debe ser mayor a cero"}
          />

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 sm:col-span-3">
            <div>
              <p className="text-sm font-medium text-zinc-100">¿Pagado?</p>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                {...register("isPaid")}
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-white"
              />

              <span className="text-sm text-zinc-200">Pagado</span>
            </label>
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:col-span-3 sm:flex-row sm:justify-center">
            <CustomButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar venta"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};
