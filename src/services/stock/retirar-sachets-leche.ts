import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const retirarSachetsLeche = async (cantidad: number) => {
  if (cantidad <= 0) {
    throw new Error("La cantidad debe ser mayor a 0");
  }

  const stockRef = doc(db, "stock", "leche");

  await runTransaction(db, async (transaction) => {
    const stockSnap = await transaction.get(stockRef);

    if (!stockSnap.exists()) {
      throw new Error("No existe el documento stock/leche");
    }

    const sachetsActuales = Number(stockSnap.data().sachets ?? 0);

    if (cantidad > sachetsActuales) {
      throw new Error("No podés retirar más sachets de los disponibles");
    }

    transaction.update(stockRef, {
      sachets: sachetsActuales - cantidad,
      updatedAt: serverTimestamp(),
    });
  });
};
