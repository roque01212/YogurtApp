import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { Venta } from "@/interface/venta";

export const actualizarPago = async (venta: Venta) => {
  const ventaRef = doc(db, "ventas", venta.id);
  const cajaRef = doc(db, "caja", "efectivo");
  const movimientoRef = doc(db, "movimientos", venta.id);

  await runTransaction(db, async (transaction) => {
    const ventaSnap = await transaction.get(ventaRef);
    const cajaSnap = await transaction.get(cajaRef);
    const movimientoSnap = await transaction.get(movimientoRef);

    if (!ventaSnap.exists()) {
      throw new Error("No existe la venta.");
    }

    if (!movimientoSnap.exists()) {
      throw new Error("No existe el movimiento");
    }
    if (!cajaSnap.exists()) {
      throw new Error("No existe el documento caja/efectivo.");
    }

    const ventaData = ventaSnap.data();
    const cajaData = cajaSnap.data();

    if (ventaData.isPaid) {
      throw new Error("La venta ya fue marcada como pagada.");
    }

    const totalVenta = Number(ventaData.total ?? venta.total ?? 0);
    const cajaActual = Number(cajaData.total ?? 0);

    if (!Number.isFinite(totalVenta) || totalVenta <= 0) {
      throw new Error("La venta no tiene un total valido.");
    }

    transaction.update(ventaRef, {
      isPaid: true,
      paidAt: serverTimestamp(),
    });

    transaction.update(movimientoRef, {
      isPaid: true,
      paidAt: serverTimestamp(),
    });
    transaction.update(cajaRef, {
      total: cajaActual + totalVenta,
      updatedAt: serverTimestamp(),
    });
  });
};
