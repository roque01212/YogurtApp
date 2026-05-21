import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UserRole } from "./authTypes";

export const loginWithEmail = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email.trim(), password);
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  console.log("UID buscado:", uid);
  console.log("Existe doc usuario:", userSnap.exists());
  console.log("Data usuario:", userSnap.data());

  if (!userSnap.exists()) return null;

  const role = userSnap.data().role;

  if (role === "admin" || role === "viewer") {
    return role;
  }

  return null;
};
