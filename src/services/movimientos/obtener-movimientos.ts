import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { Movimiento } from "../../interface/movimiento";

interface ObtenerMovimientosResponse {
  movimientos: Movimiento[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

export const obtenerMovimientos = async (
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
): Promise<ObtenerMovimientosResponse> => {
  const movimientosRef = collection(db, "movimientos");

  const q = lastDoc
    ? query(
        movimientosRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(10),
      )
    : query(movimientosRef, orderBy("createdAt", "desc"), limit(10));

  const movimientosSnapshot = await getDocs(q);
  const docs = movimientosSnapshot.docs;

  const movimientos: Movimiento[] = docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...(doc.data() as Omit<Movimiento, "id">),
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
  const nuevoLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;
  return { movimientos, lastDoc: nuevoLastDoc };
};
