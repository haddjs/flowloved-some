import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const useIncome = () => {
  const [income, setIncome] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchIncome = async () => {
      try {
        const q = query(
          collection(db, "income"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const incomeData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIncome(incomeData);
      } catch (error) {
        console.error("Error fetching income: ", error);
      }
    };
    fetchIncome();
  }, [user]);
  return income;
};

export default useIncome;
