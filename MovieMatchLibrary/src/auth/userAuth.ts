import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const handleSignup = async (
  email: string,
  pswd: string,
  firstname: string,
  lastname: string,
  dateofbirth: string,
  photoUrl: string = "",
  stayLoggedIn: boolean = true
) => {
  await setPersistence(
    auth,
    stayLoggedIn ? browserLocalPersistence : browserSessionPersistence
  );

  const userCredential = await createUserWithEmailAndPassword(auth, email, pswd);
  const uid = userCredential.user.uid;

  try {
    await setDoc(doc(db, "users", uid), {
      first_name: firstname,
      last_name: lastname,
      date_of_birth: dateofbirth,
      photo_url: photoUrl,
      email: email,
      role: "user",
      liked_movies: [],
      disabled: false,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    await userCredential.user.delete();
    throw error;
  }

  return userCredential.user;
};

export const handleLogin = async (
  email: string,
  pswd: string,
  stayLoggedIn: boolean = true
) => {
  await setPersistence(
    auth,
    stayLoggedIn ? browserLocalPersistence : browserSessionPersistence
  );

  const userCredential = await signInWithEmailAndPassword(auth, email, pswd);

  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

  if (userDoc.exists() && userDoc.data()?.disabled) {
    await signOut(auth);
    throw new Error("Your account has been banned. Please contact support.");
  }

  return userCredential.user;
};

export const calculateAge = (dobString?: string): number | null => {
  if (!dobString) return null;

  const birthDate = new Date(dobString);

  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : null;
};

export const handleLogout = async () => {
  await signOut(auth);
};