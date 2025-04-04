"use client";

import useAuth from "@/hooks/useAuth";
import useTransactionData from "@/hooks/useTransactionData";
import { useState, useEffect } from "react";
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
  const [screenWidth, setScreenWidth] = useState(0);
  const {
    currentBalance,
    revenue,
    totalIncome,
    totalExpenses,
    transactions,
    loading,
  } = useTransactionData(userId, timeframe);

  useEffect(() => {
    // Set the initial screen width once the component mounts (client-side)
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(
        () => setScreenWidth(window.innerWidth),
        150
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-6 h-screen md:h-full overflow-x-hidden">
      <h1 className="text-2xl mb-5 font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6">
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
        <div className="bg-yellow-400/30 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Revenue</h2>
          {loading ? (
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          ) : (
            <p className="text-2xl font-bold">Rp {revenue.toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {["daily", "weekly", "monthly"].map((option) => (
          <button
            key={option}
            className={`px-4 py-2 rounded-lg ${
              timeframe === option ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTimeFrame(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-2">
        <h2 className="text-xl font-semibold mb-4">Income and Expenses</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-green-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Total Income</h2>
            {loading ? (
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            ) : (
              <p className="text-2xl font-bold">
                Rp {totalIncome.toLocaleString()}
              </p>
            )}
          </div>
          <div className="bg-red-400/25 backdrop-blur-lg shadow-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Total Expenses</h2>
            {loading ? (
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            ) : (
              <p className="text-2xl font-bold">
                Rp {totalExpenses.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <div className="w-full overflow-hidden">
            <div className="w-full h-[350px] md:h-[400px] lg:h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={transactions}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 30,
                    bottom: screenWidth < 768 ? 20 : 30, // Less space on mobile
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                    interval={screenWidth < 768 ? "preserveStartEnd" : 0} // Show fewer ticks on mobile
                    angle={screenWidth < 768 ? -30 : -45}
                    textAnchor="end"
                    height={screenWidth < 768 ? 50 : 70}
                    tick={{ fontSize: screenWidth < 768 ? 10 : 12 }}
                  />
                  <YAxis
                    width={screenWidth < 768 ? 30 : 100}
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#4CAF50" />
                  <Line type="monotone" dataKey="expenses" stroke="#FF5722" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
