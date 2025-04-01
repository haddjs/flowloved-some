import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const useExpenses = (userId) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  useEffect(() => {
    if (!userId) return;

    console.log(userId);

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

        console.log("Fetched Expenses:", expensesList);

        setExpenses(expensesList);
      } catch (error) {
        console.error("Error fetching expenses!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId]);

  const addExpenses = async (amount, source, username) => {
    if (!userId) return;

    try {
      const docRef = await addDoc(collection(db, "expenses"), {
        userId,
        username,
        amount,
        source,
        date: new Date().toLocaleDateString("id-ID", options),
        type: "expense",
      });

      const newExpenses = {
        id: docRef.id,
        userId,
        username,
        amount,
        source,
        date: new Date().toLocaleDateString("id-ID", options),
        type: "expense",
      };

      setExpenses((prevExpenses) => [...prevExpenses, newExpenses]);
    } catch (error) {
      console.error(("Error adding expenses!", error));
      throw error;
    }
  };

  return { expenses, loading, addExpenses };
};

export default useExpenses;
