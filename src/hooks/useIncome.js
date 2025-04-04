import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

const useIncome = (userId) => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchIncome = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "income"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const incomeList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setIncome(incomeList);
      } catch (error) {
        console.error("Error fetching income!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, [userId]);

  const addIncome = async (amount, source, username, date) => {
    if (!userId) return;

    try {
      const docRef = await addDoc(collection(db, "income"), {
        userId,
        username,
        amount,
        source,
        date: Timestamp.fromDate(new Date(date)),
        type: "income",
      });

      const newIncome = {
        id: docRef.id,
        userId,
        username,
        amount,
        source,
        date: Timestamp.fromDate(new Date(date)),
        type: "income",
      };

      setIncome((prevIncome) => [...prevIncome, newIncome]);
    } catch (error) {
      console.error(("Error adding income!", error));
      throw error;
    }
  };

  const deleteIncome = async (incomeId) => {
    if (!userId) return;

    try {
      const incomeRef = doc(db, "income", incomeId);
      await deleteDoc(incomeRef);

      setIncome((prevIncome) =>
        prevIncome.filter((income) => income.id !== incomeId)
      );
    } catch (error) {
      console.error("Error deleting income!", error);
      throw error;
    }
  };

  return { income, loading, addIncome, deleteIncome };
};

export default useIncome;
