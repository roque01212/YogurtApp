import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const retirarCaja = async (monto: number, motivo: string) => {
  const motivoLimpio = motivo.trim();

  if (!Number.isFinite(monto) || monto <= 0) {
    throw new Error("El monto debe ser mayor a cero.");
  }

  if (!motivoLimpio) {
    throw new Error("Ingresa un motivo para el retiro.");
  }

  const cajaRef = doc(db, "caja", "efectivo");
  const movimientosRef = collection(db, "movimientos");

  await runTransaction(db, async (transaction) => {
    const cajaSnap = await transaction.get(cajaRef);

    if (!cajaSnap.exists()) {
      throw new Error("No existe el documento caja/efectivo.");
    }

    const cajaActual = Number(cajaSnap.data().total ?? 0);

    if (monto > cajaActual) {
      const montoFormateado = monto.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
      });
      const cajaFormateada = cajaActual.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
      });

      throw new Error(
        `No podes retirar ${montoFormateado}. En caja hay ${cajaFormateada}.`,
      );
    }

    const nuevoMovimientoRef = doc(movimientosRef);

    transaction.update(cajaRef, {
      total: cajaActual - monto,
      updatedAt: serverTimestamp(),
    });

    transaction.set(nuevoMovimientoRef, {
      tipo: "retiro",
      descripcion: motivoLimpio,
      total: monto,
      monto,
      createdAt: serverTimestamp(),
    });
  });
};
