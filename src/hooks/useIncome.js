import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const useIncome = () => {
  const [income, setIncome] = useState([]);

  const fetchIncome = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "income"));
      const incomeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncome(incomeData);
    } catch (error) {
      console.error("Error fetching income: ", error);
    }
  };

  const addIncome = async (amount, source) => {
    try {
      const newIncome = {
        amount,
        source,
        timestap: new Date(),
      };
      await addDoc(collection(db, "income"), newIncome);
      fetchIncome();
    } catch (error) {
      console.error("Error adding income: ", error);
    }
  };

  const deleteIncome = async (id) => {
    try {
      await deleteDoc(doc(db, "income", id));
      fetchIncome();
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  const updateIncome = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "income", id), updatedData);
      fetchIncome();
    } catch (error) {
      console.error("Error updating income:", error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  return { income, addIncome, deleteIncome, updateIncome };
};

export default useIncome;
