import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const obtenerStock = async () => {
  const stockRef = doc(db, "stock", "leche");
  const stockSnap = await getDoc(stockRef);

  if (!stockSnap.exists()) return { sachets: 0 };
  return {
    sachets: Number(stockSnap.data().sachets),
  };
};
