import {
  doc,
  collection,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { Venta } from "../../interface/venta";

export const registrarVenta = async (venta: Venta) => {
  const totalVenta = venta.quantity * venta.price;

  const cajaRef = doc(db, "caja", "efectivo");
  const ventasRef = collection(db, "ventas");

  await runTransaction(db, async (transaction) => {
    const cajaSnap = await transaction.get(cajaRef);

    if (!cajaSnap.exists()) {
      throw new Error("No existe el documento caja/efectivo");
    }

    const cajaActual = Number(cajaSnap.data().total ?? 0);

    const nuevaVentaRef = doc(ventasRef);
    const nuevoMovimientoRef = doc(db, "movimientos", nuevaVentaRef.id);

    transaction.set(nuevaVentaRef, {
      ...venta,
      total: totalVenta,
      createdAt: serverTimestamp(),
    });

    transaction.set(nuevoMovimientoRef, {
      tipo: "venta",
      referenciaId: nuevaVentaRef.id,
      descripcion: venta.product,
      cantidad: venta.quantity,
      precio: venta.price,
      total: totalVenta,
      isPaid: venta.isPaid,
      createdAt: serverTimestamp(),
    });

    if (venta.isPaid) {
      transaction.update(cajaRef, {
        total: cajaActual + totalVenta,
        updatedAt: serverTimestamp(),
      });
    }
  });
};
