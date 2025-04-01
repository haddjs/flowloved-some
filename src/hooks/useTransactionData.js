import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

const useTransactionData = (userId) => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        const [incomeSnapshot, expensesSnapshot] = await Promise.all([
          getDocs(
            query(collection(db, "income"), where("userId", "==", userId))
          ),
          getDocs(
            query(collection(db, "expenses"), where("userId", "==", userId))
          ),
        ]);

        let incomeData = incomeSnapshot.docs.map((doc) => ({
          date: doc.data().date,
          amount: Number(doc.data().amount || 0),
          type: "income",
        }));
        let expenseData = expensesSnapshot.docs.map((doc) => ({
          date: doc.data().date,
          amount: Number(doc.data().amount || 0),
          type: "expenses",
        }));

        const allTransactions = [...incomeData, ...expenseData];

        const groupedData = allTransactions.reduce((acc, transactions) => {
          const { date, amount, type } = transactions;

          if (!acc[date]) {
            acc[date] = { date, income: 0, expenses: 0 };
          }
          acc[date][type] += amount;

          return acc;
        }, {});

        const formattedTransactions = Object.values(groupedData);

        setTransactions(formattedTransactions);

        const newTotalIncome = incomeSnapshot.docs.reduce(
          (sum, doc) => sum + Number(doc.data().amount || 0),
          0
        );
        const newTotalExpenses = expensesSnapshot.docs.reduce(
          (sum, doc) => sum + Number(doc.data().amount || 0),
          0
        );

        const newBalance = newTotalIncome - newTotalExpenses;
        setCurrentBalance(newBalance);
        setRevenue(newTotalIncome);
        setTotalIncome(newTotalIncome);
        setTotalExpenses(newTotalExpenses);
      } catch (error) {
        console.error("Error fetching transactions!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    if (!userId || (currentBalance === 0 && revenue === 0)) return;

    const updateFinance = async () => {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          currentBalance,
          revenue,
        });
      } catch (error) {
        console.error("Error updating finance data!", error);
      }
    };

    updateFinance();
  }, [currentBalance, revenue, userId]);

  return { currentBalance, revenue, totalIncome, totalExpenses, loading };
};

export default useTransactionData;
