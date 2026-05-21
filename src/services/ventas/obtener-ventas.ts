import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { Venta } from "../../interface/venta";

export const obtenerVentas = async (): Promise<Venta[]> => {
  const ventaRef = collection(db, "ventas");
  const q = query(ventaRef, where("isPaid", "==", false));
  const snapshot = await getDocs(q);

  const ventas = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...(data as Omit<Venta, "id">),
      id: doc.id,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
    };
  });
  return ventas;
};
