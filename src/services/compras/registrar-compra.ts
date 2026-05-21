import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import type { Compra } from "../../interface/compra";
import { db } from "../../firebase/firebase";

export const registrarCompra = async (compra: Compra) => {
  const totalCompra = compra.cantidad * compra.precio;

  const cajaRef = doc(db, "caja", "efectivo");
  const compraRef = collection(db, "compras");
  const stockLecheRef = doc(db, "stock", "leche");

  await runTransaction(db, async (transaction) => {
    const cajaSnap = await transaction.get(cajaRef);
    const stockLecheSnap = await transaction.get(stockLecheRef);

    if (!cajaSnap.exists()) {
      throw new Error("La caja no existe");
    }

    if (!stockLecheSnap.exists()) {
      throw new Error("No existe el documento stock/leche");
    }

    const cajaActual = cajaSnap.data().total ?? 0;
    const sachetsActuales = Number(stockLecheSnap.data().sachets ?? 0);

    const sachetsAgregados =
      compra.productId === "promo_21" ? compra.cantidad * 21 : 0;

    const nuevaCompraRef = doc(compraRef);
    const nuevoMovimientoRef = doc(db, "movimientos", nuevaCompraRef.id);

    transaction.set(nuevaCompraRef, {
      ...compra,
      total: totalCompra,
      createdAt: serverTimestamp(),
    });

    transaction.update(cajaRef, {
      total: cajaActual - totalCompra,
      updatedAt: serverTimestamp(),
    });

    if (sachetsAgregados > 0) {
      transaction.update(stockLecheRef, {
        sachets: sachetsActuales + sachetsAgregados,
        updatedAt: serverTimestamp(),
      });
    }

    transaction.set(nuevoMovimientoRef, {
      tipo: "compra",
      descripcion: compra.producto,
      cantidad: compra.cantidad,
      precio: compra.precio,
      total: totalCompra,
      sachetsAgregados,
      createdAt: serverTimestamp(),
    });
  });
};
