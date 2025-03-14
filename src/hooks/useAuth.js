"use client";
import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { onSnapshot, collection } from "firebase/firestore";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [unsubscribeFirestore, setUnsubscribeFirestore] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (pathname !== "/login") {
          router.push("/login");
        }
      } else {
        setUser(user);

        const unsubscribe = onSnapshot(
          collection(db, "testCollection"),
          (snapshot) => {
            console.log("Firebase listener active");
          }
        );
        setUnsubscribeFirestore(() => unsubscribe);
      }
    });
    return () => unsubscribeAuth();
  }, [pathname]);

  const logout = async () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
    await signOut(auth);
    router.push("/login");
  };

  return { user, logout };
};

export default useAuth;
