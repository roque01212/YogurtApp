import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const retirarSachetsLeche = async (cantidad: number) => {
  if (!Number.isFinite(cantidad) || cantidad <= 0) {
    throw new Error("La cantidad debe ser mayor a cero.");
  }

  if (!Number.isInteger(cantidad)) {
    throw new Error("La cantidad de sachets debe ser un numero entero.");
  }

  const stockRef = doc(db, "stock", "leche");

  await runTransaction(db, async (transaction) => {
    const stockSnap = await transaction.get(stockRef);

    if (!stockSnap.exists()) {
      throw new Error("No existe el documento stock/leche.");
    }

    const sachetsActuales = Number(stockSnap.data().sachets ?? 0);

    if (cantidad > sachetsActuales) {
      throw new Error(
        `No podes retirar ${cantidad} sachets. Solo hay ${sachetsActuales} disponibles.`,
      );
    }

    transaction.update(stockRef, {
      sachets: sachetsActuales - cantidad,
      updatedAt: serverTimestamp(),
    });
  });
};
