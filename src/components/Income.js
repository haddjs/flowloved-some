"use client";

import { useState } from "react";
import useIncome from "@/hooks/useIncome";

const Income = () => {
  const { income, addIncome, deleteIncome, updateIncome } = useIncome();
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");

  const handleAddIncome = async () => {
    if (!amount || !source) return alert("Fill all fields!");
    await addIncome(parseFloat(amount), source);
    setAmount("");
    setSource("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Income List</h1>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddIncome}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="mt-4">
        {income.length > 0 ? (
          income.map((item) => (
            <li key={item.id} className="flex justify-between border p-2">
              {item.source} - {item.amount}
              <button
                onClick={() => deleteIncome(item.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No income records found.</p>
        )}
      </ul>
    </div>
  );
};

export default Income;
