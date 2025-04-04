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

const useTransactionData = (userId, timeframe) => {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const filterTransactions = (transactions, timeframe) => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return transactions.filter((tx) => {
        if (!tx.date) return false;

        const txDate = tx.date instanceof Date ? tx.date : new Date(tx.date);
        txDate.setHours(0, 0, 0, 0); // Normalize transaction date

        console.log("Transaction Date:", tx.date, typeof tx.date);
        if (timeframe === "daily") {
          return txDate.getTime() === now.getTime();
        }

        if (timeframe === "weekly") {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          return txDate >= startOfWeek && txDate <= endOfWeek;
        }

        if (timeframe === "monthly") {
          return (
            txDate.getMonth() === now.getMonth() &&
            txDate.getFullYear() === now.getFullYear()
          );
        }

        return false;
      });
    };

    const fetchTransactions = async () => {
      console.log("Filtered Transactions:", filterTransactions);

      const incomeQuery = query(
        collection(db, "income"),
        where("userId", "==", userId)
      );
      const expensesQuery = query(
        collection(db, "expenses"),
        where("userId", "==", userId)
      );

      try {
        const [incomeSnapshot, expensesSnapshot] = await Promise.all([
          getDocs(incomeQuery),
          getDocs(expensesQuery),
        ]);

        let incomeData = incomeSnapshot.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date?.toDate
            ? doc.data().date.toDate()
            : new Date(doc.data().date),
          amount: Number(doc.data().amount || 0),
          type: "income",
        }));
        let expenseData = expensesSnapshot.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date?.toDate
            ? doc.data().date.toDate()
            : new Date(doc.data().date),
          amount: Number(doc.data().amount || 0),
          type: "expenses",
        }));

        const allTransactions = [...incomeData, ...expenseData];

        const filteredTransactions = filterTransactions(
          allTransactions,
          timeframe
        );

        const groupedData = filteredTransactions.reduce((acc, tx) => {
          const { date, amount, type } = tx;
          if (!acc[date]) {
            acc[date] = { date, income: 0, expenses: 0 };
          }
          acc[date][type] += amount;
          return acc;
        }, {});

        const formattedTransactions = Object.values(groupedData);

        const sortedTransactions = formattedTransactions.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const allTimeIncome = incomeData.reduce(
          (sum, tx) => sum + tx.amount,
          0
        );
        const allTimeExpenses = expenseData.reduce(
          (sum, tx) => sum + tx.amount,
          0
        );

        const totalIncomeFiltered = filteredTransactions
          .filter((tx) => tx.type === "income")
          .reduce((sum, tx) => sum + tx.amount, 0);
        const totalExpensesFiltered = filteredTransactions
          .filter((tx) => tx.type === "expenses")
          .reduce((sum, tx) => sum + tx.amount, 0);

        console.log("Income Filtered", totalIncomeFiltered);
        console.log("Expense Filtered:", totalExpensesFiltered);

        const newBalance = allTimeIncome - allTimeExpenses;
        const totalRevenue = incomeData.reduce((sum, tx) => sum + tx.amount, 0);

        setTransactions(sortedTransactions);
        setCurrentBalance(newBalance);
        setRevenue(totalRevenue);
        setTotalIncome(totalIncomeFiltered);
        setTotalExpenses(totalExpensesFiltered);
      } catch (error) {
        console.error("Error fetching transactions!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, timeframe]);

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

  return {
    currentBalance,
    revenue,
    totalIncome,
    totalExpenses,
    transactions,
    loading,
  };
};

export default useTransactionData;
