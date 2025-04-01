"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const useFinanceData = () => {
  const [financeData, setFinanceData] = useState({
    omzet: 0,
    currentBalance: 0,
  });

  useEffect(() => {
    const financeRef = doc(db, "financeData", "main");

    const unsubscribe = onSnapshot(financeRef, (docSnap) => {
      if (docSnap.exists()) {
        setFinanceData(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, []);

  return financeData;
};

export default useFinanceData;
