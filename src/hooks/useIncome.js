import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const useIncome = (userId) => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

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

        console.log("Fetched Income:", incomeList);

        setIncome(incomeList);
      } catch (error) {
        console.error("Error fetching income!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, [userId]);

  const addIncome = async (amount, source, username) => {
    if (!userId) return;

    try {
      const docRef = await addDoc(collection(db, "income"), {
        userId,
        username,
        amount,
        source,
        date: new Date().toLocaleDateString("id-ID", options),
        type: "income",
      });

      const newIncome = {
        id: docRef.id,
        userId,
        username,
        amount,
        source,
        date: new Date().toLocaleDateString("id-ID", options),
        type: "income",
      };

      setIncome((prevIncome) => [...prevIncome, newIncome]);
    } catch (error) {
      console.error(("Error adding income!", error));
      throw error;
    }
  };

  return { income, loading, addIncome };
};

export default useIncome;
