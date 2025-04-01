import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";

const signup = async (email, password, username) => {
  try {
    const usernameDocRef = doc(db, "usernames", username);
    const usernameDocSnap = await getDoc(usernameDocRef);
    if (usernameDocSnap.exists()) {
      throw new Error("Username already taken!");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(usernameDocRef, { email });

    await setDoc(doc(db, "users", user.uid), {
      email,
      username,
      currentBalance: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    });

    console.log("User created and saved", user.uid);
    return user;
  } catch (error) {
    console.error("Signup error!", error);
    throw error;
  }
};

const login = async (identifier, password) => {
  try {
    let email = identifier;

    if (!identifier.includes("@")) {
      const usernameDocRef = doc(db, "usernames", identifier);
      const usernameDocSnap = await getDoc(usernameDocRef);
      if (!usernameDocSnap.exists()) {
        throw new Error("Username not found!");
      }
      email = usernameDocSnap.data().email;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login Error!", error);
    throw error;
  }
};

const logout = async () => {
  await signOut(auth);
};

export { signup, login, logout };
