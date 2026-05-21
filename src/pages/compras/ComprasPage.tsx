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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Compra>({
    defaultValues: {
      nombrePersonalizado: "",
      cantidad: 0,
      precio: 0,
    },
  });

  const onSubmit = async (compraLike: Compra) => {
    const productoSeleccionado = productos.find(
      (p) => p.id === selectedProduct,
    );

    if (!productoSeleccionado) {
      throw new Error("Producto inválido.");
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
    reset();
    setSelectedProduct("promo_21");
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4 py-6">
      <h1 className="text-2xl text-white mb-6">Registrar Compra</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid sm:grid-cols-3 gap-3"
      >
        {/* SELECT PRODUCTO */}
        <div>
          <label className="text-sm text-white">Producto</label>
          <select
            value={selectedProduct}
            onChange={(e) =>
              setSelectedProduct(e.target.value as Producto["id"])
            }
            className="w-full rounded-xl border border-white/10 bg-purple-950 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
          >
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* INPUT EXTRA SI ES "OTRO" */}
        {selectedProduct === "otro" && (
          <CustomInput
            {...register("nombrePersonalizado", { required: true })}
            label="Nombre del producto"
            placeholder="Ej: Leche suelta, cucharas, etc"
            error={errors.nombrePersonalizado && "Este campo es obligatorio"}
          />
        )}

        {/* CANTIDAD */}
        <CustomInput
          {...register("cantidad", {
            required: true,
            valueAsNumber: true,
            min: 1,
          })}
          label="Cantidad"
          type="number"
          placeholder="0"
          error={errors.cantidad && "Cantidad inválida"}
        />

        {/* PRECIO */}
        <CustomInput
          {...register("precio", {
            required: true,
            valueAsNumber: true,
            min: 1,
          })}
          label="Precio pagado"
          type="number"
          placeholder="0"
          error={errors.precio && "Precio inválido"}
        />

        <div className="sm:col-span-3 flex justify-center mt-4">
          <CustomButton disabled={isSubmitting} type="submit">
            {isSubmitting ? "Registrando..." : "Registrar Compra"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};
