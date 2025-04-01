"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import useExpenses from "@/hooks/useExpenses";
import useIncome from "@/hooks/useIncome";
import useTransactionData from "@/hooks/useTransactionData";

const Transaction = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  const { totalIncome, totalExpenses, currentBalance } =
    useTransactionData(userId);
  const {
    expenses,
    loading: loadingExpenses,
    addExpenses,
  } = useExpenses(user?.uid);
  const { income, loading: loadingIncome, addIncome } = useIncome(user?.uid);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [formData, setFormData] = useState({
    username: "",
    type: "income",
    source: "",
    amount: "",
    date: new Date().toDateString(),
  });
  const [timeFrame, setTimeFrame] = useState("daily");

  if (loadingExpenses || loadingIncome) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.amount || !formData.source) {
      alert("All fields are required!");
      return;
    }

    const transactionsData = {
      username: formData.username,
      type: formData.type,
      source: formData.source,
      amount: Number(formData.amount),
      date: formData.date,
    };

    try {
      if (formData.type === "income") {
        await addIncome(
          transactionsData.amount,
          transactionsData.source,
          transactionsData.username
        );
      } else {
        await addExpenses(
          transactionsData.amount,
          transactionsData.source,
          transactionsData.username
        );
      }

      setFormData({
        username: "",
        type: "income",
        source: "",
        amount: "",
        date: new Date().toDateString(),
      });
    } catch (error) {
      console.error("Failed to add transactions", error);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        <form onSubmit={handleSubmit}>
          <label className="text-2xl font-bold">New Transactions</label>
          <div className="grid grid-cols-2">
            <div className="flex flex-col my-3 mx-3">
              <label className="py-3 text-lg">User</label>
              <input
                type="text"
                placeholder="Enter name"
                className="border border-gray-500 rounded p-3"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col my-3 mx-3">
              <label className="py-3 text-lg">Type</label>
              <select
                className="border border-gray-500 p-3"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="flex flex-col my-3 mx-3">
              <label className="py-3 text-lg">Source</label>
              <input
                type="text"
                placeholder="Source (e.g., Profit, Rent)"
                className="border border-gray-500 rounded p-3"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col my-3 mx-3">
              <label className="py-3 text-lg">Amount</label>
              <input
                type="number"
                placeholder="Rp 100.000"
                className="border border-gray-500 rounded p-3"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col my-3 mx-3">
              <label className="py-3 text-lg">Date</label>
              <input
                type="date"
                className="border border-gray-500 rounded p-3"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 rounded text-white w-40 p-3 my-3 mx-3 flex-1"
          >
            Add
          </button>
        </form>

        <div className="p-3">
          <div className="bg-blue-400/30 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Current Balance</h2>
            <span className="text-2xl font-bold">
              Rp {currentBalance.toLocaleString()}
            </span>
          </div>
          <div>
            <div className="flex gap-3 justify-end mt-5">
              {["daily", "weekly", "monthly"].map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeFrame(option)}
                  className={`px-4 py-2 rounded-2xl ${
                    timeFrame === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6 py-3">
              <div className="bg-green-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold">Total Income</h2>
                <p className="text-xl font-bold">
                  Rp {totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold">Total Expenses</h2>
                <p className="text-xl font-bold">
                  Rp {totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h1 className="text-2xl mb-5 font-bold">Transaction Logs</h1>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <Table className="text-md border border-gray-300">
            <TableHeader className="bg-gray-200">
              <TableRow className="border-b">
                <TableHead className="text-center px-4 py-3">User</TableHead>
                <TableHead className="text-center px-4 py-3">Type</TableHead>
                <TableHead className="text-center px-4 py-3">Source</TableHead>
                <TableHead className="text-center px-4 py-3">Date</TableHead>
                <TableHead className="text-center px-4 py-3">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {[...income, ...expenses].map((tx, index) => (
                <TableRow key={index} className="hover:bg-gray-100 transition">
                  <TableCell className="text-center px-4 py-3">
                    {tx.username || "Unknown"}
                  </TableCell>
                  <TableCell className="text-center px-4 py-3">
                    {tx.type
                      ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center px-4 py-3">
                    {tx.source}
                  </TableCell>
                  <TableCell className="text-center px-4 py-3">
                    {tx.date}
                  </TableCell>
                  <TableCell className="text-center px-4 py-3">
                    Rp. {tx.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
