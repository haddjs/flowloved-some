import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

const useExpenses = (userId) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "expenses"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const expensesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExpenses(expensesList);
      } catch (error) {
        console.error("Error fetching expenses!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId]);

  const addExpenses = async (amount, source, username, date) => {
    if (!userId) return;

    try {
      const docRef = await addDoc(collection(db, "expenses"), {
        userId,
        username,
        amount,
        source,
        date: Timestamp.fromDate(new Date(date)),
        type: "expense",
      });

      const newExpenses = {
        id: docRef.id,
        userId,
        username,
        amount,
        source,
        date: Timestamp.fromDate(new Date(date)),
        type: "expense",
      };

      setExpenses((prevExpenses) => [...prevExpenses, newExpenses]);
    } catch (error) {
      console.error("Error adding expenses!", error);
      throw error;
    }
  };

  const deleteExpenses = async (expenseId) => {
    if (!userId) return;

    try {
      const expenseRef = doc(db, "expenses", expenseId);
      await deleteDoc(expenseRef);

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error("Error deleting expenses!", error);
      throw error;
    }
  };

  return { expenses, loading, addExpenses, deleteExpenses };
};

export default useExpenses;
