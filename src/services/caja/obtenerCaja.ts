import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const obtenerCaja = async () => {
  const cajaRef = doc(db, "caja", "efectivo");
  const snap = await getDoc(cajaRef);

  if (!snap.exists()) return null;
  return snap.data();
};
