"use client";
import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { onSnapshot, collection, doc, getDoc } from "firebase/firestore";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [unsubscribeFirestore, setUnsubscribeFirestore] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(true);
        setUser(null);
        setUsername("");
        if (pathname !== "/login") {
          router.push("/login");
        }
        return;
      }
      setUser(user);

      try {
        setLoading(true);

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUsername(userDocSnap.data().username);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [pathname, router]);

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return { user, username, logout, loading };
};
export default useAuth;
