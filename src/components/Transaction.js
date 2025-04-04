"use client";

import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import useTransactionData from "@/hooks/useTransactionData";
import useExpenses from "@/hooks/useExpenses";
import useIncome from "@/hooks/useIncome";

import { Snackbar } from "@mui/material";
import { Skeleton } from "@mui/material";

const Transaction = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  const [timeframe, setTimeFrame] = useState("daily");
  const {
    currentBalance,
    revenue,
    totalIncome,
    totalExpenses,
    transactions,
    loading,
  } = useTransactionData(userId, timeframe);
  const { loading: loadingExpenses, addExpenses } = useExpenses(userId);
  const { loading: loadingIncome, addIncome } = useIncome(userId);
  const [formData, setFormData] = useState({
    username: "",
    type: "income",
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (loadingExpenses || loadingIncome) {
    <Skeleton variant="text" sx={{ fontSize: "1rem" }} />;
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.amount || !formData.source) {
      alert("All fields are required!");
      return;
    }

    try {
      if (formData.type === "income") {
        await addIncome(
          Number(formData.amount),
          formData.source,
          formData.username,
          formData.date
        );
      } else {
        await addExpenses(
          Number(formData.amount),
          formData.source,
          formData.username,
          formData.date
        );
      }
      setFormData({
        username: "",
        type: "income",
        source: "",
        amount: "",
        date: formData.date,
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
                type="text"
                placeholder="Rp 100.000"
                className="border border-gray-500 rounded p-3"
                value={
                  formData.amount
                    ? `Rp ${Number(formData.amount).toLocaleString("id-ID")}`
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^\d]/g, "");
                  setFormData({ ...formData, amount: rawValue });
                }}
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
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <button
                onClick={() => setOpenDialog(true)}
                className="bg-green-500 rounded text-white hover:bg-green-600 transition ease-in-out w-40 p-3 my-3 mx-3 flex-1 cursor-pointer"
              >
                Add
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Transaction</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="username" className="text-right font-bold">
                    Name
                  </Label>
                  <p>{formData.username}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="type" className="text-right font-bold">
                    Type
                  </Label>
                  <p>
                    {formData.type.charAt(0).toUpperCase() +
                      formData.type.slice(1)}
                  </p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="source" className="text-right font-bold">
                    Source
                  </Label>
                  <p>{formData.source}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="amount" className="text-right font-bold">
                    Amount
                  </Label>
                  <p>Rp. {Number(formData.amount).toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="date" className="text-right font-bold">
                    Date
                  </Label>
                  <p>{formatDate(formData.date)}</p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="bg-green-500 rounded text-white hover:bg-green-600 transition ease-in-out w-40 p-3 my-3 mx-3 flex-1 cursor-pointer"
                    onClick={(e) => {
                      setTimeout(() => handleSubmit(e), 0);
                    }}
                  >
                    Confirm
                  </button>
                </DialogClose>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="outline-2 rounded text-gray-500 hover:bg-gray-200 hover:outline-1 transition ease-in-out w-40 p-3 my-3 mx-3 flex-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={() => setSnackbarOpen(false)}
            message="Success!"
          />
        </form>

        <div className="p-3">
          <div className="bg-blue-400/30 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Current Balance</h2>
            {loading ? (
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            ) : (
              <p className="text-2xl font-bold">
                Rp {currentBalance.toLocaleString()}
              </p>
            )}
          </div>
          <div>
            <div className="flex gap-3 justify-end mt-5">
              {["daily", "weekly", "monthly"].map((option) => (
                <button
                  key={option}
                  className={`px-4 py-2 rounded-lg border border-gray-400 ${
                    timeframe === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setTimeFrame(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6 py-3">
              <div className="bg-green-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold">Total Income</h2>
                {loading ? (
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                ) : (
                  <p className="text-xl font-bold">
                    Rp {totalIncome.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="bg-red-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold">Total Expenses</h2>
                {loading ? (
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                ) : (
                  <p className="text-xl font-bold">
                    Rp {totalExpenses.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
