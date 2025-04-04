"use client";

import useAuth from "@/hooks/useAuth";
import useTransactionData from "@/hooks/useTransactionData";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Skeleton } from "@mui/material";

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.uid;
  const [timeframe, setTimeFrame] = useState("monthly");
  const {
    currentBalance,
    revenue,
    totalIncome,
    totalExpenses,
    transactions,
    loading,
  } = useTransactionData(userId, timeframe);

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-400/30 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Current Balance</h2>
          {loading ? (
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          ) : (
            <span>Rp. {currentBalance.toLocaleString()}</span>
          )}
        </div>
        <div className="bg-yellow-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Revenue</h2>
          {loading ? (
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          ) : (
            <span>Rp. {revenue.toLocaleString()}</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {["daily", "weekly", "monthly"].map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded-lg border border-gray-400 ${
              timeframe === option ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTimeFrame(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Income and Expenses</h2>
        <div className="flex justify-between items-center mb-5">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-green-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold">Total Income</h2>
              {loading ? (
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              ) : (
                <span>Rp. {totalIncome.toLocaleString()}</span>
              )}
            </div>
            <div className="bg-red-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold">Total Expenses</h2>
              {loading ? (
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              ) : (
                <span>Rp. {totalExpenses.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <ResponsiveContainer width="100%" height={300} className="py-3">
            <LineChart data={transactions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4CAF50" />
              <Line type="monotone" dataKey="expenses" stroke="#FF5722" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
