import { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomButton } from "../../components/CustomButton";
import { CustomInput } from "../../components/CustomInput";
import { registrarCompra } from "../../services/compras/registrar-compra";
import type { Compra } from "../../interface/compra";

interface Producto {
  id: string;
  nombre: string;
}

const productos: Producto[] = [
  { id: "promo_21", nombre: "Promo leche x21 sachets" },
  { id: "leche_suelta", nombre: "Leche en caja" },
  { id: "pote_250", nombre: "Recipiente 1/4 kg" },
  { id: "pote_500", nombre: "Recipiente 1/2 kg" },
  { id: "pote_1000", nombre: "Recipiente 1 kg" },
  { id: "otro", nombre: "Otro producto" },
];

export const ComprasPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Producto["id"]>(
    productos[0].id,
  );
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Compra>({
    defaultValues: {
      nombrePersonalizado: "",
    },
  });

  const onSubmit = async (compraLike: Compra) => {
    try {
      setMessage("");
      setErrorMessage("");

      const productoSeleccionado = productos.find(
        (p) => p.id === selectedProduct,
      );

      if (!productoSeleccionado) {
        throw new Error("Producto invalido.");
      }

      const nombreFinal =
        selectedProduct === "otro"
          ? (compraLike.nombrePersonalizado ?? "")
          : productoSeleccionado.nombre;

      const compraFinal: Compra = {
        productId: selectedProduct,
        producto: nombreFinal,
        cantidad: compraLike.cantidad,
        precio: compraLike.precio,
      };

      await registrarCompra(compraFinal);
      setMessage("Compra registrada correctamente.");
      reset();
      setSelectedProduct("promo_21");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la compra.",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl py-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-emerald-200">Compras</p>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Registrar compra
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Carga leche, potes u otros insumos del negocio.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm sm:grid-cols-3"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-300">
            Producto
          </label>
          <select
            value={selectedProduct}
            onChange={(e) =>
              setSelectedProduct(e.target.value as Producto["id"])
            }
            className="min-h-11 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/20"
          >
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct === "otro" && (
          <CustomInput
            {...register("nombrePersonalizado", { required: true })}
            label="Nombre del producto"
            placeholder="Ej: cucharas, bolsas, etiquetas"
            error={errors.nombrePersonalizado && "Este campo es obligatorio"}
          />
        )}

        <CustomInput
          {...register("cantidad", {
            required: true,
            valueAsNumber: true,
            min: 1,
          })}
          label="Cantidad"
          type="number"
          placeholder="Ej: 21"
          error={errors.cantidad && "Cantidad invalida"}
        />

        <CustomInput
          {...register("precio", {
            required: true,
            valueAsNumber: true,
            min: 1,
          })}
          label="Precio unitario"
          type="number"
          placeholder="Ej: 1200"
          error={errors.precio && "Precio invalido"}
        />

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
          <CustomButton disabled={isSubmitting} type="submit" variant="primary">
            {isSubmitting ? "Registrando..." : "Registrar compra"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};
